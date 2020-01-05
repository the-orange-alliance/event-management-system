import * as dgram from "dgram";
import * as net from "net";
import DSConn from "./models/DSConn"
import logger from "./logger";
import {EMSProvider, SocketProvider} from "@the-orange-alliance/lib-ems";
import {EmsFrcFms} from "./server";
import Match from "@the-orange-alliance/lib-ems/dist/models/ems/Match";

const udpDSListener = dgram.createSocket('udp4');
let tcpListener = net.createServer();


export class DriverstationSupport {

    private dsTcpListenPort     = 1750;
    private dsUdpSendPort       = 1121;
    private dsUdpReceivePort    = 1160;
    private dsTcpLinkTimeoutSec = 5;
    private dsUdpLinkTimeoutSec = 1;
    private maxTcpPacketBytes   = 4096;
    private connectedToTOASock  = false;

    private allDriverStations: Array<DSConn> = new Array(6);
    private currentMatch: Match = new Match(); // TODO: Update via websocket so it doesnt suck (currently updating when DS connects)

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
        EMSProvider.initialize(host, parseInt(process.env.API_PORT as string, 10));

        this.udpInit(this.dsUdpReceivePort, host);
        this.tcpInit(this.dsTcpListenPort, host);
    }

    private udpInit(port: number, host: string) {
        udpDSListener.on('listening', function() {
            const address = udpDSListener.address();
            console.log('Listening for DriverStations on UDP ' + address.address + ':' + address.port);
        });

        udpDSListener.on('error', function() {
            const address = udpDSListener.address();
            console.log('Error Listening for DriverStations on UDP ' + address.address + ':' + address.port + '. Please make sure you IP Address is set correctly.');
        });

        // Listen for New UDP Packets
        udpDSListener.on('message', (data: Buffer, remote) => {
            const teamDS = this.parseUDPPacket(data, remote);
            if(teamDS != null) {
                // Close any open connections first
                if(this.allDriverStations[teamDS.allianceStation]) {
                    this.closeDsConn(teamDS.allianceStation)
                }
                this.allDriverStations[teamDS.allianceStation] = teamDS;
            }
        });

        udpDSListener.bind(port, host);
    }

    private parseUDPPacket(data: Buffer, remote: any): DSConn {
        logger.info('UDP Message from ' + remote.address + ':' + remote.port +' - ' + data);

        const teamNum = data[4]<<8 + data[5];
        // Create a new Driverstation Connection
        let ds: DSConn = new DSConn();
        ds.teamId = teamNum;
        const match = EmsFrcFms.getInstance().activeMatch;
        if(ds.teamId) { // if team id is defined
            for(const t of match.participants) { // run through list of match participants looking for a match
                if(t.team.teamKey === ds.teamId) { // found team in match participants, lets fill out alliance station
                    ds.dsLinked = true;
                    ds.allianceStation = t.station;
                    ds.lastPacketTime = Date.now();

                    ds.radioLinked = (data[3]&0x10) !== 0;
                    ds.robotLinked = (data[3]&0x20) !== 0;
                    if (ds.robotLinked) {
                        ds.lastRobotLinkedTime = Date.now();
                        // Robot battery voltage, stored as volts * 256.
                        ds.batteryVoltage = data[6] + data[7]/256;
                    }
                    return ds;
                }
            }
            // if for loop exits, we didn't find team in active match
            logger.info('Not connecting to ' + ds.teamId + '\'s driver station in active match. Refusing connection');
            return null;
        } else {
            // couldn't decipher team key from packet. igonre.
            return null;
        }
    }

    private tcpInit(port: number, host: string) {
        tcpListener = net.createServer((socket) => {
            socket.pipe(socket);
        });

        tcpListener.listen(port, host);

        tcpListener.addListener("connection", (data) => {
            logger.info('TCP Connection Established ' + data);
            data.connect()

        });

        tcpListener.addListener("listening", () => {
            logger.info('TCP Server Listening on ' + host + ':' + port);
        });

        // TODO: Handle
    }

    private newDSConnection(teamId: number, allianceStation: string, tcpConn: net.Socket): DSConn {
        // TODO
        return new DSConn();
    }

    // Run all this stuff
    private runDS() {
        // TODO
    }

    // Send Control Packet
    private sendControlPacket(ds: DSConn) {
        const packet = this.constructControlPacket(ds);
        if(ds.udpConn) {
            ds.udpConn.send(packet, this.dsUdpReceivePort, (err) => {
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
        if(this.allDriverStations[dsNum].udpConn) {
            this.allDriverStations[dsNum].udpConn.close();
        }
        if(this.allDriverStations[dsNum].tcpConn) {
            this.allDriverStations[dsNum].tcpConn.end();
        }
    }

    // Construct a control packet for the Driver Station
    private constructControlPacket (ds: DSConn): Uint8Array {
        const packet: Uint8Array = new Uint8Array(22);
        const activeMatch = EmsFrcFms.getInstance().activeMatch;

        // Packet number, stored big-endian in two bytes.
        packet[0] = (ds.packetCount >> 8) & 0xff;
        packet[1] = ds.packetCount & 0xff;

        // Protocol version.
        packet[2] = 0;

        // Robot status byte.
        packet[3] = 0;
        if (ds.auto) {
            packet[3] |= 0x02
        }
        if (ds.enabled) {
            packet[3] |= 0x04
        }
        if (ds.estop) {
            packet[3] |= 0x80
        }

        // Unknown or unused.
        packet[4] = 0;

        // Alliance station.
        packet[5] = ds.allianceStation;

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
        ds.packetCount++;

        return packet;
    }

    // Decodes a Driver Station status packet
    private decodeStatusPacket(data, dsNum: number) {
        // Average DS-robot trip time in milliseconds.
        this.allDriverStations[dsNum].dsRobotTripTimeMs = data[1] / 2;

        // Number of missed packets sent from the DS to the robot.
        this.allDriverStations[dsNum].missedPacketCount = data[2] - this.allDriverStations[dsNum].missedPacketOffset;
    }
}


export default DriverstationSupport.getInstance();
