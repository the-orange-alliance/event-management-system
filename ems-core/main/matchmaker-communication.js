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
      event.sender.send("match-maker-success", stdout);
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