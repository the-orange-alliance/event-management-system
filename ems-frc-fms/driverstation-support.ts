import * as dgram from "dgram";
import * as net from "net";
import DSConn from "./models/DSConn"
import logger from "./logger";

const udpDSListener = dgram.createSocket('udp4');
let tcpListener = net.createServer();


class DriverstationSupport {

    private dsTcpListenPort     = 1750;
    private dsUdpSendPort       = 1121;
    private dsUdpReceivePort    = 1160;
    private dsTcpLinkTimeoutSec = 5;
    private dsUdpLinkTimeoutSec = 1;
    private maxTcpPacketBytes   = 4096;

    private static _instance: DriverstationSupport;

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
        udpDSListener.on('message', (message: Buffer, remote) => {
            this.parseUDPPacket(message, remote);
        });

        udpDSListener.bind(port, host);
    }

    private parseUDPPacket(message: Buffer, remote: any) {
        logger.info('UDP Message from ' + remote.address + ':' + remote.port +' - ' + message);

        const teamNum = message[4]<<8 + message[5];
        // Create a new Driverstation Connection
        let DSConn;

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
}


export default DriverstationSupport.getInstance();