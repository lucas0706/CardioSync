const fs = require('node:fs/promises')
const path = require('node:path')
const {
  createRunOncePlugin,
  withAndroidManifest,
  withDangerousMod,
  withMainApplication,
} = require('@expo/config-plugins')

const PLUGIN_NAME = 'with-cardiosync-alarm'
const TEMPLATE_DIRECTORY = path.join(__dirname, 'android')
const REQUIRED_PERMISSIONS = [
  'android.permission.WAKE_LOCK',
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.RECEIVE_BOOT_COMPLETED',
]

function ensureManifestPermission(manifest, permissionName) {
  const permissions = manifest.manifest['uses-permission'] ?? []
  const exists = permissions.some((permission) => permission.$?.['android:name'] === permissionName)

  if (!exists) {
    permissions.push({
      $: {
        'android:name': permissionName,
      },
    })
  }

  manifest.manifest['uses-permission'] = permissions
}

function findOrCreateComponent(components, name) {
  let component = components.find((entry) => entry.$?.['android:name'] === name)

  if (!component) {
    component = {
      $: {
        'android:name': name,
      },
    }
    components.push(component)
  }

  return component
}

function ensureIntentAction(component, actionName) {
  const filters = component['intent-filter'] ?? []
  let filter = filters.find((entry) =>
    (entry.action ?? []).some((action) => action.$?.['android:name'] === actionName),
  )

  if (!filter) {
    filter = {
      action: [],
    }
    filters.push(filter)
  }

  if (!(filter.action ?? []).some((action) => action.$?.['android:name'] === actionName)) {
    filter.action ??= []
    filter.action.push({
      $: {
        'android:name': actionName,
      },
    })
  }

  component['intent-filter'] = filters
}

function withAlarmManifest(config) {
  return withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults
    const application = manifest.manifest.application?.[0]

    if (!application) {
      throw new Error(`${PLUGIN_NAME}: AndroidManifest.xml has no application element.`)
    }

    REQUIRED_PERMISSIONS.forEach((permission) => ensureManifestPermission(manifest, permission))

    application.receiver ??= []
    const alarmReceiver = findOrCreateComponent(application.receiver, '.alarm.AlarmReceiver')
    alarmReceiver.$['android:enabled'] = 'true'
    alarmReceiver.$['android:exported'] = 'false'

    const bootReceiver = findOrCreateComponent(application.receiver, '.alarm.BootReceiver')
    bootReceiver.$['android:enabled'] = 'true'
    bootReceiver.$['android:exported'] = 'true'
    ensureIntentAction(bootReceiver, 'android.intent.action.BOOT_COMPLETED')

    application.service ??= []
    const headlessService = findOrCreateComponent(
      application.service,
      '.alarm.AlarmBackupTaskService',
    )
    headlessService.$['android:enabled'] = 'true'
    headlessService.$['android:exported'] = 'false'

    return modConfig
  })
}

function withAlarmSchedulerPackage(config) {
  const packageName = config.android?.package
  if (!packageName) {
    throw new Error(`${PLUGIN_NAME}: expo.android.package must be configured.`)
  }

  return withMainApplication(config, (modConfig) => {
    let contents = modConfig.modResults.contents
    const importStatement = `import ${packageName}.alarm.AlarmSchedulerPackage`

    if (!contents.includes(importStatement)) {
      const packageDeclaration = /^(package\s+[\w.]+\s*\n)/m
      if (!packageDeclaration.test(contents)) {
        throw new Error(
          `${PLUGIN_NAME}: could not find the Kotlin package declaration in MainApplication.`,
        )
      }
      contents = contents.replace(packageDeclaration, `$1\n${importStatement}\n`)
    }

    if (!/add\s*\(\s*AlarmSchedulerPackage\s*\(/.test(contents)) {
      const packageList = /PackageList\(this\)\.packages\.apply\s*\{/
      if (!packageList.test(contents)) {
        throw new Error(
          `${PLUGIN_NAME}: could not find PackageList(this).packages.apply in MainApplication.`,
        )
      }
      contents = contents.replace(
        packageList,
        `$&\n          add(\n            AlarmSchedulerPackage(),\n          )`,
      )
    }

    modConfig.modResults.contents = contents
    return modConfig
  })
}

function withAlarmKotlinSources(config) {
  const packageName = config.android?.package
  if (!packageName) {
    throw new Error(`${PLUGIN_NAME}: expo.android.package must be configured.`)
  }

  return withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const destinationDirectory = path.join(
        modConfig.modRequest.projectRoot,
        'android',
        'app',
        'src',
        'main',
        'java',
        ...packageName.split('.'),
        'alarm',
      )
      await fs.mkdir(destinationDirectory, { recursive: true })

      const sourceFiles = [
        'AlarmScheduling.kt',
        'AlarmSchedulerModule.kt',
        'AlarmSchedulerPackage.kt',
        'AlarmReceiver.kt',
        'BootReceiver.kt',
        'AlarmBackupTaskService.kt',
      ]

      for (const fileName of sourceFiles) {
        const source = await fs.readFile(path.join(TEMPLATE_DIRECTORY, fileName), 'utf8')
        const contents = source.replaceAll('com.lucas0706a.CardioSync', packageName)
        await fs.writeFile(path.join(destinationDirectory, fileName), contents)
      }

      return modConfig
    },
  ])
}

const withCardioSyncAlarm = (config) => {
  config = withAlarmManifest(config)
  config = withAlarmSchedulerPackage(config)
  config = withAlarmKotlinSources(config)
  return config
}

module.exports = createRunOncePlugin(withCardioSyncAlarm, PLUGIN_NAME, '1.0.0')
