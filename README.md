# @srclaunch/cli

![GitHub Repo stars](https://img.shields.io/github/stars/srclaunch/cli?label=GitHub%20Stars) ![Issues](https://img.shields.io/github/issues/srclaunch/cli?label=Issues) ![Build](https://github.com/srclaunch/cli/actions/workflows/publish.yml/badge.svg) ![Coveralls](https://img.shields.io/coveralls/github/srclaunch/cli?label=Test%20Coverage) ![npms.io (final)](https://img.shields.io/npms-io/final-score/@srclaunch/cli?label=NPMS%20Score)

Command line tool for managing SrcLaunch Workspaces and Projects.

## Commands

### Usage

`$ srclaunch <command>`

---

### `build`

Commands for building a project.

##### Sub-commands

- `esbuild` - Builds project using ESBuild
- `vite` - Builds project using Vite
- `types` - Builds TypeScript definitions

---

### `changesets`

Commands for managing changes.

##### Sub-commands

- `create` - Create a new changeset and add uncommited changes
- `list` - List changesets (default --pending=true)
- `help` - Displays help information changeset commands

---

### `dev`

Commands for building a project.

##### Sub-commands

- `start`
- `help`

---

### `help`

---

### `infrastructure`

##### Sub-commands

- `deploy`
- `help`

---

### `models`

##### Sub-commands

- `clean`
- `create`
- `build`
- `list`
- `help`

---

### `preview`

##### Sub-commands

- `start`
- `help`

---

### `projects`

##### Sub-commands

- `create` - Create a new SrcLaunch project
- `list` - List SrcLaunch projects
- `help` - Shows project command help information

---

### `release`

Collect changes, bump and tag version, and deploy

##### Sub-commands

- `create` - Commits all changesets, bumps package version and pushes changes to the remote repository.

---

### `serve`

##### Sub-commands

- `web-app` - Serves a Web application through via static files or SSR.
- `web-service` - Starts a Web service listener
- `help` - Shows serve command help information
