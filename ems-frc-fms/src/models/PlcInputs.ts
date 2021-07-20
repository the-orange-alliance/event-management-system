import logger from "../logger";

export class PlcInputs {
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

  /* PLC Inputs Array:
  0 -

   */
  public fromArray(inputs: boolean[]): PlcInputs {
    if(inputs.length > 6) {
      this.fieldEstop = !inputs[0];
      this.redEstop1 = inputs[1];
      this.redEstop2 = inputs[2];
      this.redEstop3 = inputs[3];
      this.blueEstop1 = inputs[4];
      this.blueEstop2 = inputs[5];
      this.blueEstop3 = inputs[6];
    } else {
      logger.error('❌ Error reading inputs from PLC. Received Input length not long enough')
    }
    if(inputs.length > 12) {
      this.redConnected1 = inputs[7];
      this.redConnected2 = inputs[8];
      this.redConnected3 = inputs[9];
      this.blueConnected1 = inputs[10];
      this.blueConnected2 = inputs[11];
      this.blueConnected3 = inputs[12];
    }
    return this;
  }

  public equals(compare: PlcInputs): boolean {
    return (
      this.fieldEstop === compare.fieldEstop &&
      this.redEstop1 === compare.redEstop1 &&
      this.redEstop2 === compare.redEstop2 &&
      this.redEstop3 === compare.redEstop3 &&
      this.blueEstop1 === compare.blueEstop1 &&
      this.blueEstop2 === compare.blueEstop2 &&
      this.blueEstop3 === compare.blueEstop3 &&
      this.redConnected1 === compare.redConnected1 &&
      this.redConnected2 === compare.redConnected2 &&
      this.redConnected3 === compare.redConnected3 &&
      this.blueConnected1 === compare.blueConnected1 &&
      this.blueConnected2 === compare.blueConnected2 &&
      this.blueConnected3 === compare.blueConnected3
    );
  }

  public toJSON(): object {
    return {
      'field_estop': this.fieldEstop,
      'red1_estop': this.redEstop1,
      'red2_estop': this.redEstop2,
      'red3_estop': this.redEstop3,
      'blue1_estop': this.blueEstop1,
      'blue2_estop': this.blueEstop2,
      'blue3_estop': this.blueEstop3,
      'red1_conn': this.redConnected1,
      'red2_conn': this.redConnected2,
      'red3_conn': this.redConnected3,
      'blue1_conn': this.blueConnected1,
      'blue2_conn': this.blueConnected2,
      'blue3_conn': this.blueConnected3,
    };
  }
}
