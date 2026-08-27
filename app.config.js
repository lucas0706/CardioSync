const fs = require('fs');

const appJson = JSON.parse(
  fs.readFileSync('./app.json', 'utf8'),
);

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    android: {
      ...appJson.expo.android,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    },
  },
};
