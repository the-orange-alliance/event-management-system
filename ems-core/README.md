Event Management System
This system was built using three key components, React.js, TypeScript, and Electron.js.

React is used to develop the front-end web interface, while Electron is used to package the application in a desktop-friendly environment.
TypeScript is used to enforce a strict, object-oriented programming approach.

Electron.js allows React.js to interact with native operating system elements such as file handling and application notifications. These are key features in any desktop application which are normally impossible using plain React.js.

## Running the development server
1. Run an `npm install`
2. Go to the project root and run `gulp update-env[:prod]` (:prod for production)
3. Open a separate command line and start the React.js development server with `npm run react`.
4. In your IDE of choice, now start the desktop application using `npm run desktop`.

NOTE: The react server MUST be started before running the desktop application.

## Troubleshooting
Once React.js finishes loading the development server, it should error out on a line that says 'window.require is not a function'. That's fine. this error
is due to the normal web browser not having any native functionality such as `fs`, `path`, or `window.require`. Once you open
the desktop environment, everything should be fine.

Make sure Node.js v8.0 or later is installed.