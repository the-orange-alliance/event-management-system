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
    Event,
    MatchConfiguration,
    MatchMode, MatchParticipant,
    MatchTimer, Ranking,
    SocketProvider,
    Team
} from "@the-orange-alliance/lib-ems";

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
    public event: Event = new Event();
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

    public async initFms() {
        // Init EMS
        EMSProvider.initialize(host, parseInt(process.env.API_PORT as string, 10));
        process.env.REACT_APP_EMS_SCK_PORT = process.env.SOCKET_PORT;
        SocketProvider.initialize(host);
        this.initSocket();

        // Load Settings from EMS DB
        await this.loadSettings();


        // Init DriverStation listeners
        DriverstationSupport.getInstance().dsInit(udpTcpListenerIp);

        // Init AccessPoint Settings to default
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


    private async loadSettings() {
        const events = await EMSProvider.getEvent();
        if (events.length > 0) {
            this.event = events[0];
            const config = await EMSProvider.getAdvNetConfig(this.event.eventKey);
            if (!config.error) {
                this.settings = new FMSSettings().fromJson(config);
                logger.info('✔ Loaded Settings for FMS with event ' + this.event.eventKey);
            } else {
                await EMSProvider.postAdvNetConfig(this.event.eventKey, this.settings.toJson());
                logger.info('✔ No FMS found for ' + this.event.eventKey +  '. Running with default settings.');
            }
        } else {
            logger.info('✔ No event found. Running with default settings.');
        }
    }

    private updateSettings(newSettings: object) {
        this.settings = new FMSSettings().fromJson(newSettings);
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
        logger.info('✔ Updated Settings!');
    }

    private initSocket() {
        // Setup Socket Connect/Disconnect
        SocketProvider.on("connect", () => {
            logger.info("✔ Connected to EMS through SocketIO.");
            SocketProvider.emit("identify","ems-frc-fms-main", ["event", "scoring", "referee", "fms"]);
        });
        SocketProvider.on("disconnect", () => {
            logger.error("❌ Disconnected from SocketIO.");
        });
        SocketProvider.on("error", () => {
            logger.error("❌ Error With SocketIO, not connected to EMS");
        });
        SocketProvider.on("fms-ping", () => {
            SocketProvider.emit("fms-pong");
        });
        SocketProvider.on("fms-settings-update", (data: string) => {
            this.updateSettings(JSON.parse(data));
            SocketProvider.emit("fms-settings-update-success", JSON.stringify(this.settings.toJson()));
        });
        SocketProvider.on("fms-request-settings", () => {
            SocketProvider.emit("fms-settings", JSON.stringify(this.settings.toJson()));
        });

        // Manage Socket Events
        SocketProvider.on("prestart-response", (err: any, matchJSON: any) => {
            logger.info('🔁 Prestart Command Issued');
            this.matchState = MatchMode.PRESTART;
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
        }).catch(err => logger.error('❌ Error getting participant information: ' + err));
        this.activeMatch = match;
        if(!match) {
            logger.error('❌ Received prestart command, but found no active match');
        }

        // Call DriverStation Prestart
        DriverstationSupport.getInstance().onPrestart(this.activeMatch);
        if(this.settings.enableAdvNet) {
            // Configure AP
            AccesspointSupport.getInstance().handleTeamWifiConfig(match.participants);
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
            this._timer.matchConfig = new MatchConfiguration().fromJSON(timerJSON);
            // Signal DriverStation Start
            DriverstationSupport.getInstance().driverStationMatchStart();
            this._timer.on("match-end", () => {
                this.removeMatchlisteners()
            });
            this._timer.on("match-auto", () => {this.matchState = MatchMode.AUTONOMOUS});
            this._timer.on("match-transition", () => {this.matchState = MatchMode.TRANSITION});
            this._timer.on("match-tele", () => {this.matchState = MatchMode.TELEOPERATED});
            this._timer.on("match-end", () => {this.matchState = MatchMode.ENDED});

            logger.info('Match Started');
            this._timer.start();
            this.matchState = MatchMode.AUTONOMOUS;
            this.timeLeft = this._timer.timeLeft;
            const timerID = global.setInterval(() => {
                this.timeLeft = this._timer.timeLeft;
                if (this._timer.timeLeft <= 0) {
                    this.timeLeft = this._timer.timeLeft;
                    global.clearInterval(timerID);
                }
            }, 1000);
        });
        SocketProvider.on("match-abort", () => {
            this._timer.abort();
            this.timeLeft = this._timer.timeLeft;
            this.removeMatchlisteners();
        });
    }

    private removeMatchlisteners() {
        this._timer.removeAllListeners("match-auto");
        this._timer.removeAllListeners("match-transition");
        this._timer.removeAllListeners("match-tele");
        this._timer.removeAllListeners("match-endgame");
        this._timer.removeAllListeners("match-end");
    }

    private startDriverStation() {
        this.dsInterval = setInterval(()=> { DriverstationSupport.getInstance().runDriverStations() }, 500);
        logger.info('✔ Driver Station Manager Init Complete, Running Loop');
    }

    private startPLC() {
        this.plcInterval = setInterval(()=> { PlcSupport.getInstance().runPlc() }, 100);
        logger.info('✔ PLC Manager Init Complete, Running Loop');
    }

    private startAPLoop() {
        this.apInterval = setInterval(async ()=> { await AccesspointSupport.getInstance().runAp() }, 3000);
        logger.info('✔ Access Point Manager Init Complete, Running Loop');
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
            }).catch(err => logger.error('❌ Error getting match teams: ' + err));
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

