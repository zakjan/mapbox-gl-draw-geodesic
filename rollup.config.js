import pkg from './package.json' assert { type: 'json' };
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

function bundle(format, filename, options = {}) {
  return {
    input: 'src/index.js',
    output: {
      file: filename,
      format: format,
      name: 'MapboxDrawGeodesic',
      sourcemap: true,
      globals: {
        '@mapbox/mapbox-gl-draw': 'MapboxDraw',
      },
    },
    external: [
      ...Object.keys(pkg.peerDependencies),
      ...(!options.resolve ? [
        ...Object.keys(pkg.dependencies),
        'geodesy-fn/src/spherical.js',
      ] : []),
      'fs',
      'path',
    ],
    plugins: [
      ...(options.resolve ? [resolve()] : [resolve({ resolveOnly: [/^@mapbox\/mapbox-gl-draw\/src\/.*/] })]),
      commonjs(),
      babel({ babelHelpers: 'runtime' }),
      options.minimize ? terser() : false,
      options.stats ? visualizer({
        filename: filename + '.stats.html',
      }) : false,
    ],
  };
}

export default [
  bundle('cjs', pkg.main),
  bundle('es', pkg.module),
  bundle('umd', pkg.browser.replace('.min', ''), { resolve: true, stats: true }),
  bundle('umd', pkg.browser, { resolve: true, minimize: true }),
];
