import { BuildFormat } from '@srclaunch/types';

export function getFormatFileExtension(format: BuildFormat) {
  switch (format) {
    case BuildFormat.CJS:
      return '.cjs';
    case BuildFormat.ESM:
      return '.mjs';
    case BuildFormat.IIFE:
      return '.iife.cjs';
    case BuildFormat.UMD:
      return '.umd.cjs';
    default:
      return `${format}.js`;
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
      return '.iife.cjs';
    case 'umd':
      return '.umd.cjs';
    default:
      return `${format}.js`;
  }
}
