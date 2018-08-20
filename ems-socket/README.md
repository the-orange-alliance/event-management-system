# EMS SocketIO Server

The socket server is EMS's main transport for real-time information. The primary users of this service are the
[audience-display](https://github.com/orange-alliance/event-management-system/tree/master/audience-display) and [ref-tablet](https://github.com/orange-alliance/event-management-system/tree/master/ref-tablet).
Both web applications rely on displaying real-time data during a match for not only information, but match outcome.

This web application was built using primarily [socket.io](https://socket.io/) and TypeScript.

Socket.io is a fast, lightweight library for various transports such as websockets and long-polling. While it
does not provide native functionality for actual websockets, it provides a very close implementation.

## Running the socket service
After running an ```npm install```, you must also have the correct environment deployed using
`gulp update-env[:prod]`.

This can also be done a different way using the `ecosystem-config.js` file at the root directory.
Once at the root directory, make sure you have `pm2` globally installed, and run `pm2 start ecosystem.config.js`.
This will spawn the [ems-socket](https://github.com/orange-alliance/event-management-system/tree/master/ems-socket), [ems-api](https://github.com/orange-alliance/event-management-system/tree/master/ems-api),
and [ems-web](https://github.com/orange-alliance/event-management-system/tree/master/ems-web).
web server. For production environment variables, use `pm2 start ecosystem.config.js --env production`. Use ```pm2 help``` for a list of commands and options.