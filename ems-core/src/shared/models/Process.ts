export default class Process {
  private _name: string;
  private _id: number;
  private _pid: number;
  private _status: string;
  private _cpu: number;
  private _mem: number;
  private _address: string;

  public static fromPM2(pm2Proc: any, host?: string): Process {
    const newProcess = new Process();
    newProcess.name = pm2Proc.name;
    newProcess.id = pm2Proc.pm_id;
    newProcess.status = pm2Proc.status.toString().toUpperCase();
    newProcess.address = host;
    return newProcess;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get pid(): number {
    return this._pid;
  }

  set pid(value: number) {
    this._pid = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get cpu(): number {
    return this._cpu;
  }

  set cpu(value: number) {
    this._cpu = value;
  }

  get mem(): number {
    return this._mem;
  }

  set mem(value: number) {
    this._mem = value;
  }

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }
}