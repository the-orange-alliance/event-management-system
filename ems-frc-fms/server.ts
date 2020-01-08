import logger from "./logger";
import * as path from "path";
import * as dotenv from "dotenv";
import {DriverstationSupport} from "./driverstation-support"
import {
    EMSProvider,
    Match,
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
    private dsInterval: any;
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
        //Init EMS
        EMSProvider.initialize(host, parseInt(process.env.API_PORT as string, 10));
        process.env.REACT_APP_EMS_SCK_PORT = '8800';
        SocketProvider.initialize(host);
        this.initSocket();

        // Init DriverStation listeners
        DriverstationSupport.getInstance().dsInit(udpTcpListenerIp);

        // Init Timer
        this._timer = new MatchTimer();
        this.initTimer();

        // More Things
        this.timeLeft = this._timer.timeLeft;

        // Start Driver Station Updates
        this.startDriverStation();
    }

    private initSocket() {
        // Setup Socket Connect/Disconnect
        SocketProvider.on("connect", () => {
            logger.info("Connected to EMS through SocketIO.");
            SocketProvider.emit("identify","ems-frc-fms-main", ["event", "scoring", "referee", "ds"]);
        });
        SocketProvider.on("disconnect", () => {
            logger.info("Disconnected from SocketIO.");
        });
        SocketProvider.on("error", () => {
            logger.info("Error With SocketIO, not connected to EMS");
        });

        // Manage Socket Events
        SocketProvider.on("prestart-response", (err: any, matchJSON: any) => {
            logger.info('Prestart Command Issued');
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
            }).catch(err => logger.info('Error getting participant information: ' + err));
            this.activeMatch = match;
            if(!match) {
                logger.info('Received prestart command, but found no active match');
            }

            // Call DriverStation Prestart
            DriverstationSupport.getInstance().onPrestart(this.activeMatch);
            // Init Field Hardware (AP, Switch)
            // TODO
        });
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
        logger.info('DriverStation Support Init Complete, Running Loop');
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

export default EmsFrcFms.getInstance();