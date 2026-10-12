const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')

const config = getDefaultConfig(__dirname)

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib') {
    const tslibCommonJsPath = require.resolve('tslib', {
      paths: [path.dirname(context.originModulePath)],
    })
    const tslibEsmPath = path.join(path.dirname(tslibCommonJsPath), 'tslib.es6.js')

    return context.resolveRequest(context, tslibEsmPath, platform)
  }

  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
