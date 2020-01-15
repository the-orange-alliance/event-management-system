import logger from "./logger";
import {ReadCoilResult, ReadRegisterResult} from "modbus-serial/ModbusRTU";

// Modbus Crash Course
// Registers: ?Counters?
// Inputs: Discrete Inputs (E-Stops)
// Coils: Outputs to PLC (Stack lights, LED Strips, Etc)

export class PlcSupport {
  private static _instance: PlcSupport;

  private ModbusRTU = require('modbus-serial');

  private modBusPort = 502;

  private client = new this.ModbusRTU();
  private plc = new PlcStatus();

  private firstConn = false;

  public static getInstance(): PlcSupport {
    if (typeof PlcSupport._instance === "undefined") {
      PlcSupport._instance = new PlcSupport();
    }
    return PlcSupport._instance;
  }

  public initPlc(address: string) {
    this.plc.address = address;
    this.client.connectTCP(this.plc.address, { port: this.modBusPort }).then(() => {
      logger.info('Connected to PLC at ' + this.plc.address + ':' + this.modBusPort);
    }).catch((err: any) => {
      logger.info('Failed to connect to PLC: ' + err);
      this.firstConn = true;
    });
    logger.info('Attempting to connect to PLC');
    this.client.setID(1);
  }

  public runPlc() {
    if(!this.client.isOpen) {
      if(this.firstConn) {
        logger.info('Lost connection to PLC, retrying');
        this.firstConn = false;
        this.initPlc(this.plc.address);
      }
    } else {
      this.client.readHoldingRegisters(0, 10).then((data: ReadRegisterResult) =>{
        this.plc.registers = data.data;
      });

      this.client.readDiscreteInputs(0, this.plc.inputs.inputCount).then((data:ReadCoilResult) => {
        this.plc.inputs.fromArray(data.data);
      });

      if(this.plc.oldCoils.equals(this.plc.coils)) {
        this.plc.coils.heartbeat = true;
        this.client.writeCoils(0, this.plc.coils.getCoilArray()).catch((err: any) => {
          logger.info('Error writing coils: ' + err);
        });
      }
    }


  }
}

class PlcStatus {
  public isHealthy: boolean;
  public address: string;
  public inputs: PlcInputs;
  public registers: number[];
  public coils: PlcOutputCoils;
  public oldInputs: PlcInputs;
  public oldRegisters: [];
  public oldCoils: PlcOutputCoils;
  public cycleCounter: number;
  constructor() {
    this.isHealthy = false;
    this.address = '10.0.100.10';
    this.inputs = new PlcInputs();
    this.registers = [];
    this.coils = new PlcOutputCoils();
    this.oldInputs = new PlcInputs();
    this.oldRegisters = [];
    this.oldCoils = new PlcOutputCoils();
    this.cycleCounter = -1;
  }
}

class PlcInputs {
  public fieldEstop: boolean;
  public redEstop1: boolean;
  public redEstop2: boolean;
  public redEstop3: boolean;
  public blueEstop1: boolean;
  public blueEstop2: boolean;
  public blueEstop3: boolean;
  public redConnected1: boolean;
  public redConnected2: boolean;
  public redConnected3: boolean;
  public blueConnected1: boolean;
  public blueConnected2: boolean;
  public blueConnected3: boolean;
  public inputCount: number;

  constructor() {
    this.fieldEstop = false;
    this.redEstop1 = false;
    this.redEstop2 = false;
    this.redEstop3 = false;
    this.blueEstop1 = false;
    this.blueEstop2 = false;
    this.blueEstop3 = false;
    this.redConnected1 = false;
    this.redConnected2 = false;
    this.redConnected3 = false;
    this.blueConnected1 = false;
    this.blueConnected2 = false;
    this.blueConnected3 = false;
    this.inputCount = 13;
  }

  public fromArray(inputs: boolean[]) {
    if(inputs.length > 6) {
      this.fieldEstop = inputs[0];
      this.redEstop1 = inputs[1];
      this.redEstop2 = inputs[2];
      this.redEstop3 = inputs[3];
      this.blueEstop1 = inputs[4];
      this.blueEstop2 = inputs[5];
      this.blueEstop3 = inputs[6];
    } else {
      logger.info('Error reading inputs from PLC. Received Input length not long enough')
    }
    if(inputs.length > 12) {
      this.redConnected1 = inputs[7];
      this.redConnected2 = inputs[8];
      this.redConnected3 = inputs[9];
      this.blueConnected1 = inputs[10];
      this.blueConnected2 = inputs[11];
      this.blueConnected3 = inputs[12];
    }
  }
}

class PlcOutputCoils {
  public heartbeat: boolean;
  public matchReset: boolean;
  public stackLightGreen: boolean;
  public stackLightOrange: boolean;
  public stackLightRed: boolean;
  public stackLightBlue: boolean;
  public stackLightBuzzer: boolean;
  public gameElement0: boolean;
  public gameElement1: boolean;
  public gameElement2: boolean;
  public gameElement3: boolean;
  public gameElement4: boolean;
  public gameElement5: boolean;
  public gameElement6: boolean;
  public gameElement7: boolean;
  public gameElement8: boolean;
  public gameElement9: boolean;
  public gameElement10: boolean;
  public unused18: boolean;
  public unused19: boolean;
  public redOneConn: boolean;
  public redTwoConn: boolean;
  public redThreeConn: boolean;
  public blueOneConn: boolean;
  public blueTwoConn: boolean;
  public blueThreeConn: boolean;
  public coilCount: number;

  constructor() {
    this.heartbeat = false;
    this.matchReset = false;
    this.stackLightGreen = false;
    this.stackLightOrange = false;
    this.stackLightRed = false;
    this.stackLightBlue = false;
    this.stackLightBuzzer = false;
    this.gameElement0 = false;
    this.gameElement1 = false;
    this.gameElement2 = false;
    this.gameElement3 = false;
    this.gameElement4 = false;
    this.gameElement5 = false;
    this.gameElement6 = false;
    this.gameElement7 = false;
    this.gameElement8 = false;
    this.gameElement9 = false;
    this.gameElement10 = false;
    this.unused18 = false;
    this.unused19 = false;
    this.redOneConn = false;
    this.redTwoConn = false;
    this.redThreeConn = false;
    this.blueOneConn = false;
    this.blueTwoConn = false;
    this.blueThreeConn = false;
    this.coilCount = 26;
  }

  public getCoilArray(): boolean[] {
    const allCoils: boolean[] = [];
    allCoils.push(this.heartbeat);
    allCoils.push(this.matchReset);
    allCoils.push(this.stackLightGreen);
    allCoils.push(this.stackLightOrange);
    allCoils.push(this.stackLightRed);
    allCoils.push(this.stackLightBlue);
    allCoils.push(this.stackLightBuzzer);
    allCoils.push(this.gameElement0);
    allCoils.push(this.gameElement1);
    allCoils.push(this.gameElement2);
    allCoils.push(this.gameElement3);
    allCoils.push(this.gameElement4);
    allCoils.push(this.gameElement5);
    allCoils.push(this.gameElement6);
    allCoils.push(this.gameElement7);
    allCoils.push(this.gameElement8);
    allCoils.push(this.gameElement9);
    allCoils.push(this.gameElement10);
    allCoils.push(this.unused18);
    allCoils.push(this.unused19);
    allCoils.push(this.redOneConn);
    allCoils.push(this.redTwoConn);
    allCoils.push(this.redThreeConn);
    allCoils.push(this.blueOneConn);
    allCoils.push(this.blueTwoConn);
    allCoils.push(this.blueThreeConn);
    return allCoils;
  }

  public equals(compare: this): boolean {
    return (this.matchReset === compare.matchReset &&
      this.stackLightGreen === compare.stackLightGreen &&
      this.stackLightOrange === compare.stackLightOrange &&
      this.stackLightRed === compare.stackLightRed &&
      this.stackLightBlue === compare.stackLightBlue &&
      this.stackLightBuzzer === compare.stackLightBuzzer &&
      this.gameElement0 === compare.gameElement0 &&
      this.gameElement1 === compare.gameElement1 &&
      this.gameElement2 === compare.gameElement2 &&
      this.gameElement3 === compare.gameElement3 &&
      this.gameElement4 === compare.gameElement4 &&
      this.gameElement5 === compare.gameElement5 &&
      this.gameElement6 === compare.gameElement6 &&
      this.gameElement7 === compare.gameElement7 &&
      this.gameElement8 === compare.gameElement8 &&
      this.gameElement9 === compare.gameElement9 &&
      this.gameElement10 === compare.gameElement10 &&
      this.unused18 === compare.unused18 &&
      this.unused19 === compare.unused19 &&
      this.redOneConn === compare.redOneConn &&
      this.redTwoConn === compare.redTwoConn &&
      this.redThreeConn === compare.redThreeConn &&
      this.blueOneConn === compare.blueOneConn &&
      this.blueTwoConn === compare.blueTwoConn &&
      this.blueThreeConn === compare.blueThreeConn);
  }
}
export default PlcSupport.getInstance();