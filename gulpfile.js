const gulp = require("gulp");
const rename = require("gulp-rename");
const fs = require("fs");
const install = require("gulp-install");
const del = require("del");

const ecosystemConfig = require("./ecosystem.config");

gulp.task("generate-env:prod", () => {
  let reactAppContents = "NODE_ENV=production\n";
  for (let app of ecosystemConfig.apps) {
    let contents = "NODE_ENV=production\n";
    for (let key in app.env_production) {
      if (app.env_production.hasOwnProperty(key) && key !== "NODE_ENV") {
        contents += key + "=" + app.env_production[key] + "\n";
        reactAppContents += "REACT_APP_" + app.name.toString().toUpperCase().replace("-", "_") + "_" + key + "=" + app.env_production[key] + "\n";
      }
    }
    fs.writeFileSync(app.name + ".env", contents);
  }
  fs.writeFileSync("ems-core.env", reactAppContents);
});

gulp.task("generate-env", () => {
  let reactAppContents = "NODE_ENV=development\n";
  for (let app of ecosystemConfig.apps) {
    let contents = "NODE_ENV=development\n";
    for (let key in app.env) {
      if (app.env.hasOwnProperty(key) && key !== "NODE_ENV") {
        contents += key + "=" + app.env[key] + "\n";
        reactAppContents += "REACT_APP_" + app.name.toString().toUpperCase().replace("-", "_") + "_" + key + "=" + app.env[key] + "\n";
      }
    }
    fs.writeFileSync(app.name + ".env", contents);
  }
  fs.writeFileSync("ems-core.env", reactAppContents);
});

gulp.task("clean-build", () => {
  del.sync(["build/dist/*/**"]);
  del.sync(["build/ems/*/**"]);
});

gulp.task("deploy-env", () => {
  // gulp.src([".env"]).pipe(gulp.dest("audience-display"));
  // gulp.src([".env"]).pipe(gulp.dest("ref-tablet"));
  // gulp.src([".env"]).pipe(gulp.dest("pit-display"));
  gulp.src(["ems-core.env"]).pipe(rename(".env")).pipe(gulp.dest("audience-display"));
  gulp.src(["ems-core.env"]).pipe(rename(".env")).pipe(gulp.dest("ref-tablet"));
  gulp.src(["ems-core.env"]).pipe(rename(".env")).pipe(gulp.dest("ems-core"));
  gulp.src(["ems-api.env"]).pipe(rename(".env")).pipe(gulp.dest("ems-api"));
  gulp.src(["ems-web.env"]).pipe(rename(".env")).pipe(gulp.dest("ems-web"));
  gulp.src(["ems-sck.env"]).pipe(rename(".env")).pipe(gulp.dest("ems-socket"));
});

gulp.task("post-build", () => {
  gulp.src(["ems-api/**/*", "!ems-api/src/**/*"]).pipe(gulp.dest("build/ems/server/ems-api"));
  gulp.src(["ems-web/**/*", "!ems-web/src/**/*"]).pipe(gulp.dest("build/ems/server/ems-web"));
  gulp.src(["ems-socket/**/*", "!ems-socket/src/**/*"]).pipe(gulp.dest("build/ems/server/ems-socket"));
  gulp.src(["ems-core/build/**/*"]).pipe(gulp.dest("build/ems/public/desktop"));
  gulp.src(["ems-core/main/**/*"]).pipe(gulp.dest("build/ems/public/desktop/main"));
  gulp.src(["ems-core/match-maker/**/*"]).pipe(gulp.dest("build/ems/public/desktop/match-maker"));
  gulp.src(["audience-display/build/**/*"]).pipe(gulp.dest("build/ems/public/audience-display"));
  gulp.src(["ref-tablet/build/**/*"]).pipe(gulp.dest("build/ems/public/ref-tablet"));
  gulp.src(["ecosystem.config.js"]).pipe(gulp.dest("build/ems/server/"));

  gulp.src(["ems-core/.env"]).pipe(gulp.dest("build/ems/public/desktop"));
  gulp.src(["ems-api/.env"]).pipe(gulp.dest("build/ems/server/ems-api"));
  gulp.src(["ems-web/.env"]).pipe(gulp.dest("build/ems/server/ems-web"));
  gulp.src(["ems-sck/.env"]).pipe(gulp.dest("build/ems/server/ems-socket"));
  // del.sync(["build/ems/node_modules/**", "build/ems/src/**"]);
});

gulp.task("update-pkg", () => {
  let mainContents = JSON.parse(fs.readFileSync("ems-core/package.electron.json"));
  let newDeps = {};
  let coreDeps = JSON.parse(fs.readFileSync("ems-core/package.json")).dependencies;
  let apiDeps = JSON.parse(fs.readFileSync("ems-api/package.json")).dependencies;
  let webDeps = JSON.parse(fs.readFileSync("ems-web/package.json")).dependencies;
  let sckDeps = JSON.parse(fs.readFileSync("ems-socket/package.json")).dependencies;
  for (let dep in coreDeps) {
    if (coreDeps.hasOwnProperty(dep)) {
      if (typeof newDeps[dep] === "undefined") {
        newDeps[dep] = {};
      }
      newDeps[dep] = coreDeps[dep];
    }
  }
  for (let dep in apiDeps) {
    if (apiDeps.hasOwnProperty(dep)) {
      if (typeof newDeps[dep] === "undefined") {
        newDeps[dep] = {};
      }
      newDeps[dep] = apiDeps[dep];
    }
  }
  for (let dep in webDeps) {
    if (webDeps.hasOwnProperty(dep)) {
      if (typeof newDeps[dep] === "undefined") {
        newDeps[dep] = {};
      }
      newDeps[dep] = webDeps[dep];
    }
  }
  for (let dep in sckDeps) {
    if (sckDeps.hasOwnProperty(dep)) {
      if (typeof newDeps[dep] === "undefined") {
        newDeps[dep] = {};
      }
      newDeps[dep] = sckDeps[dep];
    }
  }
  mainContents.dependencies = newDeps;
  fs.writeFileSync("build/ems/package.json", JSON.stringify(mainContents));
});

gulp.task("install-deps", () => {
  gulp.src("build/ems/package.json").pipe(install({npm: "--production"}));
});

gulp.task("place-binary", () => {
  gulp.src(["ems-api/node_modules/sqlite3/lib/binding/**/*"]).pipe(gulp.dest("build/ems/node_modules/sqlite3/lib/binding"));
});

gulp.task("place-resources", () => {
  gulp.src(["ems-core/public/favicon.ico"]).pipe(rename("icon.ico")).pipe(gulp.dest("build/resources"));
  gulp.src(["ems-core/res/**/*"]).pipe(gulp.dest("build/resources"));
});

/* .env tasks */
gulp.task("update-env:prod", ["generate-env:prod", "deploy-env"]);
gulp.task("update-env", ["generate-env", "deploy-env"]);

/* Prebuild tasks - TODO add more tasks... */
gulp.task("prebuild:prod", ["generate-env:prod", "deploy-env"]);
gulp.task("prebuild", ["generate-env", "deploy-env"]);
/* Inbetween these tasks, run `npm run build` */

/* Postbuild tasks */
gulp.task("postbuild", ["clean-build", "post-build", "update-pkg"]);

/* Predist tasks */
gulp.task("predist", ["install-deps", "place-binary", "place-resources"]);