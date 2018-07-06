module.exports = {
	apps : [{
		name        : "ems-api",
		script      : "./ems-api/bin/www",
		watch       : true,
		env: {
			"NODE_ENV": "development",
			"API_SERV_PORT": "8008",
			"TARGET_ENV": "GLOBAL",
			"HOST_IP": "127.0.0.1"
		},
		env_staging : {
			"NODE_ENV": "staging",
			"API_SERV_PORT": "8009",
			"TARGET_ENV": "GLOBAL",
			"HOST_IP": "127.0.0.1"
		},
		env_production : {
			"NODE_ENV": "production",
			"API_SERV_PORT": "8009",
			"TARGET_ENV": "GLOBAL",
			"HOST_IP": "127.0.0.1"
		}
	}, 
	{
		name        : "ems-web",
		script      : "./ems-web/bin/www",
		watch       : true,
		env: {
			"NODE_ENV": "development",
			"WEB_SERV_PORT": "80"
		},
		env_staging : {
			"NODE_ENV": "staging",
			"WEB_SERV_PORT": "801"
		},
		env_production : {
			"NODE_ENV": "production",
			"WEB_SERV_PORT": "80"
		}
	},
	{
		name        : "ems-sck",
		script      : "./ems-socket/bin/www",
		watch       : true,
		env: {
			"NODE_ENV": "development",
			"SOCKET_SERV_PORT": "8081"
		},
		env_staging : {
			"NODE_ENV": "staging",
			"SOCKET_SERV_PORT": "8081"
		},
		env_production : {
			"NODE_ENV": "production",
			"SOCKET_SERV_PORT": "8081"
		}
	}]
};