import latestVersion from 'latest-version';
import {
  BrowserPackage,
  NodePackage,
  Package,
  Project,
  UniversalPackage,
} from '@srclaunch/types';
import {
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
  SRCLAUNCH_DATA_CLIENT_DEPENDENCIES,
  EMAIL_VALIDATOR_DEPENDENCIES,
  EXPRESS_DEPENDENCIES,
  HEX_RGB_DEPENDENCIES,
  SRCLAUNCH_HTTP_SERVER_DEPENDENCIES,
  JS_FILE_DOWNLOAD_DEPENDENCIES,
  KEYGRIP_DEPENDENCIES,
  LUXON_DEPENDENCIES,
  MULTER_DEPENDENCIES,
  NANOID_DEPENDENCIES,
  SRCLAUNCH_NODE_ENVIRONMENT_DEPENDENCIES,
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
} from '../../constants/dependencies';
import {
  ASYNC_EXIT_HOOK_DEV_DEPENDENCIES,
  AVA_TESTING_DEV_DEPENDENCIES,
  COMMON_DEV_DEPENDENCIES,
  ESLINT_DEV_DEPENDENCIES,
  EXPRESS_DEV_DEPENDENCIES,
  GITHUB_DEV_DEPENDENCIES,
  JEST_REACT_TESTING_DEV_DEPENDENCIES,
  JEST_TESTING_DEV_DEPENDENCIES,
  PRETTIER_DEV_DEPENDENCIES,
  REACT_DEV_DEPENDENCIES,
  REACT_ROUTER_DEV_DEPENDENCIES,
  RELEASE_DEV_DEPENDENCIES,
  SRCLAUNCH_DEV_DEPENDENCIES,
  STYLED_COMPONENTS_DEV_DEPENDENCIES,
  STYLELINT_DEV_DEPEENDENCIES,
  TEST_COVERAGE_DEV_DEPENDENCIES,
  TYPESCRIPT_DEV_DEPENDENCIES,
} from '../../constants/dev-dependencies';

export async function getDependenciesLatestVersions(packages: {
  [key: string]: string;
}) {
  const versions: { [key: string]: string } = {};

  for (const package_ of Object.entries(packages).map(([key, value]) => ({
    [key]: value,
  }))) {
    if (package_[0]) {
      const version = await latestVersion(package_[0]);
      versions[package_[0]] = version;
    }
  }
  return versions;
}

export function getPackageDependencies(package_: Package) {
  switch (package_) {
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
      return;
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
    case NodePackage.AwsSDK:
      return AWS_SDK_DEPENDENCIES;
    case NodePackage.Compression:
      return COMPRESSION_DEPENDENCIES;
    case NodePackage.CORS:
      return CORS_DEPENDENCIES;
    case NodePackage.Config:
      return CONFIG_DEPENDENCIES;
    case NodePackage.Keygrip:
      return KEYGRIP_DEPENDENCIES;
    case NodePackage.Multer:
      return MULTER_DEPENDENCIES;
    case NodePackage.Plaid:
      return PLAID_DEPENDENCIES;
    case NodePackage.SrcLaunchDataClient:
      return SRCLAUNCH_DATA_CLIENT_DEPENDENCIES;
    case NodePackage.SrcLaunchNodeEnvironment:
      return SRCLAUNCH_NODE_ENVIRONMENT_DEPENDENCIES;
    case NodePackage.SrcLaunchHttpServer:
      return SRCLAUNCH_HTTP_SERVER_DEPENDENCIES;
    default:
      return;
  }
}

export async function getDependencies(packages?: Package[]) {
  if (!packages) {
    return undefined;
  }

  let dependencies: { [key: string]: string } = {};

  for (const package_ of packages) {
    dependencies = {
      ...dependencies,
      ...getPackageDependencies(package_),
    };
  }

  return await getDependenciesLatestVersions(dependencies);
}

export async function getDevDependencies({
  ava,
  eslint = true,
  github,
  jest,
  jestReact,
  prettier = true,
  react,
  reactRouter,
  release = true,
  srclaunch = true,
  styledComponents,
  stylelint = true,
  testCoverage,
  typescript = true,
}: {
  ava?: boolean;
  eslint?: boolean;
  github?: boolean;
  jest?: boolean;
  jestReact?: boolean;
  prettier?: boolean;
  react?: boolean;
  reactRouter?: boolean;
  release?: boolean;
  srclaunch?: boolean;
  styledComponents?: boolean;
  stylelint?: boolean;
  testCoverage?: boolean;
  typescript?: boolean;
}): Promise<Record<string, string>> {
  let dependencies = {
    ...COMMON_DEV_DEPENDENCIES,
  };

  if (ava) {
    dependencies = {
      ...dependencies,
      ...AVA_TESTING_DEV_DEPENDENCIES,
    };
  }

  if (eslint) {
    dependencies = {
      ...dependencies,
      ...ESLINT_DEV_DEPENDENCIES,
    };
  }

  if (github) {
    dependencies = {
      ...dependencies,
      ...GITHUB_DEV_DEPENDENCIES,
    };
  }

  if (jest) {
    dependencies = {
      ...dependencies,
      ...JEST_TESTING_DEV_DEPENDENCIES,
    };
  }

  if (jestReact) {
    dependencies = {
      ...dependencies,
      ...JEST_REACT_TESTING_DEV_DEPENDENCIES,
    };
  }

  if (prettier) {
    dependencies = {
      ...dependencies,
      ...PRETTIER_DEV_DEPENDENCIES,
    };
  }

  if (react) {
    dependencies = {
      ...dependencies,
      ...REACT_DEV_DEPENDENCIES,
    };
  }

  if (reactRouter) {
    dependencies = {
      ...dependencies,
      ...REACT_ROUTER_DEV_DEPENDENCIES,
    };
  }

  if (release) {
    dependencies = {
      ...dependencies,
      ...RELEASE_DEV_DEPENDENCIES,
    };
  }

  if (srclaunch) {
    dependencies = {
      ...dependencies,
      ...SRCLAUNCH_DEV_DEPENDENCIES,
    };
  }

  if (styledComponents) {
    dependencies = {
      ...dependencies,
      ...STYLED_COMPONENTS_DEV_DEPENDENCIES,
    };
  }

  if (stylelint) {
    dependencies = {
      ...dependencies,
      ...STYLELINT_DEV_DEPEENDENCIES,
    };
  }

  if (testCoverage) {
    dependencies = {
      ...dependencies,
      ...TEST_COVERAGE_DEV_DEPENDENCIES,
    };
  }

  if (typescript) {
    dependencies = {
      ...dependencies,
      ...TYPESCRIPT_DEV_DEPENDENCIES,
    };
  }

  return await getDependenciesLatestVersions(dependencies);
}
