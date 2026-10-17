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

const isProductionApk = process.env.EAS_BUILD_PROFILE === 'production-apk'

const buildArchs = isProductionApk
  ? ['armeabi-v7a', 'arm64-v8a']
  : ['armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64']

const plugins = (appJson.expo.plugins ?? []).map((plugin) => {
  if (Array.isArray(plugin) && plugin[0] === 'expo-build-properties') {
    const pluginOptions = plugin[1] ?? {}

    return [
      plugin[0],
      {
        ...pluginOptions,
        android: {
          ...pluginOptions.android,
          buildArchs,
        },
      },
    ]
  }

  return plugin
})

plugins.push('./plugins/withCardioSyncUpdateInstaller')

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
      ...plugins,
      'expo-notifications',
      './plugins/withCardioSyncAlarm',
    ],

    updates: {
      url: 'https://u.expo.dev/50eb957c-a191-4fcb-b6ac-619e72790d2a',
      checkAutomatically: 'NEVER',
    },

    runtimeVersion: {
      policy: 'appVersion',
    },

    ios: {
      ...appJson.expo.ios,
      runtimeVersion: {
        policy: 'fingerprint',
      },
    },

    android: {
      ...appJson.expo.android,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    },
  },
}
