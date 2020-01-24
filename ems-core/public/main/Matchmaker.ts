import {IpcMessageEvent, ipcMain, app} from "electron";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import logger from "./Logger";
import {execFile} from "child_process";
import {Match, TournamentType} from "@the-orange-alliance/lib-ems";

const appDataPath = app.getPath("appData") + path.sep + app.getName();
const isProd = process.env.NODE_ENV === "production";

interface IMatchMakerOptions {
  teams: number,
  rounds: number,
  quality: string,
  teamsPerAlliance: number,
  fields: number,
  eventKey: string,
  type: TournamentType
}

let matchMakerPath = "";
if (os.type() === "Windows_NT") {
  if (isProd) {
    matchMakerPath = path.join(__dirname, "../match-maker/windows/MatchMaker");
  } else {
    matchMakerPath = path.join(__dirname, "../../match-maker/windows/MatchMaker.exe");
  }
} else {
  if (isProd) {
    matchMakerPath = path.join(__dirname, "../match-maker/macOS/MatchMaker");
  } else {
    matchMakerPath = path.join(__dirname, "../../match-maker/macOS/MatchMaker");
  }
}

ipcMain.on("match-maker-teams", (event: IpcMessageEvent, scheduleType: TournamentType, teams: number[]) => {
  const teamListPath = path.join(appDataPath, (scheduleType + "-teams.txt").toLowerCase());
  let contents = "";
  for (const team of teams) {
    contents += team + "\n";
  }
  fs.writeFile(teamListPath, contents, (err) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info(`Successfully created team list: (${teamListPath})`);
    }
    event.sender.send("match-maker-teams-response", err, teamListPath);
  });
});

ipcMain.on("match-maker", (event: IpcMessageEvent, config: IMatchMakerOptions) => {
  const teamListPath = path.join(appDataPath, (config.type + "-teams.txt").toLowerCase());
  const args = `-l ${teamListPath} -t ${config.teams} -r ${config.rounds} -a ${config.teamsPerAlliance} ${config.quality} -s -o`;
  logger.debug(`Executing ${matchMakerPath} with ${args}`);
  // @ts-ignore - Unless there is a better way to do this...
  execFile(matchMakerPath, ["-l", teamListPath, "-t", config.teams, "-r", config.rounds, "-a", config.teamsPerAlliance, config.quality, "-s", "-o"], (error: any, stdout: any, stderr: any) => {
    if (error) {
      logger.error(error);
      event.sender.send("match-maker-response", error, null);
    } else {
      const result = [];
      const lines = stdout.toString().split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > 2) {
         const fields = lines[i].split(" ");
         const matchNumber = parseInt(fields[0], 10);
         const matchKey = config.eventKey + "-" + getMatchKeyPartialFromType(config.type) + matchNumber.toString().padStart(3, "0");
         const participants = [];
         for (let j = 0; j < (config.teamsPerAlliance * 2); j++) {
           if (j < config.teamsPerAlliance) {
             participants.push({
               card_status: 0,
               match_key: matchKey,
               match_participant_key: matchKey + "-T" + (j + 1),
               station: 11 + j,
               surrogate: parseInt(fields[(j * 2) + 2].replace("\r", ""), 10),
               team_key: parseInt(fields[(j * 2) + 1], 10)
             });
           } else {
             participants.push({
               card_status: 0,
               match_key: matchKey,
               match_participant_key: matchKey + "-T" + (j + 1),
               station: 21 + j - config.teamsPerAlliance,
               surrogate: parseInt(fields[(j * 2) + 2].replace("\r", ""), 10),
               team_key: parseInt(fields[(j * 2) + 1], 10)
             });
           }
         }
         result.push({
           field_number: matchNumber % config.fields === 0 ? config.fields : (matchNumber % config.fields),
           match_detail_key: matchKey + "D",
           match_key: matchKey,
           match_name: config.type + " Match " + matchNumber,
           participants: participants,
           result: -1,
           tournament_level: getTournamentLevelFromType(config.type)
         });
        }
      }
      event.sender.send("match-maker-response", undefined, result);
    }
  });
});

function getTournamentLevelFromType(type: TournamentType) {
  switch (type) {
    case "Practice":
      return Match.PRACTICE_LEVEL;
    case "Qualification":
      return Match.QUALIFICATION_LEVEL;
    case "Ranking":
      return Match.FINALS_LEVEL;
    default:
      return Match.PRACTICE_LEVEL;
  }
}

function getMatchKeyPartialFromType(type: TournamentType) {
  switch (type) {
    case "Practice":
      return "P";
    case "Qualification":
      return "Q";
    case "Ranking":
      return "E";
    default:
      return "P";
  }
}