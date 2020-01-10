import * as dgram from "dgram";
import * as net from "net";
import DSConn from "./models/DSConn"
import logger from "./logger";
import {EmsFrcFms} from "./server";
import Match from "@the-orange-alliance/lib-ems/dist/models/ems/Match";
import {SocketProvider} from "@the-orange-alliance/lib-ems";

const udpDSListener = dgram.createSocket("udp4");
let tcpListener = net.createServer();


export class DriverstationSupport {

    private dsTcpListenPort     = 1750;
    private dsUdpSendPort       = 1121;
    private dsUdpReceivePort    = 1160;
    private dsTcpLinkTimeoutSec = 5;
    private dsUdpLinkTimeoutSec = 1;
    private maxTcpPacketBytes   = 4096;

    // TODO: Figure this out
    public colorToSend = 0;

    private allDriverStations: Array<DSConn> = new Array(6);

    private static _instance: DriverstationSupport;

    public constructor() {
    }

    public static getInstance(): DriverstationSupport {
        if (typeof DriverstationSupport._instance === "undefined") {
            DriverstationSupport._instance = new DriverstationSupport();
        }
        return DriverstationSupport._instance;
    }

    dsInit(host: string): any {
        this.udpInit(this.dsUdpReceivePort, host);
        this.tcpInit(this.dsTcpListenPort, host);
    }

    // Init the UDP Server: This listens for new drivers stations
    private udpInit(port: number, host: string) {
        udpDSListener.on('listening', function() {
            const address = udpDSListener.address();
            logger.info('Listening for DriverStations on UDP ' + address.address + ':' + address.port);
        });

        udpDSListener.on('error', function() {
            const address = udpDSListener.address();
            logger.info('Error Listening for DriverStations on UDP ' + address.address + ':' + address.port + '. Please make sure you IP Address is set correctly.');
        });

        // Listen for New UDP Packets
        udpDSListener.on('message', (data: Buffer, remote) => {
            this.parseUDPPacket(data, remote);
        });

        udpDSListener.bind(port, host);
    }

    // Parse a UDP packet from the Driver Station
    private parseUDPPacket(data: Buffer, remote: any) {
        const teamNum = (data[4]<<8) + data[5];
        if(teamNum) { // if team id is defined
            let i = 0;
            while(i < this.allDriverStations.length) { // run through current driver staions
                if(this.allDriverStations[i] && this.allDriverStations[i].teamId === teamNum) { // found team in DS list
                    this.allDriverStations[i].dsLinked = true;
                    this.allDriverStations[i].lastPacketTime = Date.now();

                    this.allDriverStations[i].radioLinked = (data[3]&0x10) !== 0;
                    this.allDriverStations[i].robotLinked = (data[3]&0x20) !== 0;
                    if (this.allDriverStations[i].robotLinked) {
                        this.allDriverStations[i].lastRobotLinkedTime = Date.now();
                        // Robot battery voltage, stored as volts * 256.
                        this.allDriverStations[i].batteryVoltage = data[6] + data[7]/256;
                    }
                    return;
                }
                i++;
            }
            // if for loop exits, we didn't find team in active match
            logger.info('Couldn\'t find DS matched to UDP packet. Ignoring. ');
        } else {
            // Probably just a keepalive packet?
            //logger.info('Couldn\'t decipher team number from UDP packet');
        }
    }

    // Init the TCP server: This create connections to each Driver Station
    private tcpInit(port: number, host: string) {
        tcpListener = net.createServer((socket: net.Socket) => {
            //socket.pipe(socket);
        });

        tcpListener.listen(port, host);

        tcpListener.on("listening", () => {
            logger.info('Listening for DriverStations on TCP ' + host + ':' + port);
        });

        tcpListener.on("connection", (socket: net.Socket) => {
            socket.setTimeout(this.dsTcpLinkTimeoutSec * 1000);

            if(this.allDriverStations[0]) {
                logger.info(`New DS TCP Connection Established for ${socket.remoteAddress}:${socket.remotePort}`);
                // this should read the first packet and assign the TCP connection to the proper alliance member
                socket.on('data', (chunk: Buffer) => {
                    this.parseTcpPacket(chunk, socket, socket.remoteAddress);
                });

                socket.on("timeout", (err: Error) => logger.info("Driver Station TCP Timeout"));
                socket.on("close", (wasError: boolean) => logger.info("Driver Station TCP Closed. wasError: " + wasError));
                socket.on("error", (err: Error) => logger.info('Error occurred on Driver Station TCP socket: ' + JSON.stringify(err)));
            } else {
                socket.destroy();
            }
        });

        tcpListener.on("close", () => logger.info('DriverStation TCP Listener Closed'));

        tcpListener.on('error', (chunk: Buffer) => {
            logger.info('Driver Station TCP listener Error.');
        });
    }

    // Parse TCP packet from the Driver STation
    private parseTcpPacket(chunk: Buffer, socket: net.Socket, remoteAddress: string | undefined) {
        const teamId = (chunk[3]<<8) + (chunk[4]);
        let station = -1;
        let recievedFirstPacket = false;
        if(this.allDriverStations[0]) { // Checks if we have driver stations
            for(const ds of this.allDriverStations) {
                if(ds && ds.teamId === teamId) {
                    station = ds.allianceStation;
                    recievedFirstPacket = ds.recievedFirstPacket;
                    break;
                }
            }

            if(station > -1 && !recievedFirstPacket && chunk.length === 5) {
                this.handleFirstTCP(chunk, socket, teamId, station, remoteAddress);
            } else if (chunk.length !== 5) {
                this.handleRegularTCP(chunk, socket);
            } else {
                logger.info('Rejecting DS Connection from team ' + teamId + ' who is not in the current match.');
                setTimeout(function(){ // wait before disconnecting
                    socket.destroy();
                }, 1000);
            }
        } else {
            // logger.info('Driver Station tried connection, but failed due to no active match'); // Clogs u
            socket.destroy();
        }
    }

    // parse a regular TCP packet
    private handleRegularTCP(chunk: Buffer, socket: net.Socket) {
        const teamNum = this.getTeamFromIP(socket.remoteAddress);

        for(const i in this.allDriverStations) { // Find DS to match with
            if(this.allDriverStations[i].teamId == teamNum) {
                const packetType = chunk[2];
                switch (packetType) {
                    case 28:  logger.info('DS KeepAlive'); break; // DS KeepAlive Packet, do nothing
                    case 22:
                        this.decodeStatusPacket(chunk.slice(2), parseInt(i));
                }
                break;
            }
        }
        // TODO Log packet when match is in progress
    }

    private getTeamFromIP(address: any): number {
        const ipAddress = address;
        if(!ipAddress) {
            logger.info('Could not get IP address from first TCP packet. Ignoring.');
            return -1;
        }
        const teamRegex = new RegExp("\\d+\\.(\\d+)\\.(\\d+)\\.");
        const teamDigits = teamRegex.exec(ipAddress);
        if (!teamDigits) {
            logger.info('Could not get team number from IP Address');
            return -1
        }
        const td1 = parseInt(teamDigits[1]);
        const td2 = parseInt(teamDigits[2]);
        return (td1*100) + td2;
    }

    // Parse the initial packet that the driver station sends
    private handleFirstTCP(chunk: Buffer, socket: net.Socket, teamId: number, station: number, remoteAddress: string | undefined) {
        if(chunk.length < 5) {
            // invalid TCP packet, ignore
            socket.destroy();
            return;
        }
        const teamFromPacket = (chunk[3]<<8) + chunk[4];
        // Read the team number from the IP address to check for a station mismatch.
        let dsStationStatus = 0;
        const stationTeamId = this.getTeamFromIP(socket.remoteAddress);
        if(stationTeamId < 0) {
            return;
        }
        if(stationTeamId != teamFromPacket) {
            logger.info(`Team ${teamId} is in the incorrect station (Currently at ${stationTeamId}'s Station)`);
            dsStationStatus = 1;
        }
        // Build Setup Packet
        // Note: If the DS gets a station status of 1, then it will Close the TCP connection, and cause a constant reconnect loop
        let returnPacket: Buffer = Buffer.alloc(5);
        returnPacket[0] = 0; // Packet Size
        returnPacket[1] = 3; // Packet Size
        returnPacket[2] = 25; // Packet Type
        returnPacket[3] = this.convertEMSStationToFMS(station + ''); // Station
        returnPacket[4] = dsStationStatus; // Station Status
        // Station Status:
        // 1 = "Move to Station <Assigned Station>"
        // 2 = "Waiting..."
        if(socket.write(returnPacket)) {
            logger.info(`Accepted ${teamId}'s DriverStation in station ${station}`); // TODO: Include Station # and color in log
            const fmsStation = this.convertEMSStationToFMS(station + '');
            this.allDriverStations[fmsStation] = this.newDSConnection(teamId, station, socket, remoteAddress);
            this.sendControlPacket(fmsStation);
        } else {
            logger.info('Failed to send first packet to team ' + teamId + '\'s driver station');
        }
    }

    // Create a new DS Connection Object
    private newDSConnection(teamId: number, allianceStation: number, socket: net.Socket, remoteAddress: string | undefined): DSConn {
        const newDs = new DSConn();
        newDs.teamId = teamId;
        newDs.recievedFirstPacket = true;
        newDs.tcpConn = socket;
        newDs.udpConn = dgram.createSocket("udp4");
        if(remoteAddress) newDs.ipAddress = remoteAddress;
        newDs.allianceStation = allianceStation;
        newDs.dsLinked = true;
        newDs.secondsSinceLastRobotLink = 0;
        newDs.lastPacketTime = Date.now();
        newDs.lastRobotLinkedTime = Date.now();
        return newDs;
    }

    // This converts an EMS station to an FMS Station
    // Ex. 11 = Red Alliance 1, Which will become Station 0
    // Ex. 23 = Blue Alliance 3, Which will become Station 5
    private convertEMSStationToFMS(emsStation: string): number{
        const firstDigit = parseInt(emsStation.charAt(0));
        const secondDigit = parseInt(emsStation.charAt(1));
        const multiply = firstDigit*secondDigit;
        return multiply - 1;
    }

    // Run all this stuff
    public runDriverStations() {
        let i = 0;
        while(i < this.allDriverStations.length) {
            if(this.allDriverStations[i]){
                if(this.allDriverStations[i].udpConn) {
                    this.sendControlPacket(i); // TODO: Don't need to send this every time, unless it's during match
                }
                const diff = Date.now() - new Date(this.allDriverStations[i].lastPacketTime).getDate();
                if(Math.abs(diff/1000) > this.dsTcpLinkTimeoutSec) {
                    this.allDriverStations[i].dsLinked = false;
                    this.allDriverStations[i].radioLinked = false;
                    this.allDriverStations[i].robotLinked = false;
                    this.allDriverStations[i].batteryVoltage = 0;
                }
                this.allDriverStations[i].secondsSinceLastRobotLink = Math.abs(diff/1000);
            }
            i++;
            SocketProvider.emit('ds-update-all', JSON.stringify(this.dsToJsonObj()));
        }
    }

    private dsToJsonObj(): object[] {
        const returnObj: object[] = [];
        let i = 0;
        while(i < this.allDriverStations.length) {
            if(this.allDriverStations[i]) returnObj.push(this.allDriverStations[i].toJson());
            i++;
        }
        return returnObj;
    }

    // Send Control Packet
    private sendControlPacket(dsNum: number) {
        const packet = this.constructControlPacket(dsNum);
        if(this.allDriverStations[dsNum].udpConn) {
            this.allDriverStations[dsNum].udpConn.send(packet, this.dsUdpSendPort, this.allDriverStations[dsNum].ipAddress, (err) => {
                // Yes?
            });
        }
    }

    // Things to do on match start
    public driverStationMatchStart() {
        for(const ds in this.allDriverStations) {
            this.allDriverStations[ds].missedPacketOffset = this.allDriverStations[ds].missedPacketCount;
        }
    }

    // Close all connections to the driver station
    private closeDsConn(dsNum: number) {
        if(this.allDriverStations[dsNum] && this.allDriverStations[dsNum].udpConn) {
            this.allDriverStations[dsNum].udpConn.close();
        }
        if(this.allDriverStations[dsNum] && this.allDriverStations[dsNum].tcpConn) {
            this.allDriverStations[dsNum].tcpConn.destroy();
        }
    }

    // Close All DS Connections
    private closeAllDSConns() {
        let i = 0;
        while(i < this.allDriverStations.length) {
            this.closeDsConn(i);
            i++;
        }
    }

    // DriverStation Things to do on prestart
    public onPrestart(match: Match) {
        // Close all DS Connections before we overwrite them
        this.closeAllDSConns();
        // Init New DriverStation Objects
        for(const t in match.participants) { // run through list of match participants looking for a match
            const ds = new DSConn();
            ds.teamId = match.participants[t].teamKey;
            ds.allianceStation = match.participants[t].station;
            this.allDriverStations[t] = ds;
        }
        logger.info('Driver Station Prestart Completed');
    }

    // Construct a control packet for the Driver Station
    private constructControlPacket (dsNum: number): Uint8Array {
        const packet: Uint8Array = new Uint8Array(22);
        const activeMatch = EmsFrcFms.getInstance().activeMatch;

        // Packet number, stored big-endian in two bytes.
        packet[0] = (this.allDriverStations[dsNum].packetCount >> 8) & 0xff;
        packet[1] = this.allDriverStations[dsNum].packetCount & 0xff;

        // Protocol version.
        packet[2] = 0;

        // Robot status byte.
        packet[3] = 0;
        if (this.allDriverStations[dsNum].auto) {
            packet[3] |= 0x02
        }
        if (this.allDriverStations[dsNum].enabled) {
            packet[3] |= 0x04
        }
        if (this.allDriverStations[dsNum].estop) {
            packet[3] |= 0x80
        }

        // Unknown or unused. (Possibly Game data?)
        packet[4] = this.colorToSend;

        // Alliance station.
        packet[5] = this.allDriverStations[dsNum].allianceStation;

        // Match type
        const match = activeMatch.matchName;
        if (match.toLowerCase().indexOf("prac") > -1) {
            packet[6] = 1
        } else if (match.toLowerCase().indexOf("qual") > -1) {
            packet[6] = 2
        } else if (match.toLowerCase().indexOf("elim") > -1) {
            packet[6] = 3
        } else {
            packet[6] = 0
        }

        // Match number.
        const split = activeMatch.matchKey.split('-');
        const localMatchNum = parseInt(split[split.length-1].substr(1))
        if (match.toLowerCase().indexOf("practice") > -1 || match.toLowerCase().indexOf("qual") > -1) {
            packet[7] = localMatchNum >> 8;
            packet[8] = localMatchNum & 0xff;
        } else if (match.toLowerCase().indexOf("elim") > -1 ) {
            // E.g. Quarter-final 3, match 1 will be numbered 431. TODO: aaaaaaaaaaaa
            //matchNumber := match.ElimRound*100 + match.ElimGroup*10 + match.ElimInstance
            //packet[7] = matchNumber >> 8;
            //packet[8] = matchNumber & 0xff;
        } else {
            packet[7] = 0;
            packet[8] = 1;
        }
        // Match repeat number
        packet[9] = 1;

        // Current time.
        const currentTime = new Date(Date.now());
        const nanoSeconds = currentTime.getMilliseconds() * 1000000;
        packet[10] = ((nanoSeconds / 1000) >> 24) & 0xff;
        packet[11] = ((nanoSeconds / 1000) >> 16) & 0xff;
        packet[12] = ((nanoSeconds / 1000) >> 8) & 0xff;
        packet[13] = (nanoSeconds / 1000) & 0xff;
        packet[14] = currentTime.getSeconds();
        packet[15] = currentTime.getMinutes();
        packet[16] = currentTime.getHours();
        packet[17] = currentTime.getDay();
        packet[18] = currentTime.getMonth();
        packet[19] = currentTime.getFullYear() - 1900;

        // Remaining number of seconds in match.
        const matchSecondsRemaining = EmsFrcFms.getInstance().timeLeft;

        packet[20] = matchSecondsRemaining >> 8 & 0xff;
        packet[21] = matchSecondsRemaining & 0xff;

        // Increment the packet count for next time.
        this.allDriverStations[dsNum].packetCount++;

        return packet;
    }

    // Decodes a Driver Station status packet
    private decodeStatusPacket(data: Buffer, dsNum: number) {
        // Average DS-robot trip time in milliseconds.
        this.allDriverStations[dsNum].dsRobotTripTimeMs = data[1] / 2;

        // Number of missed packets sent from the DS to the robot.
        this.allDriverStations[dsNum].missedPacketCount = data[2] - this.allDriverStations[dsNum].missedPacketOffset;
    }
}


export default DriverstationSupport.getInstance();