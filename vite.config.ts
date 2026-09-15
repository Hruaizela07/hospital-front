import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      exclude: [/node_modules/, /app\/gql\//],
      babelConfig: {
        presets: ['@babel/preset-typescript'],
        plugins: [
          ['babel-plugin-react-compiler'],
        ],
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: ['@apollo/client'],
  },
  server: {
    port: 3000,
  },
})
