import * as dgram from "dgram";
import * as net from "net";

export default class DSConn {
    private _teamId:                    number;
    private _allianceStation:           number;
    private _auto:                      boolean;
    private _enabled:                   boolean;
    private _estop:                     boolean;
    private _dsLinked:                  boolean;
    private _radioLinked:               boolean;
    private _robotLinked:               boolean;
    private _batteryVoltage:            number;
    private _dsRobotTripTimeMs:         number;
    private _missedPacketCount:         number;
    private _secondsSinceLastRobotLink: number;
    private _lastPacketTime:            number; // date
    private _lastRobotLinkedTime:       number; // date
    private _packetCount:               number;
    private _ipAddress:                 string;
    private _missedPacketOffset:        number;
    private _recievedFirstPacket:       boolean;
    private _tcpConn:                   net.Socket;
    private _udpConn:                   dgram.Socket;
    // TODO Add Logging functionality

    constructor() {
        this._teamId = -1;
        this._allianceStation = -1;
        this._auto = false;
        this._enabled = false;
        this._estop = false;
        this._dsLinked = false;
        this._radioLinked = false;
        this._robotLinked = false;
        this._batteryVoltage = 0;
        this._dsRobotTripTimeMs = 0;
        this._missedPacketCount = 0;
        this._secondsSinceLastRobotLink = 0;
        this._lastPacketTime = 0;
        this._lastRobotLinkedTime = 0;
        this._packetCount = 0;
        this._ipAddress = '';
        this._missedPacketOffset = 0;
        this._recievedFirstPacket = false;
        this._tcpConn = new net.Socket();
        this._udpConn = dgram.createSocket("udp4");
    }

    get teamId(): number {
        return this._teamId;
    }

    set teamId(value: number) {
        this._teamId = value;
    }

    get allianceStation(): number {
        return this._allianceStation;
    }

    set allianceStation(value: number) {
        this._allianceStation = value;
    }

    get auto(): boolean {
        return this._auto;
    }

    set auto(value: boolean) {
        this._auto = value;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    get estop(): boolean {
        return this._estop;
    }

    set estop(value: boolean) {
        this._estop = value;
    }

    get dsLinked(): boolean {
        return this._dsLinked;
    }

    set dsLinked(value: boolean) {
        this._dsLinked = value;
    }

    get radioLinked(): boolean {
        return this._radioLinked;
    }

    set radioLinked(value: boolean) {
        this._radioLinked = value;
    }

    get robotLinked(): boolean {
        return this._robotLinked;
    }

    set robotLinked(value: boolean) {
        this._robotLinked = value;
    }

    get batteryVoltage(): number {
        return this._batteryVoltage;
    }

    set batteryVoltage(value: number) {
        this._batteryVoltage = value;
    }

    get dsRobotTripTimeMs(): number {
        return this._dsRobotTripTimeMs;
    }

    set dsRobotTripTimeMs(value: number) {
        this._dsRobotTripTimeMs = value;
    }

    get missedPacketCount(): number {
        return this._missedPacketCount;
    }

    set missedPacketCount(value: number) {
        this._missedPacketCount = value;
    }

    get secondsSinceLastRobotLink(): number {
        return this._secondsSinceLastRobotLink;
    }

    set secondsSinceLastRobotLink(value: number) {
        this._secondsSinceLastRobotLink = value;
    }

    get lastPacketTime(): number {
        return this._lastPacketTime;
    }

    set lastPacketTime(value: number) {
        this._lastPacketTime = value;
    }

    get lastRobotLinkedTime(): number {
        return this._lastRobotLinkedTime;
    }

    set lastRobotLinkedTime(value: number) {
        this._lastRobotLinkedTime = value;
    }

    get packetCount(): number {
        return this._packetCount;
    }

    set packetCount(value: number) {
        this._packetCount = value;
    }

    get ipAddress(): string {
        return this._ipAddress;
    }

    set ipAddress(value: string) {
        this._ipAddress = value;
    }

    get missedPacketOffset(): number {
        return this._missedPacketOffset;
    }

    set missedPacketOffset(value: number) {
        this._missedPacketOffset = value;
    }

    get recievedFirstPacket(): boolean {
        return this._recievedFirstPacket;
    }

    set recievedFirstPacket(value: boolean) {
        this._recievedFirstPacket = value;
    }

    get tcpConn(): net.Socket {
        return this._tcpConn;
    }

    set tcpConn(value: net.Socket) {
        this._tcpConn = value;
    }

    get udpConn(): dgram.Socket {
        return this._udpConn;
    }

    set udpConn(value: dgram.Socket) {
        this._udpConn = value;
    }
}
