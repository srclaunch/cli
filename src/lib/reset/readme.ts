export function getREADMEContent({
  badges = { coverage: true, issues: true, npms: true, publish: true },
  description,
  name,
}: {
  badges: {
    coverage?: boolean;
    issues?: boolean;
    npms?: boolean;
    publish?: boolean;
  };
  description?: string;
  name?: string;
}) {
  return `# ${name}

  ${
    badges.issues &&
    `[![Issues](https://img.shields.io/github/issues/srclaunch/cli?label=Issues)](https://github.com/srclaunch/cli/issues)`
  } ${
    badges.coverage &&
    `[![Coveralls](https://img.shields.io/coveralls/github/srclaunch/cli?label=Test%20Coverage)](https://coveralls.io/github/srclaunch/cli)`
  } ${
    badges.publish &&
    `[![Build](https://github.com/srclaunch/cli/actions/workflows/publish.yml/badge.svg)](https://github.com/srclaunch/cli/actions/workflows/publish.yml)`
  } ${
    badges.npms &&
    `[![npms.io (final)](https://img.shields.io/npms-io/final-score/@srclaunch/cli?label=NPMS%20Score)](https://npms.io/search?q=@srclaunch/cli)`
  }

${description}

## Installation

  With Yarn:
  \`\`\`bash
  yarn add ${name}
  \`\`\`

  With NPM:
  \`\`\`bash
  npm install ${name}
  \`\`\`


## License

MIT
`;
}
