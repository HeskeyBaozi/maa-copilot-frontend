import react from '@vitejs/plugin-react'

import * as fs from 'node:fs'
import * as path from 'node:path'
import { type Plugin, defineConfig, loadEnv } from 'vite'
import viteTsconfigPath from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), viteTsconfigPath(), reactVirtualized()],
    server: {
      port: 5128,
    },
    resolve: {
      alias: {
        src: require('path').resolve(__dirname, 'src'),
      },
    },
    build: {
      sourcemap: true,
    },
  }
})

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`
export function reactVirtualized(): Plugin {
  return {
    name: 'flat:react-virtualized',
    // Note: we cannot use the `transform` hook here
    //       because libraries are pre-bundled in vite directly,
    //       plugins aren't able to hack that step currently.
    //       so instead we manually edit the file in node_modules.
    //       all we need is to find the timing before pre-bundling.
    configResolved() {
      const file = require
        .resolve('react-virtualized')
        .replace(
          path.join('dist', 'commonjs', 'index.js'),
          path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js'),
        )
      const code = fs.readFileSync(file, 'utf-8')
      const modified = code.replace(WRONG_CODE, '')
      fs.writeFileSync(file, modified)
    },
  }
}
