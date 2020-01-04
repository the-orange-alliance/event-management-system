import * as dgram from "dgram";
import * as net from "net";
import DSConn from "./models/DSConn"
import logger from "./logger";
import {EMSProvider, FGC_CONFIG, FTC_CONFIG, MatchTimer} from "@the-orange-alliance/lib-ems";
import {error} from "winston";
import Match from "@the-orange-alliance/lib-ems/dist/models/ems/Match";

const udpDSListener = dgram.createSocket('udp4');
let tcpListener = net.createServer();


class DriverstationSupport {

    private dsTcpListenPort     = 1750;
    private dsUdpSendPort       = 1121;
    private dsUdpReceivePort    = 1160;
    private dsTcpLinkTimeoutSec = 5;
    private dsUdpLinkTimeoutSec = 1;
    private maxTcpPacketBytes   = 4096;
    private allianceStationPositionMap: Map<String, number> = new Map<String, number>([["R1", 0], ["R2", 1], ["R3", 2], ["B1", 3], ["B2", 4], ["B3", 5]]);

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

        // TODO: Handle

        // Listen for New UDP Packets
        udpDSListener.on('message', async (data: Buffer, remote) => {
            const teamDS = await this.parseUDPPacket(data, remote);
            this.allDriverStations[teamDS.allianceStation] = teamDS;
        });

        udpDSListener.bind(port, host);
    }

    private parseUDPPacket(data: Buffer, remote: any): DSConn {
        logger.info('UDP Message from ' + remote.address + ':' + remote.port +' - ' + data);

        const teamNum = data[4]<<8 + data[5];
        // Create a new Driverstation Connection
        let ds: DSConn = new DSConn();
        ds.teamId = teamNum;

        // TODO: Get Alliances from API and get alliance station number
        EMSProvider.getActiveMatch(1).then((match) => {
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
            } else {
                // couldn't decipher team key from packet. igonre.
                return null;
            }
            return null;
        }).catch(error => {
            logger.info('Error Connecting Driver Station: Could not get active match.');
            return null;
        });
        return null;
    }

    private tcpInit(port: number, host: string) {
        tcpListener = net.createServer((socket) => {
            //socket.write('things');
            socket.pipe(socket);
        });

        tcpListener.listen(port, host);

        // TODO: Handle
    }

    private newDSConnection(teamId: number, allianceStation: string, tcpConn: net.Socket): DSConn {
        // TODO
        return new DSConn();
    }

    // Sends a control packet to the Driver Station and checks for timeout conditions.
    private runDS() {

    }

    private constructControlPacket (ds: DSConn): number[] {
        const packet: Array<number> = new Array<number>(22);

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
        const match =  0; // TODO
        if (match.Type == "practice") {
            packet[6] = 1
        } else if (match.Type == "qualification") {
            packet[6] = 2
        } else if (match.Type == "elimination") {
            packet[6] = 3
        } else {
            packet[6] = 0
        }

        // Match number.
        if (match.Type == "practice" || match.Type == "qualification") {
            //matchNumber, _ := strconv.Atoi(match.DisplayName)
            packet[7] = matchNumber >> 8;
            packet[8] = matchNumber & 0xff;
        } else if (match.Type == "elimination") {
            // E.g. Quarter-final 3, match 1 will be numbered 431.
            //matchNumber := match.ElimRound*100 + match.ElimGroup*10 + match.ElimInstance
            packet[7] = matchNumber >> 8;
            packet[8] = matchNumber & 0xff;
        } else {
            packet[7] = 0
            packet[8] = 1
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
        let matchSecondsRemaining = 0;
        // Other Important Times to Know:
        const autoDurationSeconds = 15;
        const teleopDurationSeconds = 135;
        const pauseDurationSeconds = 1;
        // Current Match Timer
        const currentMatchTimerSeconds = 0; // TODO: Get from Websocket

        const matchState = 0; // TODO: Get From API ?Maybe Not?
        switch (matchState) {
            case 0: // PreMatch:
                break;
            case 1: // TimeoutActive:
                break;
            case 2: // PostTimeout:
                matchSecondsRemaining = autoDurationSeconds;
                break;
            case 3: // StartMatch:
                break;
            case 4: // AutoPeriod:
                matchSecondsRemaining = autoDurationSeconds - currentMatchTimerSeconds;
                break;
            case 5: // PausePeriod:
                matchSecondsRemaining = teleopDurationSeconds;
                break;
            case 6: // TeleopPeriod:
                matchSecondsRemaining = autoDurationSeconds + teleopDurationSeconds + pauseDurationSeconds - currentMatchTimerSeconds;
                break;
            default:
                matchSecondsRemaining = 0;
                break;
        }
        packet[20] = matchSecondsRemaining >> 8 & 0xff;
        packet[21] = matchSecondsRemaining & 0xff;

        // Increment the packet count for next time.
        ds.packetCount++;

        return packet;
    }
}


export default DriverstationSupport.getInstance();
