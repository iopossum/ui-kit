import alias from '@rollup/plugin-alias';
import commonJs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import duplicates from 'postcss-discard-duplicates';
import cleanup from 'rollup-plugin-cleanup';
import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
import dts from "rollup-plugin-dts";
import externals from 'rollup-plugin-peer-deps-external';
import styles from "rollup-plugin-styles";
import ts from 'typescript';

import pkg from './package.json' assert { type: "json" };

const input = './src/index.ts';

const aliasProps = {
  entries: [
    { find: /^@utils(.*)$/, replacement: `${pkg.name}/dist/utils.js` },
    { find: /^@stores(.*)$/, replacement: `${pkg.name}/dist/stores.js` },
    { find: /^@hooks(.*)$/, replacement: `${pkg.name}/dist/hooks.js` },        
  ]
};

const typescriptProps = {
  typescript: ts,
  tsconfig: './tsconfig.json',
  exclude: "**/*.stories.tsx"
}

const postcssProps = {
  mode: ["extract", "core.css"],
  modules: false,
  use: ['sass'],
  plugins: [
    autoprefixer(),
    duplicates(),
    cssnano()
  ],
  extensions: ['.css', '.scss']
};

const external = (id) => ['@pharmasoft'].includes(id.split('/')[0])

const config = [{
  input,
  output: [    
    { file: pkg.main, format: 'cjs', sourcemap: true, name: 'core' },    
  ],
  plugins: [
    externals(),
    nodeResolve(),
    commonJs(),
    styles({...postcssProps, mode: ['inject', () => '']}),
    typescript(typescriptProps),    
    json(),
    cleanup(),
    clear({      
      targets: ['dist'],      
    })
  ],
}, {
  input,
  output: [
    { file: pkg.module, format: 'esm', sourcemap: true, assetFileNames: "[name][extname]", }
  ],
  plugins: [
    alias(aliasProps),
    externals(),
    nodeResolve(),
    commonJs(),
    typescript(typescriptProps),
    styles(postcssProps),
    json(),
    cleanup(),
    copy({
      targets: [        
        { src: 'src/styles/icons/**/*', dest: 'dist/assets/icons' },
        { src: 'src/styles/img/**/*', dest: 'dist/assets/img' }
      ]
    })    
  ],
  external,
}, {
  input: './src/utils/index.ts',
  output: [
    { file: 'dist/utils.js', format: 'esm', sourcemap: false, },
    { file: 'dist/cjs/utils.js', format: 'cjs', sourcemap: true, name: 'utils' },
  ],
  plugins: [
    externals(),
    nodeResolve(),
    commonJs(),
    cleanup(),
    typescript(typescriptProps),    
    json(),    
  ],
  external,
}, {
  input: './src/stores/index.ts',
  output: [
    { file: 'dist/stores.js', format: 'esm', sourcemap: false, },
    { file: 'dist/cjs/stores.js', format: 'cjs', sourcemap: true, name: 'stores' },
  ],
  plugins: [
    alias(aliasProps),
    externals(),
    nodeResolve(),
    commonJs(),
    cleanup(),
    typescript(typescriptProps),
    json(),    
  ],
  external,
}, {
  input: './src/hooks/index.ts',
  output: [
    { file: 'dist/hooks.js', format: 'esm', sourcemap: false, },
    { file: 'dist/cjs/hooks.js', format: 'cjs', sourcemap: true, name: 'hooks' },
  ],
  plugins: [
    alias(aliasProps),
    externals(),
    nodeResolve(),
    commonJs(),
    cleanup(),
    typescript(typescriptProps),    
    json(),    
  ],
  external,
}, {
  input: "dist/types/index.d.ts",
  output: [{ file: "dist/index.d.ts", format: "esm" }],
  plugins: [dts()],
  external: [/\.(scss|css)$/],
}, {
  input: "dist/types/stores/index.d.ts",
  output: [{ file: "dist/stores.d.ts", format: "esm" }],
  plugins: [dts()],
  external: [/\.(scss|css)$/],
}, {
  input: "dist/types/hooks/index.d.ts",
  output: [{ file: "dist/hooks.d.ts", format: "esm" }],
  plugins: [dts()],
  external: [/\.(scss|css)$/],
}, {
  input: "dist/types/utils/index.d.ts",
  output: [{ file: "dist/utils.d.ts", format: "esm" }],
  plugins: [dts()],
  external: [/\.(scss|css)$/],
}];


export default config;
