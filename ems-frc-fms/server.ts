import logger from "./logger";
import * as path from "path";
import * as dotenv from "dotenv";
import {DriverstationSupport} from "./driverstation-support"
import {
    EMSProvider,
    Match,
    MatchConfiguration,
    MatchMode, MatchParticipant,
    MatchTimer,
    SocketProvider,
    Team
} from "@the-orange-alliance/lib-ems";

/* Load our environment variables. The .env file is not included in the repository.
 * Only TOA staff/collaborators will have access to their own, specialized version of
 * the .env file.
 */
dotenv.config({path: path.join(__dirname, "../.env")});

const ipRegex = /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/;


const mode = (process.env.NODE_ENV || "development").toUpperCase();
let host = process.env.HOST || "127.0.0.1";

if (process.argv[2] && process.argv[2].match(ipRegex)) {
    host = process.argv[2];
}

export class EmsFrcFms {
    private static _instance: EmsFrcFms;
    public _timer: MatchTimer;
    public activeMatch: Match;
    public timeLeft: number;
    public matchState: number;
    public matchStateMap: Map<String, number> = new Map<String, number>([["prestart", 0], ["timeout", 1], ["post-timeout", 2], ["start-match", 3], ["auto", 4], ["transition", 5], ["tele", 5]]);

    constructor() {

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
        SocketProvider.initialize((host));
        this.initSocket();

        // Init DriverStation listeners
        DriverstationSupport.getInstance().dsInit(host);

        // Init Timer
        this._timer = new MatchTimer();
        this.initTimer();

        // More Things
        this.timeLeft = this._timer.timeLeft;
    }

    private initSocket() {
        // Setup Socket Connect/Disconnect
        SocketProvider.on("connect", () => {
            logger.info("Connected to SocketIO.");
            SocketProvider.emit("identify","ems-frc-fms-main", ["event", "scoring"]);
        });
        SocketProvider.on("disconnect", () => {
            logger.info("Disconnected from SocketIO.");
        });

        // Manage Socket Events
        SocketProvider.on("prestart-response", () => {
            EMSProvider.getActiveMatch(1).then((match) => {
                this.activeMatch = match;
                if(!match) {
                    logger.info('Received prestart command, but found no active match');
                }
                // Call DriverStation Prestart
                DriverstationSupport.getInstance().onPrestart(this.activeMatch);
                // Init Field Hardware (AP, Switch)
                // TODO
            }).catch((err) => {
                logger.info('Received prestart command, but found no active match');
            });
        });
    }

    private initTimer() {
        SocketProvider.on("match-start", (timerJSON: any) => {
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
}

export default EmsFrcFms.getInstance();