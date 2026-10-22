import { existsSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const projectUrl = pathToFileURL(`${projectRoot}/`).href

registerHooks({
  resolve(specifier, context, nextResolve) {
    let target

    if (specifier.startsWith('@/')) {
      target = resolve(projectRoot, 'src', specifier.slice(2))
    } else if (specifier.startsWith('.') && context.parentURL?.startsWith(projectUrl)) {
      target = fileURLToPath(new URL(specifier, context.parentURL))
    } else {
      return nextResolve(specifier, context)
    }

    if (extname(target) && existsSync(target)) {
      return nextResolve(pathToFileURL(target).href, context)
    }

    for (const candidate of [`${target}.ts`, `${target}.tsx`, resolve(target, 'index.ts')]) {
      if (existsSync(candidate)) {
        return nextResolve(pathToFileURL(candidate).href, context)
      }
    }

    return nextResolve(specifier, context)
  },
})
