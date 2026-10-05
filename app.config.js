const fs = require('fs')

const appJson = JSON.parse(fs.readFileSync('./app.json', 'utf8'))
const routerRoot =
  process.env.CARDIOSYNC_ROUTER_ROOT ??
  (process.env.NODE_ENV === 'production' ? 'app-production' : 'app')

if (routerRoot !== 'app' && routerRoot !== 'app-production') {
  throw new Error(
    `Unsupported CARDIOSYNC_ROUTER_ROOT "${routerRoot}". Use "app" or "app-production".`,
  )
}

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,

    extra: {
      ...appJson.expo.extra,
      router: {
        ...appJson.expo.extra?.router,
        root: routerRoot,
      },
    },

    plugins: [
      ...(appJson.expo.plugins ?? []),
      'expo-notifications',
      './plugins/withCardioSyncAlarm',
    ],

    updates: {
      url: 'https://u.expo.dev/50eb957c-a191-4fcb-b6ac-619e72790d2a',
    },

    runtimeVersion: {
      policy: 'appVersion',
    },

    android: {
      ...appJson.expo.android,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    },
  },
}
