import { BuildFormat } from '@srclaunch/types';

export function getFormatFileExtension(format: BuildFormat) {
  switch (format) {
    case BuildFormat.CJS:
      return 'cjs.js';
    case BuildFormat.ESM:
      return 'esm.js';
    case BuildFormat.IIFE:
      return 'iife.js';
    case BuildFormat.UMD:
      return 'umd.js';
    default:
      return 'js';
  }
}
