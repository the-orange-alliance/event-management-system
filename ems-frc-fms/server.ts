import logger from "./logger";
import * as path from "path";
import * as dotenv from "dotenv";
import DriverstationSupport from "./driverstation-support"
import {EMSProvider, FGC_CONFIG, FTC_CONFIG, MatchTimer} from "@the-orange-alliance/lib-ems";

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

//Init EMS
EMSProvider.initialize(host, parseInt(process.env.API_PORT as string, 10));

// Init DriverStation UDP listener
DriverstationSupport.dsInit(host);
