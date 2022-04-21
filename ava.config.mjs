import base from '@srclaunch/dx/ava.config';

export default {
  ...base,
};

// export default {
//   failFast: true,
//   verbose: true,
//   extensions: {
//     ts: 'module',
//   },
//   nodeArguments: [
//     '--loader=ts-node/esm',
//     '--experimental-specifier-resolution=node',
//   ],
//   require: ['ts-node/register/transpile-only'],
// };
