const fs = require('fs');

const appJson = JSON.parse(
  fs.readFileSync('./app.json', 'utf8'),
);

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,

    updates: {
      url: 'https://u.expo.dev/50eb957c-a191-4fcb-b6ac-619e72790d2a',
    },

    runtimeVersion: {
      policy: 'appVersion',
    },

    android: {
      ...appJson.expo.android,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ??
        './google-services.json',
    },
  },
};
