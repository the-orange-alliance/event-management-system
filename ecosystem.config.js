module.exports = {
    apps : [{
        name        : "ems-api",
        script      : "./ems-api/build/server.js",
        watch       : true,
        env: {
            "NODE_ENV": "development",
            "PORT": "8008",
        },
        env_staging : {
            "NODE_ENV": "staging",
            "PORT": "8008",
        },
        env_production : {
            "NODE_ENV": "production",
            "PORT": "8008",
        }
    },
        {
            name        : "ems-web",
            script      : "./ems-web/build/server.js",
            watch       : true,
            env: {
                "NODE_ENV": "development",
                "PORT": "80"
            },
            env_staging : {
                "NODE_ENV": "staging",
                "PORT": "80"
            },
            env_production : {
                "NODE_ENV": "production",
                "PORT": "80"
            }
        },
        {
            name        : "ems-sck",
            script      : "./ems-socket/build/server.js",
            watch       : true,
            env: {
                "NODE_ENV": "development",
                "PORT": "8080"
            },
            env_staging : {
                "NODE_ENV": "staging",
                "PORT": "8080"
            },
            env_production : {
                "NODE_ENV": "production",
                "PORT": "8080"
            }
        }]
};