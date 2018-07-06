const gulp = require("gulp");
// const util = require("gulp-util");
// const replace = require("gulp-replace");
const fs = require("fs");
const del = require("del");
const ecosystemConfig = require("./ecosystem.config");

gulp.task("generate-env:prod", () => {
	let contents = "NODE_ENV=production\n";
	for (let app of ecosystemConfig.apps) {
		for (let key in app.env_production) {
			if (app.env_production.hasOwnProperty(key) && key !== "NODE_ENV") {
				contents += key + "=" + app.env_production[key] + "\n";
				contents += "REACT_APP_" + key + "=" + app.env_production[key] + "\n";
			}
		}
	}
	fs.writeFileSync(".env", contents);
});

gulp.task("generate-env", () => {
	let contents = "NODE_ENV=development\n";
	for (let app of ecosystemConfig.apps) {
		for (let key in app.env) {
			if (app.env.hasOwnProperty(key) && key !== "NODE_ENV") {
				contents += key + "=" + app.env[key] + "\n";
				contents += "REACT_APP_" + key + "=" + app.env[key] + "\n";
			}
		}
	}
	fs.writeFileSync(".env", contents);
});

gulp.task("clean-build", () => {
	del.sync(["build/dist/*/**"]);
	del.sync(["build/ems/*/**"]);
});

gulp.task("deploy-env", () => {
	gulp.src([".env"]).pipe(gulp.dest("audience-display"));
	gulp.src([".env"]).pipe(gulp.dest("ref-tablet"));
	gulp.src([".env"]).pipe(gulp.dest("pit-display"));
	gulp.src([".env"]).pipe(gulp.dest("ems-core"));
	gulp.src([".env"]).pipe(gulp.dest("ems-api"));
	gulp.src([".env"]).pipe(gulp.dest("ems-web"));
	gulp.src([".env"]).pipe(gulp.dest("ems-socket"));
});

gulp.task("post-build", () => {
	gulp.src(["audience-display/build/**/*"]).pipe(gulp.dest("build/ems/public/audience-display"));
	gulp.src(["ref-tablet/build/**/*"]).pipe(gulp.dest("build/ems/public/ref-tablet"));
	gulp.src(["pit-display/build/**/*"]).pipe(gulp.dest("build/ems/public/pit-display"));
	gulp.src(["ems-api/**/*"]).pipe(gulp.dest("build/ems/server/ems-api"));
	gulp.src(["ems-web/**/*"]).pipe(gulp.dest("build/ems/server/ems-web"));
	gulp.src(["ems-socket/**/*"]).pipe(gulp.dest("build/ems/server/ems-socket"));
	gulp.src(["ems-core/**/*", "!ems-core/src/**/*"]).pipe(gulp.dest("build/ems/"));
	gulp.src(["ecosystem.config.js"]).pipe(gulp.dest("build/ems/server/"));
	gulp.src([".env"]).pipe(gulp.dest("build/ems/"));
	// del.sync(["build/ems/node_modules/**", "build/ems/src/**"]);
});


/* .env tasks */
gulp.task("update-env:prod", ["generate-env:prod", "deploy-env"]);
gulp.task("update-env", ["generate-env", "deploy-env"]);

/* Prebuild tasks - TODO add more tasks... */
gulp.task("prebuild:prod", ["generate-env:prod", "deploy-env"]);
gulp.task("prebuild", ["generate-env", "deploy-env"]);
/* Inbetween these tasks, run `npm run build` */

/* Postbuild tasks */
gulp.task("postbuild", ["clean-build", "post-build"]);