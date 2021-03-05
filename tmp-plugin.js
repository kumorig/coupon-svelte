import { createHash } from 'crypto'
import { existsSync } from 'fs'
import { promises } from 'fs'
import path from 'path'
import postcss from 'postcss'

import loadConfig from 'postcss-load-config'

const readFile = promises.readFile;
const configFiles = ['postcss.config.js', 'tailwind.config.js']

export default function postcssImport () {
  let config
  const cssCache = {}
  return {
    name: 'postcss-import',
    augmentChunkHash (chunk) {
      // apply hashes to chunks (this isn't done properly by sapper atm)
      let hash
      for (const moduleId in chunk.modules) {
        const css = cssCache[moduleId]
        if (css) {
          if (!hash) {
            hash = createHash('sha256')
          }
          hash.update(css.hash)
        }
      }
      if (hash) {
        return hash.digest('hex')
      }
    },
    async buildStart () {
      if (!config) {
        config = await loadConfig()
      }
      configFiles.forEach(file => this.addWatchFile(file))
    },
    async load (id) {
      const idPath = path.parse(id)
      if (idPath.ext === '.css') {
        // ignore svelte css files created with `emitCss` enabled
        const isSvelteCss = existsSync(`${idPath.dir}/${idPath.name}.svelte`)
        if (isSvelteCss) return
        try {
          const content = await readFile(id, 'utf8')
          const { css, map } = await postcss(config.plugins).process(content, {
            from: id
          })
          // already create hashes based on the css result for fast `augmentChunkHash` hash creation
          const hash = createHash('sha256').update(css).digest('hex')
          cssCache[id] = { content, hash }
          return { code: css, map }
        } catch (error) {
          console.error(error)
        }
      }
    },
    watchChange (id) {
      // on config file change
      if (configFiles.some(file => id.includes(file))) {
        config = null
      }
    }
  }
}