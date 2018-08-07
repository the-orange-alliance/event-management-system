# Referee Tablet Web Application

The referee tablet is a web application used by certified referees at an event. Using the application, referees can assign yellow and red cards, as well as
award or retract penalties during a match. Only up to 3 ref-tablets per field can be connected at any given time. This authorization is secured by
[ems-socket](https://github.com/orange-alliance/event-management-system/tree/master/ems-socket).

This web application was built using [React.js](https://reactjs.org/).

React is used to develop the front-end web interface, and communicates with [ems-socket](https://github.com/orange-alliance/event-management-system/tree/master/ems-socket) and [ems-api](https://github.com/orange-alliance/event-management-system/tree/master/ems-api) to provide real-time updates.

## Running the development server
After running an ```npm install```, you must also accomplish two tasks:
1. Go to the project root and run a `gulp update-env[:prod]` to populate the project's `.env` file.
2. Return to `ref-tablet` and run an `npm run build`. React will now recognize the .env file is in the
project directory, and load the application with the variables prefixed with `REACT_APP_`.
3. Once the build finishes, run `npm start` to open a development server. Any time you want to switch environment variables,
you MUST repeat steps 1 and 2.

*NOTE: For full functionality you must have [ems-socket](https://github.com/orange-alliance/event-management-system/tree/master/ems-socket) and [ems-api](https://github.com/orange-alliance/event-management-system/tree/master/ems-api) instances running, and make sure that the two instances are on the
same environment mode. e.g. ref-tablet cannot be in development mode while ems-socket and ems-api are in production mode. It just don't work.*