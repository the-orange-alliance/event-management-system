import logger from "./logger";
import {EmsFrcFms} from "./server";
import ssh = require('ssh2-promise');
import {Team} from "@the-orange-alliance/lib-ems";
import SSHConnection from "ssh2-promise/dist/sshConnection";

export class AccesspointSupport {
  private static _instance: AccesspointSupport;
  private accessPointSshPort: number                = 22;
  private accessPointConnectTimeoutSec: number      = 1;
  private accessPointCommandTimeoutSec: number      = 5;
  private accessPointPollPeriodSec: number          = 3;
  private accessPointRequestBufferSize: number      = 10;
  private accessPointConfigRetryIntervalSec: number = 5;

  private ap: AccessPoint = new AccessPoint();
  private sshConn = new SSHConnection({});
  private sshOpen = false;
  private teamWifiStatuses: TeamWifiStatus[] = new Array<TeamWifiStatus>(6);

  public static getInstance(): AccesspointSupport {
    if (typeof AccesspointSupport._instance === "undefined") {
      AccesspointSupport._instance = new AccesspointSupport();
    }
    return AccesspointSupport._instance;
  }

  public setSettings(address: string, username: string, password: string, teamChannel: number, adminChannel: number, adminWpaKey: string, networkSecurityEnabled: boolean, TeamWifiStatuses: TeamWifiStatus[], initialStatusesFetched: boolean) {
      this.ap.address = address;
      this.ap.username = username;
      this.ap.password = password;
      this.ap.teamChannel = teamChannel;
      this.ap.adminChannel = adminChannel;
      this.ap.adminWpaKey = adminWpaKey;
      this.ap.networkSecurityEnabled = networkSecurityEnabled;
      this.ap.TeamWifiStatuses = TeamWifiStatuses;
      this.ap.initialStatusesFetched = initialStatusesFetched;
  }

  //TODO: Create SSH Command Queue so we don't break things by trying to do multiple SSHs at once

  // Run everything
  public runAp() {
    if(!this.sshOpen) { // try not to break things now
      this.updateTeamWifiStatus();
    }
  }

  public configAdminWifi() {
    if (!this.ap.networkSecurityEnabled) return;
    const disabled = (this.ap.adminChannel < 1) ? 1 : 0;
    const commands = [
      `set wireless.radio0.channel='${this.ap.teamChannel}'`,
      `set wireless.radio1.disabled'${disabled}'`,
      `set wireless.radio1.channel='${this.ap.adminChannel}'`,
      `set wireless.@wifi-iface[0].key=='${this.ap.adminWpaKey}'`,
      `commit wireless`
    ];
    let commandToRun = '';
    for(const c of commands) {
      commandToRun = commandToRun + (c + '\n');
    }
    this.runCommand(commandToRun);
  }

  public async handleTeamWifiConfig() {
    if (!this.ap.networkSecurityEnabled) return;
    if (this.checkTeamConfig()) return;

    // Generate Config Command
    const configCommand = this.generateApConfigForMatch();
    if (!configCommand || configCommand.length < 1) {
      logger.info('Failed to generate a config for the AP');
      return;
    }

    let attemptCount = 1;
    while (true) {
      let error = false;
      // Run command and wait for response
      if(!await this.runCommand(configCommand)) error = true;
      // Wait before reading the config back on write success as it doesn't take effect right away, or before retrying on failure.
      this.sleep(this.accessPointConfigRetryIntervalSec * 1000)
      if(!error) {
        // Update Team Statuses
        await this.updateTeamWifiStatus();
        if(this.checkTeamConfig()) {
          logger.info('Successfully configured Wifi after ' + attemptCount + 'attempt(s).');
          return;
        }
      }
      // There was an error of some kind and the config is not correct
      logger.info("WiFi configuration still incorrect after " + attemptCount + " attempt(s); trying again.");
      attemptCount++;
    }
  }

  private sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  // Returns true if the configured networks as read from the access point match the given teams.
  public checkTeamConfig(): boolean {
    if(!this.ap.initialStatusesFetched || !EmsFrcFms.getInstance().activeMatch) return false;
    for (const i in EmsFrcFms.getInstance().activeMatch.participants) {
      const p = EmsFrcFms.getInstance().activeMatch.participants[i];
      if (p && this.ap.TeamWifiStatuses[i].teamId != p.teamKey) return false;
    }
    return true;
  }

  // Fetches the current wifi network status from the access point and updates the status structure.
  public async updateTeamWifiStatus() {
    if (!this.ap.networkSecurityEnabled) return;

    const response = await this.runCommand("iwinfo");

    if(!response || response.length === 0) {
      logger.info('Couldn\'t get Wifi Status from AP');
      return;
    }
    if(this.decodeWifiConfig(response)) {
      this.ap.initialStatusesFetched = true;
    }
  }

  // Logs into the access point via SSH and runs the given shell command.
  public runCommand(command: string): any {
    if(this.sshConn) this.sshConn.close().catch();
    this.sshConn = new SSHConnection({host: this.ap.address, username: this.ap.username, password: this.ap.password});
    this.sshConn.connect().then(() => {
      logger.info('SSHed into Field AP. Sending Commands...');
      this.sshOpen = true;

      this.sshConn.shell().then((socket) => {
        socket.on('data', (data: any) => {
          this.sshConn.close().then(() => logger.info('Successfully closed Field AP Connection')).catch();
          this.sshOpen = false;
          return data;
        });
        //Write Command to Socket
        socket.write(command);
      });

    }).catch((reason: any) => {
      logger.info('Error SSHing into Field AP: ' + reason)
      return;
    });
  }

  // Verifies WPA key validity and runs the configuration command the active match's teams.
  public generateApConfigForMatch(): string {
    const commands = [];
    const pars = EmsFrcFms.getInstance().activeMatch.participants;
    let i = 0;
    while(i <  pars.length) {
      const pos = i + 1;
      if(!pars[i] || !pars[i].teamKey || pars[i].teamKey < 1) {
        commands.push(`set wireless.@wifi-iface[${pos}].disabled='0'`);
        commands.push(`set wireless.@wifi-iface[${pos}].ssid='no-team-${pos}'`);
        commands.push(`set wireless.@wifi-iface[${pos}].key='no-team-${pos}'`);
      } else {
        if(this.teamWifiStatuses[i].wpaKey.length < 8 || this.teamWifiStatuses[i].wpaKey.length > 63) {
          logger.info(`Invalid WPA key ${this.teamWifiStatuses[i].wpaKey}' configured for team ${pars[i].teamKey}.`);
          return '';
        }

        commands.push(`set wireless.@wifi-iface[${pos}].disabled='0'`);
        commands.push(`set wireless.@wifi-iface[${pos}].ssid='${pars[i].teamKey}'`);
        commands.push(`set wireless.@wifi-iface[${pos}].key='${this.teamWifiStatuses[i].wpaKey}'`);
      }
      i++;
    }
    commands.push("commit wireless");
    let commandToRun = '';
    for(const c of commands) {
      commandToRun = commandToRun + (c + '\n');
    }
    return commandToRun;
  }

  // Parses the given output from the "iwinfo" command on the AP and updates the given status structure with the result.
  public decodeWifiConfig(wifiInfo: string): boolean {
    const ssidRegEx = new RegExp("ESSID: \"([-\\w ]*)\"");
    const ssids = ssidRegEx.exec(wifiInfo);
    const linkQualityRegex = new RegExp("Link Quality: ([-\\w ]+)/([-\\w ]+)");
    const linkQualities = linkQualityRegex.exec(wifiInfo);

    if ((ssids !== null && ssids.length < 6) || (linkQualities !== null && linkQualities.length < 6)) {
      // worlds longest log message
      logger.info("Could not parse wifi info; expected 6 team networks, got " + ((ssids) ? ssids.length : '0') + " and " + ((linkQualities) ? linkQualities.length : 0) )
      return false;
    }
    let i = 0;
    while(i < this.teamWifiStatuses.length) {
      if(ssids!== null) this.teamWifiStatuses[i].teamId = parseInt(ssids[i][1]);
      if(linkQualities!== null) this.teamWifiStatuses[i].radioLinked = linkQualities[i][1] !== 'unknown';

      i++;
    }
    return true;
  }
}

class AccessPoint {
  public address: string;
  public username: string;
  public password: string;
  public teamChannel: number;
  public adminChannel: number;
  public adminWpaKey: string;
  public networkSecurityEnabled: boolean;
  public TeamWifiStatuses: TeamWifiStatus[];
  public initialStatusesFetched: boolean;

  constructor() {
    this.address = '';
    this.username = '';
    this.password = '';
    this.teamChannel = -1;
    this.adminChannel = -1;
    this.adminWpaKey = '';
    this.networkSecurityEnabled = true;
    this.TeamWifiStatuses = new Array<TeamWifiStatus>(6);
    this.initialStatusesFetched = false;
  }

}


class TeamWifiStatus {
  public teamId: number;
  public radioLinked: boolean;
  public wpaKey: string;


  constructor() {
    this.teamId = -1;
    this.radioLinked = false;
    this.wpaKey = '';
  }
}
export default AccesspointSupport.getInstance();