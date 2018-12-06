export default class RoverRuckusRefereeData implements IPostableObject {

  private _redSampleOneSilverOneStatus: boolean;
  private _redSampleOneSilverTwoStatus: boolean;
  private _redSampleOneGoldStatus: boolean;
  private _redSampleTwoSilverOneStatus: boolean;
  private _redSampleTwoSilverTwoStatus: boolean;
  private _redSampleTwoGoldStatus: boolean;
  private _blueSampleOneSilverOneStatus: boolean;
  private _blueSampleOneSilverTwoStatus: boolean;
  private _blueSampleOneGoldStatus: boolean;
  private _blueSampleTwoSilverOneStatus: boolean;
  private _blueSampleTwoSilverTwoStatus: boolean;
  private _blueSampleTwoGoldStatus: boolean;

  constructor() {
    this._redSampleOneSilverOneStatus = false;
    this._redSampleOneSilverTwoStatus = false;
    this._redSampleOneGoldStatus = false;
    this._redSampleTwoSilverOneStatus = false;
    this._redSampleTwoSilverTwoStatus = false;
    this._redSampleTwoGoldStatus = false;
    this._blueSampleOneSilverOneStatus = false;
    this._blueSampleOneSilverTwoStatus = false;
    this._blueSampleOneGoldStatus = false;
    this._blueSampleTwoSilverOneStatus = false;
    this._blueSampleTwoSilverTwoStatus = false;
    this._blueSampleTwoGoldStatus = false;
  }

  public toJSON(): object {
    return {
      red_sample_one_silver_one_status: this.redSampleOneSilverOneStatus,
      red_sample_one_silver_two_status: this.redSampleOneSilverTwoStatus,
      red_sample_one_gold_status: this.redSampleOneGoldStatus,
      red_sample_two_silver_one_status: this.redSampleTwoSilverOneStatus,
      red_sample_two_silver_two_status: this.redSampleTwoSilverTwoStatus,
      red_sample_two_gold_status: this.redSampleTwoGoldStatus
    };
  }

  public fromJSON(json: any): RoverRuckusRefereeData {
    const metadata: RoverRuckusRefereeData = new RoverRuckusRefereeData();
    metadata.redSampleOneSilverOneStatus = json.red_sample_one_silver_one_status;
    metadata.redSampleOneSilverTwoStatus = json.red_sample_one_silver_two_status;
    metadata.redSampleOneGoldStatus = json.red_sample_one_gold_status;
    metadata.redSampleTwoSilverOneStatus = json.red_sample_two_silver_one_status;
    metadata.redSampleTwoSilverTwoStatus = json.red_sample_two_silver_two_status;
    metadata.redSampleTwoGoldStatus = json.red_sample_two_gold_status;
    metadata.blueSampleOneSilverOneStatus = json.blue_sample_one_silver_one_status;
    metadata.blueSampleOneSilverTwoStatus = json.blue_sample_one_silver_two_status;
    metadata.blueSampleOneGoldStatus = json.blue_sample_one_gold_status;
    metadata.blueSampleTwoSilverOneStatus = json.blue_sample_two_silver_one_status;
    metadata.blueSampleTwoSilverTwoStatus = json.blue_sample_two_silver_two_status;
    metadata.blueSampleTwoGoldStatus = json.blue_sample_two_gold_status;
    return metadata;
  }

  get redSampleOneSilverOneStatus(): boolean {
    return this._redSampleOneSilverOneStatus;
  }

  set redSampleOneSilverOneStatus(value: boolean) {
    this._redSampleOneSilverOneStatus = value;
  }

  get redSampleOneSilverTwoStatus(): boolean {
    return this._redSampleOneSilverTwoStatus;
  }

  set redSampleOneSilverTwoStatus(value: boolean) {
    this._redSampleOneSilverTwoStatus = value;
  }

  get redSampleOneGoldStatus(): boolean {
    return this._redSampleOneGoldStatus;
  }

  set redSampleOneGoldStatus(value: boolean) {
    this._redSampleOneGoldStatus = value;
  }

  get redSampleTwoSilverOneStatus(): boolean {
    return this._redSampleTwoSilverOneStatus;
  }

  set redSampleTwoSilverOneStatus(value: boolean) {
    this._redSampleTwoSilverOneStatus = value;
  }

  get redSampleTwoSilverTwoStatus(): boolean {
    return this._redSampleTwoSilverTwoStatus;
  }

  set redSampleTwoSilverTwoStatus(value: boolean) {
    this._redSampleTwoSilverTwoStatus = value;
  }

  get redSampleTwoGoldStatus(): boolean {
    return this._redSampleTwoGoldStatus;
  }

  set redSampleTwoGoldStatus(value: boolean) {
    this._redSampleTwoGoldStatus = value;
  }

  get blueSampleOneSilverOneStatus(): boolean {
    return this._blueSampleOneSilverOneStatus;
  }

  set blueSampleOneSilverOneStatus(value: boolean) {
    this._blueSampleOneSilverOneStatus = value;
  }

  get blueSampleOneSilverTwoStatus(): boolean {
    return this._blueSampleOneSilverTwoStatus;
  }

  set blueSampleOneSilverTwoStatus(value: boolean) {
    this._blueSampleOneSilverTwoStatus = value;
  }

  get blueSampleOneGoldStatus(): boolean {
    return this._blueSampleOneGoldStatus;
  }

  set blueSampleOneGoldStatus(value: boolean) {
    this._blueSampleOneGoldStatus = value;
  }

  get blueSampleTwoSilverOneStatus(): boolean {
    return this._blueSampleTwoSilverOneStatus;
  }

  set blueSampleTwoSilverOneStatus(value: boolean) {
    this._blueSampleTwoSilverOneStatus = value;
  }

  get blueSampleTwoSilverTwoStatus(): boolean {
    return this._blueSampleTwoSilverTwoStatus;
  }

  set blueSampleTwoSilverTwoStatus(value: boolean) {
    this._blueSampleTwoSilverTwoStatus = value;
  }

  get blueSampleTwoGoldStatus(): boolean {
    return this._blueSampleTwoGoldStatus;
  }

  set blueSampleTwoGoldStatus(value: boolean) {
    this._blueSampleTwoGoldStatus = value;
  }
}