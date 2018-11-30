export default class RoverRuckusRefereeData implements IPostableObject {

  private _sampleOneSilverOneStatus: boolean;
  private _sampleOneSilverTwoStatus: boolean;
  private _sampleOneGoldStatus: boolean;
  private _sampleTwoSilverOneStatus: boolean;
  private _sampleTwoSilverTwoStatus: boolean;
  private _sampleTwoGoldStatus: boolean;

  constructor() {
    this._sampleOneSilverOneStatus = false;
    this._sampleOneSilverTwoStatus = false;
    this._sampleOneGoldStatus = false;
    this._sampleTwoSilverOneStatus = false;
    this._sampleTwoSilverTwoStatus = false;
    this._sampleTwoGoldStatus = false;
  }

  public toJSON(): object {
    return {
      sample_one_silver_one_status: this.sampleOneSilverOneStatus,
      sample_one_silver_two_status: this.sampleOneSilverTwoStatus,
      sample_one_gold_status: this.sampleOneGoldStatus,
      sample_two_silver_one_status: this.sampleTwoSilverOneStatus,
      sample_two_silver_two_status: this.sampleTwoSilverTwoStatus,
      sample_two_gold_status: this.sampleTwoGoldStatus
    };
  }

  public fromJSON(json: any): RoverRuckusRefereeData {
    const metadata: RoverRuckusRefereeData = new RoverRuckusRefereeData();
    metadata.sampleOneSilverOneStatus = json.sample_one_silver_one_status;
    metadata.sampleOneSilverTwoStatus = json.sample_one_silver_two_status;
    metadata.sampleOneGoldStatus = json.sample_one_gold_status;
    metadata.sampleTwoSilverOneStatus = json.sample_two_silver_one_status;
    metadata.sampleTwoSilverTwoStatus = json.sample_two_silver_two_status;
    metadata.sampleTwoGoldStatus = json.sample_two_gold_status;
    return metadata;
  }

  get sampleOneSilverOneStatus(): boolean {
    return this._sampleOneSilverOneStatus;
  }

  set sampleOneSilverOneStatus(value: boolean) {
    this._sampleOneSilverOneStatus = value;
  }

  get sampleOneSilverTwoStatus(): boolean {
    return this._sampleOneSilverTwoStatus;
  }

  set sampleOneSilverTwoStatus(value: boolean) {
    this._sampleOneSilverTwoStatus = value;
  }

  get sampleOneGoldStatus(): boolean {
    return this._sampleOneGoldStatus;
  }

  set sampleOneGoldStatus(value: boolean) {
    this._sampleOneGoldStatus = value;
  }

  get sampleTwoSilverOneStatus(): boolean {
    return this._sampleTwoSilverOneStatus;
  }

  set sampleTwoSilverOneStatus(value: boolean) {
    this._sampleTwoSilverOneStatus = value;
  }

  get sampleTwoSilverTwoStatus(): boolean {
    return this._sampleTwoSilverTwoStatus;
  }

  set sampleTwoSilverTwoStatus(value: boolean) {
    this._sampleTwoSilverTwoStatus = value;
  }

  get sampleTwoGoldStatus(): boolean {
    return this._sampleTwoGoldStatus;
  }

  set sampleTwoGoldStatus(value: boolean) {
    this._sampleTwoGoldStatus = value;
  }
}