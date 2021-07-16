const gulp = require("gulp");
const rename = require("gulp-rename");
const fs = require("fs");
const install = require("gulp-install");
const del = require("del");

const ecosystemConfig = require("./ecosystem.config");

gulp.task("generate-env:prod", (done) => {
  let reactAppContents = "NODE_ENV=production\n";
  for (let app of ecosystemConfig.apps) {
    let contents = "NODE_ENV=production\n";
    for (let key in app.env_production) {
      if (app.env_production.hasOwnProperty(key) && key !== "NODE_ENV") {
        contents += key + "=" + app.env_production[key] + "\n";
        reactAppContents += "REACT_APP_" + app.name.toString().toUpperCase().replace("-", "_") + "_" + key + "=" + app.env_production[key] + "\n";
      }
    }
    if (app.name === "ems-sck") {
      contents += "API_PORT=" + ecosystemConfig.apps[0].env_production.PORT;
    }
    fs.writeFileSync(app.name + ".env", contents);
  }
  fs.writeFileSync("ems-core.env", reactAppContents);
  done();
});

gulp.task("generate-env", (done) => {
  let reactAppContents = "NODE_ENV=development\n";
  for (let app of ecosystemConfig.apps) {
    let contents = "NODE_ENV=development\n";
    for (let key in app.env) {
      if (app.env.hasOwnProperty(key) && key !== "NODE_ENV") {
        contents += key + "=" + app.env[key] + "\n";
        reactAppContents += "REACT_APP_" + app.name.toString().toUpperCase().replace("-", "_") + "_" + key + "=" + app.env[key] + "\n";
      }
    }
    if (app.name === "ems-sck") {
      contents += "API_PORT=" + ecosystemConfig.apps[0].env.PORT;
    }
    fs.writeFileSync(app.name + ".env", contents);
  }
  fs.writeFileSync("ems-core.env", reactAppContents);
  done();
});

gulp.task("clean-build", (done) => {
  del.sync(["build/dist/*/**"]);
  del.sync(["build/ems/*/**"]);
  done();
});

gulp.task("deploy-env", (done) => {
  // gulp.src([".env"]).pipe(gulp.dest("audience-display"));
  // gulp.src([".env"]).pipe(gulp.dest("ref-tablet"));
  // gulp.src([".env"]).pipe(gulp.dest("pit-display"));
  gulp.src(["ems-core.env"]).pipe(rename(".env")).pipe(gulp.dest("audience-display"));
  gulp.src(["ems-core.env"]).pipe(rename(".env")).pipe(gulp.dest("field-monitor"));
  gulp.src(["ems-core.env"]).pipe(rename(".env")).pipe(gulp.dest("ref-tablet"));
  gulp.src(["ems-core.env"]).pipe(rename(".env")).pipe(gulp.dest("ems-core"));
  gulp.src(["ems-core.env"]).pipe(rename(".env")).pipe(gulp.dest("ems-frc-fms"));
  gulp.src(["ems-api.env"]).pipe(rename(".env")).pipe(gulp.dest("ems-api"));
  gulp.src(["ems-web.env"]).pipe(rename(".env")).pipe(gulp.dest("ems-web"));
  gulp.src(["ems-sck.env"]).pipe(rename(".env")).pipe(gulp.dest("ems-socket"));
  done();
});

gulp.task("post-build", (done) => {
  gulp.src(["ems-frc-fms/**/*", "!ems-frc-fms/src/**/*"]).pipe(gulp.dest("build/ems/server/ems-frc-fms"));
  gulp.src(["ems-api/**/*", "!ems-api/src/**/*"]).pipe(gulp.dest("build/ems/server/ems-api"));
  gulp.src(["ems-web/**/*", "!ems-web/src/**/*"]).pipe(gulp.dest("build/ems/server/ems-web"));
  gulp.src(["ems-socket/**/*", "!ems-socket/src/**/*"]).pipe(gulp.dest("build/ems/server/ems-socket"));
  gulp.src(["ems-core/build/**/*"]).pipe(gulp.dest("build/ems/public/desktop"));
  gulp.src(["ems-core/main/**/*"]).pipe(gulp.dest("build/ems/public/desktop/main"));
  gulp.src(["ems-core/match-maker/**/*"]).pipe(gulp.dest("build/ems/public/desktop/match-maker"));
  gulp.src(["audience-display/build/**/*"]).pipe(gulp.dest("build/ems/public/audience-display"));
  gulp.src(["ref-tablet/build/**/*"]).pipe(gulp.dest("build/ems/public/ref-tablet"));
  gulp.src(["field-monitor/build/**/*"]).pipe(gulp.dest("build/ems/public/field-monitor"));
  gulp.src(["ems-home/build/**/*"]).pipe(gulp.dest("build/ems/public/ems-home"));
  gulp.src(["ecosystem.config.js"]).pipe(gulp.dest("build/ems/server/"));

  gulp.src(["ems-core/.env"]).pipe(gulp.dest("build/ems/public/desktop"));
  gulp.src(["ems-api/.env"]).pipe(gulp.dest("build/ems/server/ems-api"));
  gulp.src(["ems-web/.env"]).pipe(gulp.dest("build/ems/server/ems-web"));
  gulp.src(["ems-socket/.env"]).pipe(gulp.dest("build/ems/server/ems-socket"));
  // del.sync(["build/ems/node_modules/**", "build/ems/src/**"]);
  done();
});

gulp.task("update-pkg", (done) => {
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
  done();
});

gulp.task("install-deps", (done) => {
  gulp.src("build/ems/package.json").pipe(install({npm: "--production"}));
  done();
});

gulp.task("place-binary", (done) => {
  gulp.src(["ems-api/node_modules/sqlite3/lib/binding/**/*"]).pipe(gulp.dest("build/ems/node_modules/sqlite3/lib/binding"));
  done();
});

gulp.task("place-resources", (done) => {
  gulp.src(["ems-core/public/favicon.ico"]).pipe(rename("icon.ico")).pipe(gulp.dest("build/resources"));
  gulp.src(["ems-core/res/**/*"]).pipe(gulp.dest("build/resources"));
  done();
});

/* .env tasks */
gulp.task("update-env:prod", gulp.series("generate-env:prod", "deploy-env"));
gulp.task("update-env", gulp.series("generate-env", "deploy-env"));

// exports.updateEnv = gulp.series("generate-env", "deploy-env");

/* Prebuild tasks - TODO add more tasks... */
gulp.task("prebuild:prod", gulp.series("generate-env:prod", "deploy-env"));
gulp.task("prebuild", gulp.series("generate-env", "deploy-env"));
/* Inbetween these tasks, run `npm run build` */

/* Postbuild tasks */
gulp.task("postbuild", gulp.series("clean-build", "post-build")); // , "update-pkg")); removed due because problems

/* Predist tasks */
gulp.task("predist", gulp.series("install-deps", "place-binary", "place-resources"));
