import * as dgram from "dgram";
import * as net from "net";

export default class DSConn {
    private _teamId:                    number;
    private _allianceStation:           string;
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
    private _lastPacketTime:            Date;
    private _lastRobotLinkedTime:       Date;
    private _packetCount:               number;
    private _missedPacketOffset:        number;
    private _tcpConn:                   dgram.Socket;
    private _udpConn:                   net.Socket;
    // TODO Add Logging functionality

    constructor() {
        // TODO: we may need this
    }

    get teamId(): number {
        return this._teamId;
    }

    set teamId(value: number) {
        this._teamId = value;
    }

    get allianceStation(): string {
        return this._allianceStation;
    }

    set allianceStation(value: string) {
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

    get missedPacketOffset(): number {
        return this._missedPacketOffset;
    }

    set missedPacketOffset(value: number) {
        this._missedPacketOffset = value;
    }

    get tcpConn(): dgram.Socket {
        return this._tcpConn;
    }

    set tcpConn(value: dgram.Socket) {
        this._tcpConn = value;
    }

    get udpConn(): net.Socket {
        return this._udpConn;
    }

    set udpConn(value: net.Socket) {
        this._udpConn = value;
    }
}
