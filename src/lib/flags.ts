import { Flag } from 'meow';

export type InteractiveModeFlag = {
  interactive: {
    alias: 'i';
    default: false;
    description: 'Interactive mode';
    type: 'boolean';
  };
};
