import latestVersion from 'latest-version';
import chalk from 'chalk';
import semverMaxSatisfying from 'semver/ranges/max-satisfying';
import semverGreaterThan from 'semver/functions/gt';
import semverDiff from 'semver/functions/diff';
import { shellExec } from '../cli';
import {
  BrowserPackage,
  NodePackage,
  Package,
  Platform,
  Project,
  ProjectType,
  UniversalPackage,
} from '@srclaunch/types';
import {
  AMAZON_COGNITO_IDENTITY_JS_DEPENDENCIES,
  ASYNC_EXIT_HOOK_DEPENDENCIES,
  AWS_SDK_DEPENDENCIES,
  AXIOS_DEPENDENCIES,
  CHANGE_CASE_DEPEENDENCIES,
  COLOR_NAMER_DEPEENDENCIES,
  COMPRESSION_DEPENDENCIES,
  CONFIG_DEPENDENCIES,
  CORS_DEPENDENCIES,
  CRYPTO_JS_DEPENDENCIES,
  CURRENCY_CODES_DEPEENDENCIES,
  HISTORY_DEPENDENCIES,
  EMAIL_VALIDATOR_DEPENDENCIES,
  EXPRESS_DEPENDENCIES,
  HEX_RGB_DEPENDENCIES,
  JS_FILE_DOWNLOAD_DEPENDENCIES,
  KEYGRIP_DEPENDENCIES,
  LUXON_DEPENDENCIES,
  MULTER_DEPENDENCIES,
  NANOID_DEPENDENCIES,
  PASSWORD_VALIDATOR_DEPENDENCIES,
  PLAID_DEPENDENCIES,
  PLURALIZE_DEPENDENCIES,
  QUERY_STRING_DEPENDENCIES,
  REACT_COLORFUL_DEPENDENCIES,
  REACT_COUNTRY_FLAG_DEPENDENCIES,
  REACT_DATE_PICKER_DEPENDENCIES,
  REACT_DEPENDENCIES,
  REACT_DOM_DEPENDENCIES,
  REACT_DROPZONE_DEPENDENCIES,
  REACT_HOOKS_DEPENDENCIES,
  REACT_REDUX_DEPENDENCIES,
  REACT_ROUTER_DEPENDENCIES,
  REACT_SYNTAX_HIGHLIGHTER_DEPENDENCIES,
  REDUX_DEPENDENCIES,
  REDUX_TOOLKIT_DEPENDENCIES,
  RGB_HEX_DEPENDENCIES,
  SRCLAUNCH_DATA_CLIENT_DEPENDENCIES,
  SRCLAUNCH_HTTP_SERVER_DEPENDENCIES,
  SRCLAUNCH_NODE_ENVIRONMENT_DEPENDENCIES,
  SRCLAUNCH_EXCEPTIONS_DEPENDENCIES,
  SRCLAUNCH_HTTP_CLIENT_DEPENDENCIES,
  SRCLAUNCH_I18N_DEPENDENCIES,
  SRCLAUNCH_ICONS_DEPENDENCIES,
  SRCLAUNCH_LOGGER_DEPENDENCIES,
  SRCLAUNCH_TRANSFORM_DEPENDENCIES,
  SRCLAUNCH_VALIDATION_DEPENDENCIES,
  STYLED_COMPONENTS_DEPENDENCIES,
  SRCLAUNCH_THEMES_DEPENDENCIES,
  UUID_DEPENDENCIES,
  SRCLAUNCH_WEB_APPLICATION_STATE_DEPENDENCIES,
  SRCLAUNCH_WEB_ENVIRONMENT_DEPENDENCIES,
  ZXCVBN_DEPENDENCIES,
  PICO_COLORS_DEPENDENCIES,
  SERIALIZE_ERROR_DEPENDENCIES,
} from '../../constants/dependencies';
import {
  ASYNC_EXIT_HOOK_DEV_DEPENDENCIES,
  AVA_TESTING_DEV_DEPENDENCIES,
  COMMON_NODE_PLATFORM_DEV_DEPENDENCIES,
  ESLINT_DEV_DEPENDENCIES,
  EXPRESS_DEV_DEPENDENCIES,
  GITHUB_DEV_DEPENDENCIES,
  JEST_REACT_TESTING_DEV_DEPENDENCIES,
  JEST_TESTING_DEV_DEPENDENCIES,
  KEYGRIP_DEV_DEPENDENCIES,
  LUXON_DEV_DEPENDENCIES,
  MULTER_DEV_DEPENDENCIES,
  PRETTIER_DEV_DEPENDENCIES,
  QUERY_STRING_DEV_DEPENDENCIES,
  REACT_DEV_DEPENDENCIES,
  REACT_ROUTER_DEV_DEPENDENCIES,
  SEQUELIZE_DEV_DEPENDENCIES,
  SRCLAUNCH_CLI_DEV_DEPENDENCIES,
  SRCLAUNCH_DX_DEV_DEPENDENCIES,
  SRCLAUNCH_TYPES_DEV_DEPENDENCIES,
  STYLED_COMPONENTS_DEV_DEPENDENCIES,
  STYLELINT_DEV_DEPEENDENCIES,
  TEST_COVERAGE_DEV_DEPENDENCIES,
  TYPESCRIPT_DEV_DEPENDENCIES,
} from '../../constants/dev-dependencies';

const emoji = {
  log: '\u26aa\ufe0f',
  info: '\ud83d\udd35',
  warn: '\u26a0\ufe0f',
  warning: '\ud83d\udfe1',
  error: '\ud83d\udd34',
  success: '\u2705',
};

export function sortDependencies(dependencies: { [key: string]: string } = {}) {
  if (!dependencies) {
    return {};
  }

  console.log('dependencies to be sorted', dependencies);
  console.log([...Object.entries(dependencies)]);
  return [...Object.entries(dependencies)]
    .sort(([, v1], [, v2]) => +v2 - +v1)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

export function getPlatformDependencies(platform?: Platform) {
  switch (platform) {
    case Platform.Desktop:
      return {};
    case Platform.Mobile:
      return {};
    case Platform.NodeJS:
      return {};
    case Platform.TV:
      return {};
    case Platform.Universal:
      return {};
    case Platform.Watch:
      return {};
    case Platform.Web:
      return {};
  }
}

export function getPlatformDevDependencies(platform?: Platform) {
  switch (platform) {
    case Platform.Desktop:
      return {};
    case Platform.Mobile:
      return {};
    case Platform.NodeJS:
      return { ...COMMON_NODE_PLATFORM_DEV_DEPENDENCIES };
    case Platform.TV:
      return {};
    case Platform.Universal:
      return {};
    case Platform.Watch:
      return {};
    case Platform.Web:
      return {};
  }
}

export function getProjectTypeDependencies(type: ProjectType) {
  switch (type) {
    case ProjectType.APIService:
    case ProjectType.CLIApplication:
    case ProjectType.ComponentLibrary:
    case ProjectType.CoreAPI:
    case ProjectType.DesktopApplication:
    case ProjectType.GitHubApp:
    case ProjectType.GitHubAction:
    case ProjectType.FiniteStateMachine:
    case ProjectType.Function:
    case ProjectType.NodeApplication:
    case ProjectType.TaskQueue:
    case ProjectType.UniversalApplication:
    case ProjectType.WebApplication:
    case ProjectType.WebHook:
    case ProjectType.WebService:
    case ProjectType.WebSocketService:
    default:
      return {};
  }
}

export function getProjectTypeDevDependencies(type?: ProjectType) {
  switch (type) {
    case ProjectType.APIService:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.CLIApplication:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.ComponentLibrary:
      return getPlatformDevDependencies(Platform.Web);
    case ProjectType.CoreAPI:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.DesktopApplication:
      return getPlatformDevDependencies(Platform.Desktop);
    case ProjectType.GitHubApp:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.GitHubAction:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.FiniteStateMachine:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.Function:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.Library:
      return {};
    case ProjectType.NodeApplication:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.TaskQueue:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.UniversalApplication:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.WebApplication:
      return getPlatformDevDependencies(Platform.Web);
    case ProjectType.WebHook:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.WebService:
      return getPlatformDevDependencies(Platform.NodeJS);
    case ProjectType.WebSocketService:
      return getPlatformDevDependencies(Platform.NodeJS);
  }

  return {};
}

export async function getDependenciesLatestVersions(
  dependencies: {
    [key: string]: string;
  } = {},
) {
  let versions: { [key: string]: string } = {};

  console.log('latest version deps', [...Object.entries(dependencies)]);
  for (const dep of [...Object.entries(dependencies)] ?? []) {
    if (dep[0] && dep[1]) {
      const availableVersions = await JSON.parse(
        await shellExec(`npm view ${dep[0]} versions --json`),
      );

      console.log('availableVersions', availableVersions);

      const maxVersion = semverMaxSatisfying(availableVersions, dep[1]);
      console.log('maxVersion', maxVersion);

      const latest = await latestVersion(dep[0]);
      console.log('latest', latest);

      const semverRange = await latestVersion(dep[0], {
        version:
          typeof maxVersion === 'object' ? maxVersion?.version : maxVersion,
      });
      console.log('semverRange', semverRange);

      const diff = semverDiff(dep[1], semverRange);
      switch (diff) {
        case 'major':
          console.log(
            `${emoji.error} ${chalk.red(
              `${dep[0]} is outdated. (v${dep[1]} -> v${semverRange})`,
            )}`,
          );
          break;
        case 'minor':
          console.log(
            `${emoji.warning} ${chalk.yellow(
              `${dep[0]} is outdated. (v${dep[1]} -> v${semverRange})`,
            )}`,
          );
          break;
        case 'patch':
          console.log(
            `${emoji.log} ${chalk.yellow(
              `${dep[0]} is outdated. (v${dep[1]} -> v${semverRange})`,
            )}`,
          );
          break;
        default:
          console.log(
            `${emoji.log} ${chalk.green(
              `${dep[0]} is up to date. (v${dep[1]} -> v${semverRange})`,
            )}`,
          );
          break;
      }

      versions[dep[0]] = semverRange;
    }
  }

  return versions;
}

export function getPackageDependencies(package_: Package) {
  switch (package_) {
    case BrowserPackage.AmazonCognitoIdentityJS:
      return AMAZON_COGNITO_IDENTITY_JS_DEPENDENCIES;
    case BrowserPackage.History:
      return HISTORY_DEPENDENCIES;
    case BrowserPackage.JSFileDownload:
      return JS_FILE_DOWNLOAD_DEPENDENCIES;
    case BrowserPackage.React:
      return REACT_DEPENDENCIES;
    case BrowserPackage.ReactColorful:
      return REACT_COLORFUL_DEPENDENCIES;
    case BrowserPackage.ReactCountryFlag:
      return REACT_COUNTRY_FLAG_DEPENDENCIES;
    case BrowserPackage.ReactDOM:
      return REACT_DOM_DEPENDENCIES;
    case BrowserPackage.ReactDatePicker:
      return REACT_DATE_PICKER_DEPENDENCIES;
    case BrowserPackage.ReactDropzone:
      return REACT_DROPZONE_DEPENDENCIES;
    case BrowserPackage.ReactSyntaxHighlighter:
      return REACT_SYNTAX_HIGHLIGHTER_DEPENDENCIES;
    case BrowserPackage.ReactRedux:
      return REACT_REDUX_DEPENDENCIES;
    case BrowserPackage.ReactRouter:
      return REACT_ROUTER_DEPENDENCIES;
    case BrowserPackage.SrcLaunchWebEnvironment:
      return SRCLAUNCH_WEB_ENVIRONMENT_DEPENDENCIES;
    case BrowserPackage.SrcLaunchReactHooks:
      return REACT_HOOKS_DEPENDENCIES;
    case BrowserPackage.SrcLaunchThemes:
      return SRCLAUNCH_THEMES_DEPENDENCIES;
    case BrowserPackage.SrcLaunchWebApplicationState:
      return SRCLAUNCH_WEB_APPLICATION_STATE_DEPENDENCIES;
    case BrowserPackage.StyledComponents:
      return STYLED_COMPONENTS_DEPENDENCIES;

    case NodePackage.AsyncExitHook:
      return ASYNC_EXIT_HOOK_DEPENDENCIES;
    case NodePackage.AwsSDK:
      return AWS_SDK_DEPENDENCIES;
    case NodePackage.Compression:
      return COMPRESSION_DEPENDENCIES;
    case NodePackage.CORS:
      return CORS_DEPENDENCIES;
    case NodePackage.Config:
      return CONFIG_DEPENDENCIES;
    case NodePackage.Express:
      return EXPRESS_DEPENDENCIES;
    case NodePackage.SrcLaunchHttpServer:
      return SRCLAUNCH_HTTP_SERVER_DEPENDENCIES;
    case NodePackage.SrcLaunchDataClient:
      return SRCLAUNCH_DATA_CLIENT_DEPENDENCIES;
    case NodePackage.SrcLaunchNodeEnvironment:
      return SRCLAUNCH_NODE_ENVIRONMENT_DEPENDENCIES;
    case NodePackage.Keygrip:
      return KEYGRIP_DEPENDENCIES;
    case NodePackage.Multer:
      return MULTER_DEPENDENCIES;
    case NodePackage.Plaid:
      return PLAID_DEPENDENCIES;

    case UniversalPackage.Axios:
      return AXIOS_DEPENDENCIES;
    case UniversalPackage.ChangeCase:
      return CHANGE_CASE_DEPEENDENCIES;
    case UniversalPackage.ColorNamer:
      return COLOR_NAMER_DEPEENDENCIES;
    case UniversalPackage.CryptoJS:
      return CRYPTO_JS_DEPENDENCIES;
    case UniversalPackage.CurrencyCodes:
      return CURRENCY_CODES_DEPEENDENCIES;
    case UniversalPackage.EmailValidator:
      return EMAIL_VALIDATOR_DEPENDENCIES;
    case UniversalPackage.HexRGB:
      return HEX_RGB_DEPENDENCIES;
    case UniversalPackage.Luxon:
      return LUXON_DEPENDENCIES;
    case UniversalPackage.NanoID:
      return NANOID_DEPENDENCIES;
    case UniversalPackage.PasswordValidator:
      return PASSWORD_VALIDATOR_DEPENDENCIES;
    case UniversalPackage.PicoColors:
      return PICO_COLORS_DEPENDENCIES;
    case UniversalPackage.Pluralize:
      return PLURALIZE_DEPENDENCIES;
    case UniversalPackage.QueryString:
      return QUERY_STRING_DEPENDENCIES;
    case UniversalPackage.RGBHex:
      return RGB_HEX_DEPENDENCIES;
    case UniversalPackage.Redux:
      return REDUX_DEPENDENCIES;
    case UniversalPackage.ReduxToolkit:
      return REDUX_TOOLKIT_DEPENDENCIES;
    case UniversalPackage.SerializeError:
      return SERIALIZE_ERROR_DEPENDENCIES;
    case UniversalPackage.SrcLaunchExceptions:
      return SRCLAUNCH_EXCEPTIONS_DEPENDENCIES;
    case UniversalPackage.SrcLaunchHttpClient:
      return SRCLAUNCH_HTTP_CLIENT_DEPENDENCIES;
    case UniversalPackage.SrcLaunchI18n:
      return SRCLAUNCH_I18N_DEPENDENCIES;
    case UniversalPackage.SrcLaunchIcons:
      return SRCLAUNCH_ICONS_DEPENDENCIES;
    case UniversalPackage.SrcLaunchLogger:
      return SRCLAUNCH_LOGGER_DEPENDENCIES;
    case UniversalPackage.SrcLaunchTransform:
      return SRCLAUNCH_TRANSFORM_DEPENDENCIES;
    case UniversalPackage.SrcLaunchValidation:
      return SRCLAUNCH_VALIDATION_DEPENDENCIES;
    case UniversalPackage.Uuid:
      return UUID_DEPENDENCIES;
    case UniversalPackage.Zxcvbn:
      return ZXCVBN_DEPENDENCIES;
    default:
      return {};
  }
}

export function getPackageDevDependencies(package_: Package) {
  switch (package_) {
    case BrowserPackage.React:
      return REACT_DEV_DEPENDENCIES;
    case BrowserPackage.ReactRouter:
      return REACT_ROUTER_DEV_DEPENDENCIES;
    case BrowserPackage.StyledComponents:
      return STYLED_COMPONENTS_DEV_DEPENDENCIES;

    case NodePackage.AsyncExitHook:
      return ASYNC_EXIT_HOOK_DEV_DEPENDENCIES;
    case NodePackage.Express:
      return EXPRESS_DEV_DEPENDENCIES;
    case NodePackage.Keygrip:
      return KEYGRIP_DEV_DEPENDENCIES;
    case NodePackage.Multer:
      return MULTER_DEV_DEPENDENCIES;
    case NodePackage.Sequelize:
      return SEQUELIZE_DEV_DEPENDENCIES;

    case UniversalPackage.Luxon:
      return LUXON_DEV_DEPENDENCIES;
    case UniversalPackage.QueryString:
      return QUERY_STRING_DEV_DEPENDENCIES;

    default:
      return {};
  }
}

export async function getDependencies({
  dev = false,
  packages = [],
}: {
  dev?: boolean;
  packages?: Package[];
}) {
  if (!packages) {
    return {};
  }

  let dependencies: { [key: string]: string } = {};

  for (const package_ of packages) {
    console.log('package_', package_);
    dependencies = {
      ...dependencies,
      ...(dev
        ? getPackageDevDependencies(package_)
        : getPackageDependencies(package_)),
    };
  }
  console.log('dependencies', dependencies);
  const dependenciesLatestVersions = await getDependenciesLatestVersions(
    dependencies,
  );
  console.log('dependenciesLatestVersions', dependenciesLatestVersions);
  return sortDependencies(dependenciesLatestVersions);
}

export async function getDevDependencies({
  ava,
  eslint,
  github,
  jest,
  jestReact,
  prettier,

  react,
  reactRouter,
  srclaunch,
  styledComponents,
  stylelint,
  testCoverage,
  typescript,
}: {
  ava?: boolean;
  eslint?: boolean;
  github?: boolean;
  jest?: boolean;
  jestReact?: boolean;
  packages?: Package[];
  prettier?: boolean;

  react?: boolean;
  reactRouter?: boolean;
  srclaunch?: {
    cli?: boolean;
    dx?: boolean;
    types?: boolean;
  };
  styledComponents?: boolean;
  stylelint?: boolean;
  testCoverage?: boolean;
  typescript?: boolean;
}): Promise<Record<string, string>> {
  return await getDependenciesLatestVersions({
    ...(ava ? AVA_TESTING_DEV_DEPENDENCIES : {}),
    ...(eslint ? ESLINT_DEV_DEPENDENCIES : {}),
    ...(github ? GITHUB_DEV_DEPENDENCIES : {}),
    ...(jest ? JEST_TESTING_DEV_DEPENDENCIES : {}),
    ...(jestReact ? JEST_REACT_TESTING_DEV_DEPENDENCIES : {}),
    ...(prettier ? PRETTIER_DEV_DEPENDENCIES : {}),
    ...(react ? REACT_DEV_DEPENDENCIES : {}),
    ...(reactRouter ? REACT_ROUTER_DEV_DEPENDENCIES : {}),
    ...(srclaunch?.cli ? SRCLAUNCH_CLI_DEV_DEPENDENCIES : {}),
    ...(srclaunch?.dx ? SRCLAUNCH_DX_DEV_DEPENDENCIES : {}),
    ...(srclaunch?.types ? SRCLAUNCH_TYPES_DEV_DEPENDENCIES : {}),
    ...(styledComponents ? STYLED_COMPONENTS_DEV_DEPENDENCIES : {}),
    ...(stylelint ? STYLELINT_DEV_DEPEENDENCIES : {}),
    ...(testCoverage ? TEST_COVERAGE_DEV_DEPENDENCIES : {}),
    ...(typescript ? TYPESCRIPT_DEV_DEPENDENCIES : {}),
  });
}
