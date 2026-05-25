import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: 'esm',
  outDir: 'dist',
  target: 'node18',
  clean: true,
  dts: false,
  sourcemap: false,
  minify: false,
  shims: true,
  external: [
    'react-devtools-core',
    'yoga-wasm-web',
    'sharp',
  ],
});
