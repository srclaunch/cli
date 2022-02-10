import base from '@srclaunch/dx/.versionrc';

export default {
  ...base,
  skip: {
    "bump": true,
    'commit': true,
    "tag": true,
  }
};