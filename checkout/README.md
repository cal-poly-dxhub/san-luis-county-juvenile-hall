This application was created from the create-react-app script, and demonstrates how to integrate the AWS Cognito hosted / built in sign-in and sign-up UI content with a React application.

## Running the application in developer mode

1. Modify `src/config/app-config.json` to match your user pool and application URLs. When running locally, the `signoutUri` will property need to be `http://localhost:3000/` and the `callbackUri` property will need to be `http://localhost:3000/callback`.
2. Run `npm install` to setup and install the dependencies.
3. Run `npm start` to start the application.
4. A browser session should automatically open, pointing at `http:localhost:3000`.

## Deploying the application

1. Modify `src/config/app-config.json` to match your user pool and application URLs. When running locally, the `signoutUri` will property need to be `https://slojhcheckout.calpoly.io` and the `callbackUri` property will need to be `https://slojhcheckout.calpoly.io/callback`.
2. Run `npm build` to build the react application and prepare it to deploy.
3. Run `npm deploy` to deploy the application to https://slojhcheckout.calpoly.io/