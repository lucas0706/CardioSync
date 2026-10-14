const fs = require('node:fs/promises')
const path = require('node:path')
const {
  createRunOncePlugin,
  withAndroidManifest,
  withDangerousMod,
  withMainApplication,
} = require('@expo/config-plugins')

const PLUGIN_NAME = 'with-cardiosync-update-installer'
const TEMPLATE_DIRECTORY = path.join(__dirname, 'android')
const PERMISSION = 'android.permission.REQUEST_INSTALL_PACKAGES'

function withInstallerPermission(config) {
  return withAndroidManifest(config, (modConfig) => {
    const permissions = modConfig.modResults.manifest['uses-permission'] ?? []
    const exists = permissions.some((permission) => permission.$?.['android:name'] === PERMISSION)

    if (!exists) {
      permissions.push({
        $: {
          'android:name': PERMISSION,
        },
      })
    }

    modConfig.modResults.manifest['uses-permission'] = permissions
    return modConfig
  })
}

function withInstallerPackage(config) {
  const packageName = config.android?.package
  if (!packageName) {
    throw new Error(`${PLUGIN_NAME}: expo.android.package must be configured.`)
  }

  return withMainApplication(config, (modConfig) => {
    let contents = modConfig.modResults.contents
    const importStatement = `import ${packageName}.updateinstaller.UpdateInstallerPackage`

    if (!contents.includes(importStatement)) {
      const packageDeclaration = /^(package\s+[\w.]+\s*\n)/m
      if (!packageDeclaration.test(contents)) {
        throw new Error(`${PLUGIN_NAME}: could not find the Kotlin package declaration.`)
      }
      contents = contents.replace(packageDeclaration, `$1\n${importStatement}\n`)
    }

    if (!/add\s*\(\s*UpdateInstallerPackage\s*\(/.test(contents)) {
      const packageList = /PackageList\(this\)\.packages\.apply\s*\{/
      if (!packageList.test(contents)) {
        throw new Error(`${PLUGIN_NAME}: could not find PackageList(this).packages.apply.`)
      }
      contents = contents.replace(packageList, `$&\n          add(UpdateInstallerPackage())`)
    }

    modConfig.modResults.contents = contents
    return modConfig
  })
}

function withInstallerSources(config) {
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
        'updateinstaller',
      )
      await fs.mkdir(destinationDirectory, { recursive: true })

      for (const fileName of ['UpdateInstallerModule.kt', 'UpdateInstallerPackage.kt']) {
        const source = await fs.readFile(path.join(TEMPLATE_DIRECTORY, fileName), 'utf8')
        const contents = source.replaceAll('com.lucas0706a.CardioSync', packageName)
        await fs.writeFile(path.join(destinationDirectory, fileName), contents)
      }

      return modConfig
    },
  ])
}

function withCardioSyncUpdateInstaller(config) {
  config = withInstallerPermission(config)
  config = withInstallerPackage(config)
  config = withInstallerSources(config)
  return config
}

module.exports = createRunOncePlugin(withCardioSyncUpdateInstaller, PLUGIN_NAME, '1.0.0')
