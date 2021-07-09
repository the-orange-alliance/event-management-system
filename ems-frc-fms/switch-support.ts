import telnet_client from "telnet-client"
import {EmsFrcFms} from "./server";
import logger from "./logger";

export class SwitchSupport {
  private static _instance: SwitchSupport;

  private telnetPort = 23;
  private fmsIpAddress = "10.0.100.5";
  private switch: SwitchStatus = new SwitchStatus();
  private teamSwitchConfs: TeamSwitchConfig[] = new Array<TeamSwitchConfig>(6);

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

  public configTeamEthernet() {
    let vlanConfigs = [];
    let vlans = [this.red1Vlan, this.red2Vlan, this.red3Vlan, this.blue1Vlan, this.blue2Vlan, this.blue3Vlan];
    for(const p of EmsFrcFms.getInstance().activeMatch.participants) {
      const vlan = vlans[this.convertEMSStationToFMS(p.station)];
      vlanConfigs.push(
        `interface Vlan${vlan}\nno ip address\nno access-list 1${vlan}\n` +                                             // Remove Current Vlan Config
        `ip dhcp excluded-address 10.${p.teamKey/100}.${p.teamKey%100}.1 10.${p.teamKey/100}.${p.teamKey%100}.100\n` +  // Setup DHCP pool for new Team
        `no ip dhcp pool dhcp${vlan}\n` +                                                                               // Disable DHCP Pool
        `ip dhcp pool dhcp${vlan}\n` +                                                                                  // Enable New DHCP Pool
        `network 10.${p.teamKey/100}.${p.teamKey%100}.0 255.255.255.0\n` +                                              // Setup IP Addresses
        `default-router 10.${p.teamKey/100}.${p.teamKey%100}.61\n` +                                                    // Set Default Gateway
        `lease 7\n` +                                                                                                   // DHCP Lease
        `no access-list 1${vlan}\n` +                                                                                   // Disable/Clear Access-List
        `access-list 1${vlan} permit up 10.${p.teamKey/100}.${p.teamKey%100}.0 0.0.0.255 host ${this.fmsIpAddress}\n` + // Allow IP Addresses to communicate to FMS
        `access-list 1${vlan} permit udp any eq bootpc any eq bootps\n` +                                               // Protocols to allow to communicate with FMS
        `interface Vlan${vlan}\nip address 10.${p.teamKey/100}.${p.teamKey%100}.61 255.255.255.0\n`                     // Set Default Vlan IP Address
      );
    }
    let command = '';
    for(const c of vlanConfigs) {
      command = command + c;
    }
    this.runConfigCommand(command).then(() => {
      logger.info('✔ Updated field switch configuration')
    }).catch(error => {
      logger.error('❌ Failed to update field switch configuration')
    });
  }

  private async getTeamVlans() {
    let error = false;
    const data = await this.runCommand(`show running-config\n`).catch(() => {error = true});

    if (!error) {
      const switchRegex = new RegExp("(?s)interface Vlan(\\d\\d)\\s+ip address 10\\.(\\d+)\\.(\\d+)\\.61");
      const teamVlanMatches = switchRegex.exec(data);
      if(!teamVlanMatches) return;

      // In theory vlan 100 should be read last and won't get done. otherwise we gotta check for that
      for(let i = 0; i < teamVlanMatches.length && i < 7; i++) {
        const vConfig = teamVlanMatches[i];
        this.teamSwitchConfs[i].team100s = parseInt(vConfig[2]);
        this.teamSwitchConfs[i].team1s = parseInt(vConfig[3]);
        this.teamSwitchConfs[i].team = (parseInt(vConfig[2]) * 100) + parseInt(vConfig[3]);
        this.teamSwitchConfs[i].vlan = parseInt(vConfig[1]);
      }
    } else {
      logger.error('❌ Error reading switch config');
    }
  }

  // This converts an EMS station to an FMS Station
  // Ex. 11 = Red Alliance 1, Which will become Station 0
  // Ex. 23 = Blue Alliance 3, Which will become Station 5
  private convertEMSStationToFMS(station: number): number{
    const emsStation = station + '';
    const firstDigit = parseInt(emsStation.charAt(0));
    const secondDigit = parseInt(emsStation.charAt(1));
    const multiply = firstDigit*secondDigit;
    return multiply - 1;
  }

  private runCommand(command: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const client = new telnet_client();
      const params = {
        host: this.switch.address,
        port: this.telnetPort,
        negotiationMandatory: false,
        timeout: 2500
      };

      client.connect(params).then(() => {
        console.log('connected');
        return client.send(`${this.switch.password}\nenable\n${this.switch.password}\nterminal length 0\n${command}exit\n`);
      }).then((res: string) => {
        resolve(res);
        return client.destroy();
      }).catch((error) => {
        console.log(error);
        reject(error)
      });
    })
  }

  private runConfigCommand(command: string): Promise<any> {
    return this.runCommand(`config terminal\n${command}end\ncopy running-config startup-config\n\n`);
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
