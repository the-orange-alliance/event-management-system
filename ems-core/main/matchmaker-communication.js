const {ipcMain, app} = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const logger = require("./logger");
const execute = require("child_process").execFile;
const appDataPath = app.getPath("appData") + path.sep + app.getName();

let matchMakerPath = "";

if (os.type() === "Windows_NT") {
  matchMakerPath = path.join(__dirname, "../match-maker/windows/MatchMaker.exe");
} else {
  matchMakerPath = path.join(__dirname, "../match-maker/macOS/MatchMaker");
}

ipcMain.on("match-maker-teams", (event, teams) => {
  const teamListPath = path.join(appDataPath, "team-list.txt");
  let contents = "";
  for (const team of teams) {
    contents += team + "\n";
  }
  fs.writeFile(teamListPath, contents, (err) => {
    if (err) {
      logger.error(err);
      event.sender.send("match-maker-teams-error", err);
    } else {
      logger.info(`Successfully created team-list.txt (${teamListPath})`);
      event.sender.send("match-maker-teams-success", teamListPath);
    }
  });
});

ipcMain.on("match-maker", (event, config) => {
  const teamListPath = path.join(appDataPath, "team-list.txt");
  const args = `-l ${teamListPath} -t ${config.teams} -r ${config.rounds} -a ${config.teamsPerAlliance} ${config.quality} -s -o`;
  logger.debug(`Executing ${matchMakerPath} with ${args}`);
  execute(matchMakerPath, ["-l", teamListPath, "-t", config.teams, "-r", config.rounds, "-a", config.teamsPerAlliance, config.quality, "-s", "-o"], (error, stdout, stderr) => {
    if (error) {
      logger.error(error);
      event.sender.send("match-maker-error", error);
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
               match_key: matchKey,
               match_participant_key: matchKey + "-T" + (j + 1),
               station: 10 + j,
               surrogate: parseInt(fields[(j * 2) + 2].replace("\r", ""), 10),
               team_key: parseInt(fields[(j * 2) + 1], 10)
             });
           } else {
             participants.push({
               match_key: matchKey,
               match_participant_key: matchKey + "-T" + (j + 1),
               station: 20 + j - config.teamsPerAlliance,
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
           tournament_level: getTournamentLevelFromType(config.type)
         });
        }
      }
      event.sender.send("match-maker-success", result);
    }
  });
});

function getTournamentLevelFromType(type) {
  switch (type) {
    case "Practice":
      return 0;
    case "Qualification":
      return 1;
    case "Finals":
      return 2;
    default:
      return 0;
  }
}

function getMatchKeyPartialFromType(type) {
  switch (type) {
    case "Practice":
      return "P";
    case "Qualification":
      return "Q";
    case "Finals":
      return "E";
    default:
      return "P";
  }
}