export class PlcOutputCoils {
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