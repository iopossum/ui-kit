import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import alias from '@rollup/plugin-alias';
import commonJs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcss from 'postcss'
import cssComments from 'postcss-discard-comments';
import duplicates from 'postcss-discard-duplicates';
import cleanup from 'rollup-plugin-cleanup';
import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
import dts from "rollup-plugin-dts";
import externals from 'rollup-plugin-peer-deps-external';
import scss from "rollup-plugin-scss";
import styles from "rollup-plugin-styles";
import * as terserModule from "rollup-plugin-terser";
import typescript2 from "rollup-plugin-typescript2";
import ts from 'typescript';

import pkg from './package.json' assert { type: "json" };

const terser = terserModule.terser;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = './src/index.ts';

const aliasProps = {
  entries: [
    { find: '@components', replacement: `${pkg.name}/components` },
    { find: '@utils', replacement: `${pkg.name}/utils` },
    { find: '@stores', replacement: `${pkg.name}/stores` },
    { find: '@hooks', replacement: `${pkg.name}/hooks` },
    { find: '@types', replacement: `${pkg.name}/types` },
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
    cssnano(),
    cssComments()
  ],
  extensions: ['.css', '.scss']
};

const external = (id) => ['@pharmasoft'].includes(id.split('/')[0]);

const externalDts = (id) => ['@pharmasoft'].includes(id.split('/')[0]) || /\.(scss|css)$/.test(id);

const buildFiles = (folder) => {
  const isComponent = folder === 'components';
  const files = fs.readdirSync(path.join(__dirname, `/src/${folder}`));  
  for (let i = 0; i < files.length; i++) {
    const isIndex = files[i].indexOf("index") > -1;
    if (isComponent && !isIndex || !isComponent) {
      config.push({
        input: isComponent ? `./src/${folder}/${files[i]}/index.ts` : `./src/${folder}/${files[i]}`,
        output: [{ file: isComponent ? `dist/${folder}/${files[i]}/index.js` : `dist/${folder}/${files[i].replace(/ts$/, 'js')}`, format: 'esm', sourcemap: false }],
        plugins: [
          alias(aliasProps),
          externals(),
          nodeResolve(),
          commonJs(),
          cleanup(),
          isComponent && 
          scss({
            fileName: `${files[i]}.css`,
            processor: () => postcss([autoprefixer()])          
          }),
          terser(),
          typescript2({...typescriptProps, tsconfigOverride: {compilerOptions: {declaration: false, declarationDir: undefined, sourceMap: false, emitDeclarationOnly: false}}}),        
          json(),          
        ],
        external,
      });
      config.push({
        input: isComponent ? `dist/types/${folder}/${files[i]}/index.d.ts` : `dist/types/${folder}/${files[i].replace(/ts$/, 'd.ts')}`,
        output: [{ file: isComponent ? `dist/${folder}/${files[i]}/index.d.ts` : `dist/${folder}/${files[i].replace(/ts$/, 'd.ts')}`, format: "esm", sourcemap: false }],
        plugins: [
          alias(aliasProps),
          dts({
            compilerOptions: {
              baseUrl: "src",
              importHelpers: true,
            },
          }),          
        ],
        external: externalDts,
      });
    }    
  }
}

const config = [{
  input,
  output: [    
    { file: `dist/${pkg.main}`, format: 'cjs', sourcemap: false, name: 'core' },    
  ],
  plugins: [
    externals(),
    nodeResolve(),
    commonJs(),
    styles({...postcssProps, mode: ['inject', () => '']}),
    typescript(typescriptProps),    
    json(),
    cleanup(),
    terser(),
    clear({      
      targets: ['dist'],      
    }),    
  ],
}, 
{
  input,
  output: [
    { file: `dist/${pkg.module}`, format: 'esm', sourcemap: false, assetFileNames: "[name][extname]", }
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
    terser(),    
    copy({
      targets: [        
        { src: 'src/styles/icons/**/*', dest: 'dist/assets/icons' },
        { src: 'src/styles/img/**/*', dest: 'dist/assets/img' }
      ]
    })    
  ],
  external,
},
{
  input: './src/utils/index.ts',
  output: [    
    { file: 'dist/cjs/utils.js', format: 'cjs', sourcemap: false, name: 'utils' },
  ],
  plugins: [
    externals(),
    nodeResolve(),
    commonJs(),
    cleanup(),
    typescript(typescriptProps),    
    json(),
    terser(),    
  ],
  external,
}, 
{
  input: './src/stores/index.ts',
  output: [    
    { file: 'dist/cjs/stores.js', format: 'cjs', sourcemap: false, name: 'stores' },
  ],
  plugins: [
    alias(aliasProps),
    externals(),
    nodeResolve(),
    commonJs(),
    cleanup(),
    typescript(typescriptProps),
    json(),
    terser(),    
  ],
  external,
}, {
  input: './src/hooks/index.ts',
  output: [    
    { file: 'dist/cjs/hooks.js', format: 'cjs', sourcemap: false, name: 'hooks' },
  ],
  plugins: [
    alias(aliasProps),
    externals(),
    nodeResolve(),
    commonJs(),
    cleanup(),
    typescript(typescriptProps),    
    json(),
    terser(),
  ],
  external,
}, {
  input: "dist/types/index.d.ts",
  output: [{ file: "dist/index.d.ts", format: "esm", sourcemap: false }],
  plugins: [
    alias(aliasProps),
    dts({
      compilerOptions: {
        baseUrl: "src",
        importHelpers: true,
      },
    }),
    copy({
      targets: [        
        { src: 'dist/types/types/index.d.ts', dest: 'dist/types/' },
      ]
    })    
  ],
  external: externalDts,
}];

buildFiles('utils');
buildFiles('stores');
buildFiles('hooks');
buildFiles('components');

export default config;
