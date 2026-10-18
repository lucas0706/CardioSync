const fs = require('node:fs/promises')
const path = require('node:path')
const {
  createRunOncePlugin,
  withAndroidManifest,
  withDangerousMod,
} = require('@expo/config-plugins')

const PLUGIN_NAME = 'with-cardiosync-quick-widget'
const TEMPLATE_DIRECTORY = path.join(__dirname, 'android-widget')

function ensureWidgetReceiver(config) {
  return withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults
    const application = manifest.manifest.application?.[0]

    if (!application) {
      throw new Error(`${PLUGIN_NAME}: AndroidManifest.xml has no application element.`)
    }

    application.receiver ??= []

    const receiverName = '.widget.QuickMeasurementWidgetProvider'
    let receiver = application.receiver.find(
      (entry) => entry.$?.['android:name'] === receiverName,
    )

    if (!receiver) {
      receiver = { $: { 'android:name': receiverName } }
      application.receiver.push(receiver)
    }

    receiver.$['android:enabled'] = 'true'
    receiver.$['android:exported'] = 'true'
    receiver.$['android:label'] = '@string/app_name'

    const filters = receiver['intent-filter'] ?? []
    let updateFilter = filters.find((filter) =>
      (filter.action ?? []).some(
        (action) =>
          action.$?.['android:name'] === 'android.appwidget.action.APPWIDGET_UPDATE',
      ),
    )

    if (!updateFilter) {
      updateFilter = { action: [] }
      filters.push(updateFilter)
    }

    updateFilter.action ??= []

    if (
      !updateFilter.action.some(
        (action) =>
          action.$?.['android:name'] === 'android.appwidget.action.APPWIDGET_UPDATE',
      )
    ) {
      updateFilter.action.push({
        $: {
          'android:name': 'android.appwidget.action.APPWIDGET_UPDATE',
        },
      })
    }

    receiver['intent-filter'] = filters

    receiver['meta-data'] ??= []
    const metadataName = 'android.appwidget.provider'
    let metadata = receiver['meta-data'].find(
      (entry) => entry.$?.['android:name'] === metadataName,
    )

    if (!metadata) {
      metadata = { $: { 'android:name': metadataName } }
      receiver['meta-data'].push(metadata)
    }

    metadata.$['android:resource'] =
      '@xml/cardiosync_quick_measurement_widget_info'

    return modConfig
  })
}

function generateWidgetFiles(config) {
  const packageName = config.android?.package

  if (!packageName) {
    throw new Error(`${PLUGIN_NAME}: expo.android.package must be configured.`)
  }

  return withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const root = modConfig.modRequest.projectRoot
      const javaDirectory = path.join(
        root,
        'android',
        'app',
        'src',
        'main',
        'java',
        ...packageName.split('.'),
        'widget',
      )

      const resourceDirectory = path.join(
        root,
        'android',
        'app',
        'src',
        'main',
        'res',
      )

      await fs.mkdir(javaDirectory, { recursive: true })

      const kotlinTemplate = await fs.readFile(
        path.join(TEMPLATE_DIRECTORY, 'QuickMeasurementWidgetProvider.kt'),
        'utf8',
      )

      await fs.writeFile(
        path.join(javaDirectory, 'QuickMeasurementWidgetProvider.kt'),
        kotlinTemplate.replaceAll('__CARDIOSYNC_PACKAGE__', packageName),
      )

      const resourceFiles = [
        {
          source: 'cardiosync_quick_measurement_widget_info.xml',
          destination: path.join(
            resourceDirectory,
            'xml',
            'cardiosync_quick_measurement_widget_info.xml',
          ),
        },
        {
          source: 'cardiosync_quick_measurement_widget.xml',
          destination: path.join(
            resourceDirectory,
            'layout',
            'cardiosync_quick_measurement_widget.xml',
          ),
        },
        {
          source: 'cardiosync_widget_background.xml',
          destination: path.join(
            resourceDirectory,
            'drawable',
            'cardiosync_widget_background.xml',
          ),
        },
        {
          source: 'cardiosync_widget_plus_background.xml',
          destination: path.join(
            resourceDirectory,
            'drawable',
            'cardiosync_widget_plus_background.xml',
          ),
        },
      ]

      for (const file of resourceFiles) {
        const source = await fs.readFile(
          path.join(TEMPLATE_DIRECTORY, file.source),
          'utf8',
        )

        await fs.mkdir(path.dirname(file.destination), { recursive: true })
        await fs.writeFile(file.destination, source)
      }

      return modConfig
    },
  ])
}

function withCardioSyncQuickWidget(config) {
  config = ensureWidgetReceiver(config)
  config = generateWidgetFiles(config)
  return config
}

module.exports = createRunOncePlugin(
  withCardioSyncQuickWidget,
  PLUGIN_NAME,
  '1.0.0',
)
