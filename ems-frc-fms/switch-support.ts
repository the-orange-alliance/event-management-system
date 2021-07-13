import telnet_client from "telnet-client"
import {EmsFrcFms} from "./server";
import logger from "./logger";
import {SocketProvider} from "@the-orange-alliance/lib-ems";

export class SwitchSupport {
  private static _instance: SwitchSupport;

  private telnetPort = 23;
  private fmsIpAddress = "10.0.100.5";
  private switch: SwitchStatus = new SwitchStatus();

  //Vlans
  private red1Vlan  = 10;
  private red2Vlan  = 20;
  private red3Vlan  = 30;
  private blue1Vlan = 40;
  private blue2Vlan = 50;
  private blue3Vlan = 60;

  public static getInstance(): SwitchSupport {
    if (typeof SwitchSupport._instance === "undefined") {
      SwitchSupport._instance = new SwitchSupport();
    }
    return SwitchSupport._instance;
  }

  public setSettings(address: string, username: string, password: string) {
    this.switch.address = address;
    this.switch.username = username;
    this.switch.password = password;
  }

  public async configTeamEthernet() {
    const oldConfig = await this.getTeamVlans();
    let infoString = 'ℹ Currently configured vlans |'
    for(const c of oldConfig) infoString += ` Vlan${c.vlan}: ${c.team} |`
    logger.info(infoString);
    let commands = [];
    let vlans = [this.red1Vlan, this.red2Vlan, this.red3Vlan, this.blue1Vlan, this.blue2Vlan, this.blue3Vlan];
    // Build Command to configure VLANs
    for(const p of EmsFrcFms.getInstance().activeMatch.participants) {
      const vlan = vlans[this.convertEMSStationToFMS(p.station)];

      // Locate current vlan config for this vlan
      const currVlanConfIndex = oldConfig.findIndex(e => e.vlan === vlan);

      if (oldConfig[currVlanConfIndex] && oldConfig[currVlanConfIndex].teamKey === p.teamKey){
        // This team exists on this Vlan already. No need to reconfigure anything.
      } else {
        /* New Team. Clear Vlan and Reconfig */

        // Remove Current Vlan Config
        commands.push(`interface Vlan${vlan}`);   // Select VLAN to Modify
        commands.push(`no ip address`);           // Clear Old IP
        commands.push(`no access-list 1${vlan}`); // Clear Access List

        // Setup DHCP pool for new Team
        commands.push(`ip dhcp excluded-address 10.${Math.floor(p.teamKey/100)}.${p.teamKey%100}.1 10.${Math.floor(p.teamKey/100)}.${p.teamKey%100}.100`);

        // Disable Old DHCP Pool
        commands.push(`no ip dhcp pool dhcp${vlan}`);

        // Enable New DHCP Pool
        commands.push(`ip dhcp pool dhcp${vlan}`);
        commands.push(`network 10.${Math.floor(p.teamKey/100)}.${p.teamKey%100}.0 255.255.255.0`);   // Setup IP Addresses
        commands.push(`default-router 10.${Math.floor(p.teamKey/100)}.${p.teamKey%100}.61`);         // Set Default Gateway
        commands.push(`lease 7`);                                                                       // Set DHCP Lease
        commands.push(`exit`);                                                                          // Exit DHCP conf

        // Disable/Clear Access-List
        commands.push(`no access-list 1${vlan}`);

        // Allow IP Addresses to communicate to FMS
        commands.push(`access-list 1${vlan} permit udp 10.${Math.floor(p.teamKey/100)}.${p.teamKey%100}.0 0.0.0.255 host ${this.fmsIpAddress}`);

        // Protocols to allow to communicate with FMS
        commands.push(`access-list 1${vlan} permit udp any eq bootpc any eq bootps`);

        // Set Default Vlan IP Address
        commands.push(`interface Vlan${vlan}`);                                                            // Select VLAN
        commands.push(`ip address 10.${Math.floor(p.teamKey/100)}.${p.teamKey%100}.61 255.255.255.0`);  // Set Switch's IP on Vlan
        commands.push(`exit`);                                                                             // Exit Vlan config
      }
    }
    const command = commands.join('\n')
    this.runConfigCommand(command).then(() => {
      SocketProvider.emit('fms-switch-ready');
      logger.info('✔ Updated field switch (' + this.switch.address + ') configuration')
      return this.getTeamVlans();
    }).then((newConf) => {
      // TODO: Use this info to ensure that switch config is correct
      let infoString = 'ℹ Newly configured vlans |'
      for(const c of newConf) infoString += ` Vlan${c.vlan}: ${c.team} |`
      logger.info(infoString);
    }).catch(error => {
      logger.error('❌ Failed to update field switch (' + this.switch.address + ') configuration')
    });
  }

  private async getTeamVlans(): Promise<any[]> {
    let error = false;
    const data = await this.runCommand(`show running-config\n`).catch(() => {error = true});

    if (!error) {
      const switchRegex = /interface Vlan(\d\d)\s+ip address 10.(\d+)\.(\d+).61/g;
      const vlans = [];
      let v;
      do {
        v = switchRegex.exec(data);
        if (v && v.length > 2) vlans.push([v[1], v[2], v[3]]);
      } while (v);
      if(vlans.length < 1) return [];

      const parsedVlans = [];

      // In theory vlan 100 should be read last and won't get done. otherwise we gotta check for that
      for(let i = 0; i < vlans.length && i < 7; i++) {
        const vConfig = vlans[i];
        const t = new TeamSwitchConfig();
        t.team100s = parseInt(vConfig[1]);
        t.team1s = parseInt(vConfig[2]);
        t.team = (parseInt(vConfig[1]) * 100) + parseInt(vConfig[2]);
        t.vlan = parseInt(vConfig[0]);
        parsedVlans.push(t);
      }
      return parsedVlans;
    } else {
      logger.error('❌ Error reading switch config');
      return [];
    }
  }

  // This converts an EMS station to an FMS Station
  // Ex. 11 = Red Alliance 1, Which will become Station 0
  // Ex. 23 = Blue Alliance 3, Which will become Station 5
  private convertEMSStationToFMS(station: number): number{
    switch(station) {
      case 11: return 0;
      case 12: return 1;
      case 13: return 2;
      case 21: return 3;
      case 22: return 4;
      case 23: return 5;
      default: return 0;
    }
  }

  private runCommand(command: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const client = new telnet_client();
      const params = {
        host: this.switch.address,
        port: this.telnetPort,
        negotiationMandatory: false,
        timeout: 10000,
        execTimeout: 10000,
      };

      client.connect(params).then(() => {
        const commands = [];
        commands.push(this.switch.password); // Enter Password for Telnet Conn
        commands.push('enable');             // Enable Cisco Console
        commands.push(this.switch.password); // Password for Console
        commands.push('terminal length 0');  // Set Terminal length to not have "more"
        commands.push(command);              // Run Predefined commands
        commands.push('');                   // Blank line. DON'T REMOVE!
        commands.push('exit');               // Exit?

        return client.exec(commands.join('\n'));
      }).then((res: string) => {
        resolve(res);
        return client.destroy();
      }).catch((error) => {
        reject(error)
      });
    })
  }

  private runConfigCommand(command: string): Promise<any> {
    const commands = [];
    commands.push('config terminal');                     // Open Config Terminal
    commands.push(command);                               // Run Config Commands
    commands.push('end');                                 // Exit Config Terminal
    commands.push('copy running-config startup-config');  // Copy to Startup config
    commands.push('');                                    // Blank line to agree to filename
    return this.runCommand(commands.join('\n'));
  }

  // TODO: Create Telnet Command Queue so we don't break things by trying to do multiple SSHs at once
  // Future soren says thats too much work and it probably will never be an issue ;) (famous last words)
}

class SwitchStatus {
  public address: string;
  public username: string;
  public password: string;
  constructor() {
    this.address = '';
    this.username = '';
    this.password = '';
  }

}

class TeamSwitchConfig {
  public team100s: number;
  public team1s: number;
  public team: number;
  public vlan: number;
  constructor() {
    this.team100s = -1;
    this.team1s = -1;
    this.team = -1;
    this.vlan = -1;
  }

}
export default SwitchSupport.getInstance();
