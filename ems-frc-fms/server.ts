import logger from "./logger";
import * as path from "path";
import * as dotenv from "dotenv";
import {DriverstationSupport} from "./driverstation-support"
import {AccesspointSupport} from "./accesspoint-support"
import {SwitchSupport} from "./switch-support"
import {PlcSupport} from "./plc-support";
import {
    EMSProvider,
    Match,
    MatchConfiguration,
    MatchMode, MatchParticipant,
    MatchTimer, Ranking,
    SocketProvider,
    Team
} from "@the-orange-alliance/lib-ems";
import * as fs from "fs";

/* Load our environment variables. The .env file is not included in the repository.
 * Only TOA staff/collaborators will have access to their own, specialized version of
 * the .env file.
 */
dotenv.config({path: path.join(__dirname, "../.env")});

const ipRegex = /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/;

let host = process.env.HOST || "127.0.0.1";
let udpTcpListenerIp = "10.0.100.5";

if (process.argv[2] && process.argv[2].match(ipRegex)) {
    host = process.argv[2];
}

export class EmsFrcFms {
    private static _instance: EmsFrcFms;
    public _timer: MatchTimer = new MatchTimer();
    public activeMatch: Match = new Match();
    public timeLeft: number = 0;
    public matchState: number = 0;
    private dsInterval: any;
    private apInterval: any;
    private plcInterval: any;
    private settings: FMSSettings = new FMSSettings();
    public matchStateMap: Map<String, number> = new Map<String, number>([["prestart", 0], ["timeout", 1], ["post-timeout", 2], ["start-match", 3], ["auto", 4], ["transition", 5], ["tele", 5]]);

    constructor() {
        this.initFms();
    }

    public static getInstance(): EmsFrcFms {
        if (typeof EmsFrcFms._instance === "undefined") {
            EmsFrcFms._instance = new EmsFrcFms();
        }
        return EmsFrcFms._instance;
    }

    public initFms() {
        // Load Settings from file
        this.loadSettingsFromFile();
        // Init EMS
        EMSProvider.initialize(host, parseInt(process.env.API_PORT as string, 10));
        process.env.REACT_APP_EMS_SCK_PORT = '8800';
        SocketProvider.initialize(host);
        this.initSocket();


        // Init DriverStation listeners
        DriverstationSupport.getInstance().dsInit(udpTcpListenerIp);

        // Init AccessPoint Settings to default // TODO: Store and get from somewhere
        if(this.settings.enableAdvNet) AccesspointSupport.getInstance().setSettings(this.settings.apIp, this.settings.apUsername, this.settings.apPassword, this.settings.apTeamCh, this.settings.apAdminCh, this.settings.apAdminWpa, this.settings.enableAdvNet, [], false);

        // Init Switch Configuration Tools
        if(this.settings.enableAdvNet) SwitchSupport.getInstance().setSettings(this.settings.switchIp, 'cisco', this.settings.switchPassword);

        // Init PLC Connection
        if(this.settings.enableAdvNet && this.settings.enablePlc) PlcSupport.getInstance().initPlc(this.settings.plcIp);

        // Init Timer
        this._timer = new MatchTimer();
        this.initTimer();
        this.timeLeft = this._timer.timeLeft;

        // Start FMS Services Updates
        this.startDriverStation();
        if(this.settings.enableAdvNet) {
            clearInterval(this.apInterval);
            this.startAPLoop();
        }
        if(this.settings.enableAdvNet && this.settings.enablePlc) {
            clearInterval(this.plcInterval);
            this.startPLC();
        }
        // The Switch manager doesn't have a loop, it runs on prestart.
    }


    private async loadSettingsFromFile() {
        try {
            this.settings = new FMSSettings().fromJson(JSON.parse(fs.readFileSync('./fms_settings.json', 'utf8').toString()));
        } catch (error) {
            logger.info('Unable to open fms_settings.json. Creating a new copy with default settings');
            this.settings = new FMSSettings();
            try {
                await fs.writeFileSync('./fms_settings.json', JSON.stringify(this.settings.toJson()));
            } catch (error) {
                logger.info('Unable to write new settings file. Setting local settings to default.');
            }
        } finally {
            logger.info('✅ Loaded Settings for FMS');
        }
    }

    private updateSettings(newSettings: object) {
        this.settings = new FMSSettings().fromJson(newSettings);
        try {
            fs.writeFileSync('./fms_settings.json', JSON.stringify(this.settings.toJson()));
        } catch(error) {
            logger.info('Unable to write new settings file. Setting local settings to new settings. These will be forgotten on the next restart.');
        }
        // TODO Better manage the enabling/disabling of advanced network settings
        // Update AP Settings
        if(this.settings.enableAdvNet) {
            AccesspointSupport.getInstance().setSettings(this.settings.apIp, this.settings.apUsername, this.settings.apPassword, this.settings.apTeamCh, this.settings.apAdminCh, this.settings.apAdminWpa, this.settings.enableAdvNet, [], false);
            clearInterval(this.apInterval);
            this.startAPLoop();
        } else {
            clearInterval(this.apInterval);
        }
        // Update Switch Settings
        if(this.settings.enableAdvNet) SwitchSupport.getInstance().setSettings(this.settings.switchIp, 'cisco', this.settings.switchPassword);
        // Update PLC Settings
        if(this.settings.enableAdvNet && this.settings.enablePlc) {
            PlcSupport.getInstance().initPlc(this.settings.plcIp);
            clearInterval(this.plcInterval);
            this.startPLC();
        } else {
            clearInterval(this.plcInterval);
        }
        logger.info('✅ Updated Settings!');
    }

    private initSocket() {
        // Setup Socket Connect/Disconnect
        SocketProvider.on("connect", () => {
            logger.info("✅ Connected to EMS through SocketIO.");
            SocketProvider.emit("identify","ems-frc-fms-main", ["event", "scoring", "referee", "fms"]);
        });
        SocketProvider.on("disconnect", () => {
            logger.info("❌ Disconnected from SocketIO.");
        });
        SocketProvider.on("error", () => {
            logger.info("❌ Error With SocketIO, not connected to EMS");
        });
        SocketProvider.on("fms-ping", () => {
            SocketProvider.emit("fms-pong");
        });
        SocketProvider.on("fms-settings-update", (data: string) => {
            this.updateSettings(JSON.parse(data));
            SocketProvider.emit("fms-settings-update-success", JSON.stringify(this.settings));
        });

        // Manage Socket Events
        SocketProvider.on("prestart-response", (err: any, matchJSON: any) => {
            logger.info('🔁 Prestart Command Issued');
            this.fmsOnPrestart(matchJSON);
        });
    }

    private fmsOnPrestart(matchJSON: any) {
        // Get and Set Local Match Data
        const match: Match = new Match().fromJSON(matchJSON);
        const seasonKey: string = match.matchKey.split("-")[0];
        match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
        if (typeof matchJSON.participants !== "undefined") {
            match.participants = matchJSON.participants.map((pJSON: any) => new MatchParticipant().fromJSON(pJSON));
        }
        this.getParticipantInformation(match).then((participants: MatchParticipant[]) => {
            if (participants.length > 0) {
                match.participants = participants;
            }
        }).catch(err => logger.info('❌ Error getting participant information: ' + err));
        this.activeMatch = match;
        if(!match) {
            logger.info('❌ Received prestart command, but found no active match');
        }

        // Call DriverStation Prestart
        DriverstationSupport.getInstance().onPrestart(this.activeMatch);
        if(this.settings.enableAdvNet) {
            // Configure AP
            AccesspointSupport.getInstance().handleTeamWifiConfig();
            // Configure Switch
            SwitchSupport.getInstance().configTeamEthernet();
        }
        if(this.settings.enableAdvNet && this.settings.enablePlc) {
            // Set Field Lights
            PlcSupport.getInstance().onPrestart();
        }
    }

    private initTimer() {
        SocketProvider.on("match-start", (timerJSON: any) => {
            logger.info('Match Started')
            this._timer.matchConfig = new MatchConfiguration().fromJSON(timerJSON);
            // Signal DriverStation Start
            DriverstationSupport.getInstance().driverStationMatchStart();
            this._timer.on("match-end", () => {
                this.removeMatchlisteners()
            });
            this._timer.start();
            this.updateTimer();
            const timerID = global.setInterval(() => {
                this.updateTimer();
                if (this._timer.timeLeft <= 0) {
                    this.updateTimer();
                    global.clearInterval(timerID);
                }
            }, 1000);
        });
        SocketProvider.on("match-abort", () => {
            this._timer.abort();
            this.updateTimer();
            this.removeMatchlisteners();
        });
    }

    private removeMatchlisteners() {
        this._timer.removeAllListeners("match-transition");
        this._timer.removeAllListeners("match-tele");
        this._timer.removeAllListeners("match-endgame");
        this._timer.removeAllListeners("match-end");
    }

    private updateTimer() {
        let displayTime: number = this._timer.timeLeft;
        if (this._timer.mode === MatchMode.TRANSITION) {
            displayTime = this._timer.modeTimeLeft;
        }
        if (this._timer.mode === MatchMode.AUTONOMOUS && this._timer.matchConfig.transitionTime > 0) {
            displayTime = this._timer.timeLeft - this._timer.matchConfig.transitionTime;
        }
        this.timeLeft = this._timer.timeLeft;
    }

    private startDriverStation() {
        this.dsInterval = setInterval(()=> { DriverstationSupport.getInstance().runDriverStations() }, 500);
        logger.info('✅ Driver Station Manager Init Complete, Running Loop');
    }

    private startPLC() {
        this.plcInterval = setInterval(()=> { PlcSupport.getInstance().runPlc() }, 100);
        logger.info('✅ PLC Manager Init Complete, Running Loop');
    }

    private startAPLoop() {
        this.apInterval = setInterval(()=> { AccesspointSupport.getInstance().runAp() }, 3000);
        logger.info('✅ Access Point Manager Init Complete, Running Loop');
    }

    private getParticipantInformation(match: Match): Promise<MatchParticipant[]> {
        return new Promise<MatchParticipant[]>((resolve, reject) => {
            EMSProvider.getMatchTeams(match.matchKey).then((matchTeams: MatchParticipant[]) => {
                const participants: MatchParticipant[] = [];
                const matchTeamKeys = matchTeams.map((p: MatchParticipant) => p.teamKey);
                match.participants.sort((a: MatchParticipant, b: MatchParticipant) => a.station - b.station);
                for (let i = 0; i < match.participants.length; i++) {
                    const participant: MatchParticipant = match.participants[i];
                    if (matchTeamKeys.includes(participant.teamKey)) {
                        const index = matchTeamKeys.indexOf(participant.teamKey);
                        const newParticipant: MatchParticipant = matchTeams[index];
                        newParticipant.cardStatus = participant.cardStatus;
                        participants.push(newParticipant);
                    } else {
                        if (typeof participant.team === "undefined") {
                            const team: Team = new Team();
                            team.teamKey = i;
                            team.teamNameShort = "Test Team #" + (i + 1);
                            team.country = "TST";
                            team.countryCode = "us";
                            participant.team = team;
                        }
                        if (typeof participant.teamRank === "undefined") {
                            const ranking: Ranking = new Ranking();
                            ranking.rank = 0;
                            participant.teamRank = ranking;
                        }
                        participants.push(participant);
                    }
                }
                resolve(participants);
            }).catch(err => logger.info('Error getting match teams: ' + err));
        });
    }
}

class FMSSettings {
    public enableFms: boolean;
    public enableAdvNet: boolean;
    public apIp: string;
    public apUsername: string;
    public apPassword: string;
    public apTeamCh: string;
    public apAdminCh: string;
    public apAdminWpa: string;
    public switchIp: string;
    public switchPassword: string;
    public enablePlc: false;
    public plcIp: string;

    constructor() {
        this.enableFms = false;
        this.enableAdvNet = false;
        this.apIp = '10.0.100.1';
        this.apUsername = 'root';
        this.apPassword = '56Seven';
        this.apTeamCh = '157';
        this.apAdminCh = '-1';
        this.apAdminWpa = '56Seven';
        this.switchIp = '10.0.100.2';
        this.switchPassword = '56Seven';
        this.enablePlc = false;
        this.plcIp = '10.0.100.10';
    }
     public fromJson(json: any): this {
         this.enableFms = json.enable_fms;
         this.enableAdvNet = json.enable_adv_net;
         this.apIp = json.ap_ip;
         this.apUsername = json.ap_username;
         this.apPassword = json.ap_password;
         this.apTeamCh = json.ap_team_ch;
         this.apAdminCh = json.ap_admin_ch;
         this.apAdminWpa = json.ap_admin_wpa;
         this.switchIp = json.switch_ip;
         this.switchPassword = json.switch_password;
         this.enablePlc = json.enable_plc;
         this.plcIp = json.plc_ip;
         return this;
     }

     public toJson(): object {
        return {
            enable_fms: this.enableFms,
            enable_adv_net: this.enableAdvNet,
            ap_ip: this.apIp,
            ap_username: this.apUsername,
            ap_password: this.apPassword,
            ap_team_ch: this.apTeamCh,
            ap_admin_ch: this.apAdminCh,
            ap_admin_wpa: this.apAdminWpa,
            switch_ip: this.switchIp,
            switch_password: this.switchPassword,
            enable_plc: this.enablePlc,
            plc_ip: this.plcIp
        }
     }
}

export default EmsFrcFms.getInstance();

