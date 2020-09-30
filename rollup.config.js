import nodeResolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import rollupPostcss from 'rollup-plugin-postcss';
import visualizer from 'rollup-plugin-visualizer';
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import scss from 'rollup-plugin-scss';
import autoprefixer from 'autoprefixer';
import url from '@rollup/plugin-url';
import pkg from './package.json';
import duplicates from 'postcss-discard-duplicates';
import postcss from 'postcss';
import cssnano from 'cssnano';
import clear from 'rollup-plugin-clear'
import copy from 'rollup-plugin-copy';
import alias from '@rollup/plugin-alias';
const fs = require('fs');
const path = require('path');
const postcssUrl  = require('postcss-url');
import nodeSass from 'node-sass';
import sassLoader from './sass-loader';



const external = (id) => {
  // if (/^[./]+(utils|stores)/.test(id)) {
  //   return true;
  // }
  return Object.keys(pkg.dependencies || {}).concat(['@pharmasoft', '@material-ui']).includes(id.split('/')[0]);
};

const options = [
  { filter: '**!/styles/img/!*.png', url: 'rebase', assetsPath: path.join(__dirname, '/dist/css'), useHash: true },
];

const getPlugins = ({ cssFile }) => [
    nodeResolve(),
    alias({
      entries: [
        { find: /^@utils(.*)$/, replacement: `${pkg.name}/dist/js/utils.min.js` },
        { find: /^@stores(.*)$/, replacement: `${pkg.name}/dist/js/stores.min.js` },
        { find: /^@hooks(.*)$/, replacement: `${pkg.name}/dist/js/hooks.min.js` },
        { find: /^@components(.*)$/, replacement: `${pkg.name}/dist/js/components$1.min.js` },
      ]
    }),
    scss({
      output: async function (styles, styleNodes) {
        if (!fs.existsSync(path.join(__dirname, '/dist'))) {
          fs.mkdirSync(path.join(__dirname, '/dist'));
        }
        if (!fs.existsSync(path.join(__dirname, '/dist/css'))) {
          fs.mkdirSync(path.join(__dirname, '/dist/css'));
        }
        const result = await postcss([duplicates, autoprefixer, cssnano]).process(styles);
        fs.writeFileSync(path.join(__dirname, `/dist/css/${cssFile}`), result.css.replace(/~assetsDir/g, './assets'))
      },
      outputStyle: "compressed",
      importer: function(url, prev, done) {
        if (/\.css$/.test(url)) {
          url = url[0] !== '~' ? url : url.slice(1);
          const splits = this.options.includePaths.split(';');
          let data = '';
          for (let i = 0; i < splits.length; i++) {
            try {
              data = fs.readFileSync(path.resolve(splits[i], url)).toString();
              break;
            } catch(e) {}
          }
          return {file: url, contents: data};
        }
        return { file: url };
      }
    }),
    /*rollupPostcss({
      modules: true,
      // use: [['sass', { importer: [() => {
      //   console.log(1111111111111111111111111)
      // }] }]],
      loaders: [sassLoader],
      plugins: [duplicates, autoprefixer, cssnano, postcssUrl(), // Find files
    postcssUrl({
      filter: '**!/styles/img/!*.png', url: 'copy', assetsPath: 'dist/css', useHash: true
    })],
      sourceMap: false,
      test: 111,
      extract: `dist/${cssFile}`,
      extensions: ['.sass','.css']
    }),*/
    sizeSnapshot(),
    // terser(),
    visualizer(),
    babel({
      babelrc: false,
      presets: [
        "@babel/preset-env",
        "@babel/react",
      ],
      plugins: [
        ["import", {
          "libraryName": "antd",
          "style": "css",
        }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        "@babel/plugin-syntax-dynamic-import"
      ],
      extensions: [".js", ".jsx"],
      exclude: 'node_modules/**',
    }),
    commonJs({
      include: /node_modules/,
    }),
    clear({
        // required, point out which directories should be clear.
        targets: ['dist/css', 'dist/js'],
        // optional, whether clear the directores when rollup recompile on --watch mode.
        // watch: true, // default: false
    }),
    copy({
      targets: [
        { src: 'src/styles/fonts/**/*', dest: 'dist/css/fonts' },
        { src: 'src/styles/icons/**/*', dest: 'dist/css/icons' },
        { src: 'src/styles/img/**/*', dest: 'dist/css/assets/img' }
      ]
    })
];

const config = [{
  input: './src/index.js',
  output: [{ file: 'dist/js/components.min.js', format: 'esm' }],
  external,
  plugins: getPlugins({ cssFile: 'all.min.css' })
}, {
  input: './src/utils/index.js',
  output: [{ file: 'dist/js/utils.min.js', format: 'esm' }],
  external,
  plugins: getPlugins({ cssFile: 'utils.min.css' })
}, {
  input: './src/utils/Hooks.js',
  output: [{ file: 'dist/js/hooks.min.js', format: 'esm' }],
  external,
  plugins: getPlugins({ cssFile: 'hooks.min.css' })
}, {
  input: './src/stores/index.js',
  output: [{ file: 'dist/js/stores.min.js', format: 'esm' }],
  external,
  plugins: getPlugins({ cssFile: 'stores.min.css' })
}];


const Components = fs.readdirSync(path.join(__dirname, `/src/components`));
for (let i = 0; i < Components.length; i++) {
  if (!/\.js$/.test(Components[i])) {
    config.push({
      input: `./src/components/${Components[i]}/index.js`,
      output: [{ file: `dist/js/components/${Components[i]}.min.js`, format: 'esm' }],
      external,
      plugins: getPlugins({ cssFile: `${Components[i]}.min.css` })
    })
  }
}

export default config;
