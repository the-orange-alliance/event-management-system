export class PlcOutputCoils {
  public heartbeat: boolean;
  public matchStart: boolean;
  public stackLightGreen: boolean;
  public stackLightOrange: boolean;
  public stackLightRed: boolean;
  public stackLightBlue: boolean;
  public stackLightBuzzer: boolean;
  public fieldResetGreen: boolean;
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
  public redOneBypass: boolean;
  public redTwoBypass: boolean;
  public redThreeBypass: boolean;
  public blueOneBypass: boolean;
  public blueTwoBypass: boolean;
  public blueThreeBypass: boolean;
  public coilCount: number;

  constructor() {
    this.heartbeat = false;
    this.matchStart = false;
    this.stackLightGreen = false;
    this.stackLightOrange = false;
    this.stackLightRed = false;
    this.stackLightBlue = false;
    this.stackLightBuzzer = false;
    this.fieldResetGreen = false;
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
    this.redOneBypass = false;
    this.redTwoBypass = false;
    this.redThreeBypass = false;
    this.blueOneBypass = false;
    this.blueTwoBypass = false;
    this.blueThreeBypass = false;
    this.coilCount = 32;
  }

  public getCoilArray(): boolean[] {
    const allCoils: boolean[] = [];
    allCoils.push(this.heartbeat); // "watchdog"
    allCoils.push(this.matchStart);
    allCoils.push(this.stackLightGreen);
    allCoils.push(this.stackLightOrange);
    allCoils.push(this.stackLightRed);
    allCoils.push(this.stackLightBlue);
    allCoils.push(this.stackLightBuzzer);
    allCoils.push(this.fieldResetGreen);
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
    allCoils.push(this.redOneBypass);
    allCoils.push(this.redTwoBypass);
    allCoils.push(this.redThreeBypass);
    allCoils.push(this.blueOneBypass);
    allCoils.push(this.blueTwoBypass);
    allCoils.push(this.blueThreeBypass);
    return allCoils;
  }

  public fromCoilsArray(coils: boolean[]): PlcOutputCoils {
   this.heartbeat = coils[0];
   this.matchStart = coils[1];
   this.stackLightGreen = coils[2];
   this.stackLightOrange = coils[3];
   this.stackLightRed = coils[4];
   this.stackLightBlue = coils[5];
   this.stackLightBuzzer = coils[6];
   this.fieldResetGreen = coils[7];
   this.gameElement1 = coils[8];
   this.gameElement2 = coils[9];
   this.gameElement3 = coils[10];
   this.gameElement4 = coils[11];
   this.gameElement5 = coils[12];
   this.gameElement6 = coils[13];
   this.gameElement7 = coils[14];
   this.gameElement8 = coils[15];
   this.gameElement9 = coils[16];
   this.gameElement10 = coils[17];
   this.unused18 = coils[18];
   this.unused19 = coils[19];
   this.redOneConn = coils[20];
   this.redTwoConn = coils[21];
   this.redThreeConn = coils[22];
   this.blueOneConn = coils[23];
   this.blueTwoConn = coils[24];
   this.blueThreeConn = coils[25];
   this.redOneBypass = coils[26];
   this.redTwoBypass = coils[27];
   this.redThreeBypass = coils[28];
   this.blueOneBypass = coils[29];
   this.blueTwoBypass = coils[30];
   this.blueThreeBypass = coils[31];
   return this;
  }

  public equals(compare: this): boolean {
    return (this.matchStart === compare.matchStart &&
      this.stackLightGreen === compare.stackLightGreen &&
      this.stackLightOrange === compare.stackLightOrange &&
      this.stackLightRed === compare.stackLightRed &&
      this.stackLightBlue === compare.stackLightBlue &&
      this.stackLightBuzzer === compare.stackLightBuzzer &&
      this.fieldResetGreen === compare.fieldResetGreen &&
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
      this.blueThreeConn === compare.blueThreeConn &&
      this.redOneBypass === compare.redOneBypass &&
      this.redTwoBypass === compare.redTwoBypass &&
      this.redThreeBypass === compare.redThreeBypass &&
      this.blueOneBypass === compare.blueOneBypass &&
      this.blueTwoBypass === compare.blueTwoBypass &&
      this.blueThreeBypass === compare.blueThreeBypass);
  }
}
