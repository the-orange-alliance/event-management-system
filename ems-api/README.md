# EMS REST API

The REST API is a means of communicating with EMS's MySQL databases. This information is dynamic, but not necessarily real-time like the information in 
[ems-socket](https://github.com/orange-alliance/event-management-system/tree/master/ems-socket). The REST API is meant for information that only needs to be requested that
lasts for a decent period of time. For example, the team list on a match preview audience display screen would not change, thus being a REST API endpoint.

This web application was built using primarily [express.js](https://expressjs.com/) and TypeScript.

Express is a fairly simple, but powerful node module that can create http servers and allow
various other middleware for routing and security purposes.

## Running the web server
After running an ```npm install```, you must also have the correct environment deployed using
`gulp update-env[:prod]`. You must also run an `npm run build` to compile the TypeScript into Javascript.

This can also be done a different way using the `ecosystem-config.js` file at the root directory.
Once at the root directory, make sure you have `pm2` globally installed, and run `pm2 start ecosystem.config.js`.
This will spawn the [ems-socket](https://github.com/orange-alliance/event-management-system/tree/master/ems-socket), [ems-api](https://github.com/orange-alliance/event-management-system/tree/master/ems-api),
and [ems-web](https://github.com/orange-alliance/event-management-system/tree/master/ems-web).
web server. For production environment variables, use `pm2 start ecosystem.config.js --env production`. Use ```pm2 help``` for a list of commands and options.