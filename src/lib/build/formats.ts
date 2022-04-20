import { BuildFormat } from '@srclaunch/types';

export function getFormatFileExtension(format: BuildFormat) {
  switch (format) {
    case BuildFormat.CJS:
      return '.cjs';
    case BuildFormat.ESM:
      return '.mjs';
    case BuildFormat.IIFE:
      return '.iife.js';
    case BuildFormat.UMD:
      return '.umd.js';
    default:
      return '.js';
  }
}

export function getViteFormatFileExtension(
  format:
    | 'amd'
    | 'cjs'
    | 'es'
    | 'iife'
    | 'system'
    | 'umd'
    | 'commonjs'
    | 'esm'
    | 'module'
    | 'systemjs',
) {
  switch (format) {
    case 'cjs':
    case 'commonjs':
      return '.cjs';
    case 'es':
    case 'esm':
    case 'module':
      return '.mjs';
    case 'iife':
      return '.iife.js';
    case 'umd':
      return '.umd.js';
    default:
      return `${format}.js`;
  }
}
