export default class Process {
  private _name: string;
  private _id: number;
  private _pid: number;
  private _status: string;
  private _cpu: number;
  private _mem: number;
  private _envMode: string;
  private _address: string;
  private _port: number;

  public static fromPM2(pm2Proc: any, host?: string): Process {
    const newProcess = new Process();
    newProcess.name = pm2Proc.name || pm2Proc.pm2_env.name;
    newProcess.id = pm2Proc.pm_id || pm2Proc.pm2_env.pm_id;
    newProcess.status = pm2Proc.status || pm2Proc.pm2_env.status.toString().toUpperCase();
    newProcess.pid = pm2Proc.pid;
    newProcess.address = host || pm2Proc.pm2_env.args[0];
    if (pm2Proc.pm2_env) {
      newProcess.port = pm2Proc.pm2_env["REACT_APP_" + newProcess.name.toUpperCase().replace("-", "_") + "_PORT"];
    }
    if (pm2Proc.monit) {
      newProcess.cpu = pm2Proc.monit.cpu;
      newProcess.mem = pm2Proc.monit.memory;
    }
    return newProcess;
  }

  public static toMegaBytes(bytes: number): number {
    if (typeof bytes === "undefined") {
      return 0.0;
    }
    return bytes / 1048576.0;
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
    this._status = value.toUpperCase();
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

  set envMode(value: string) {
    this._envMode = value;
  }

  get envMode(): string {
    return this._envMode
  }

  get port(): number {
    return this._port;
  }

  set port(value: number) {
    this._port = value;
  }
}