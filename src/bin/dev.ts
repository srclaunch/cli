// import { useSelector } from "@srclaunch/web-application-state";
import fs from "fs";
import path from "path";
// import React from "react";
// import { Redirect, Route, Switch } from "react-router-dom";
// @ts-ignore
import { runDev } from "ts-node-dev";

// const ProtectedRoute: React.FC<{
//   path: string;
//   component;
// }> = ({ component, path }): React.ReactElement => {
//   const loggedIn = useSelector(state => state.authentication.logged_in);

//   return (
//     <div className="srclaunch-app">
//       <Switch>
//         {loggedIn ? (
//           <Route path={path} component={component} />
//         ) : (
//           <Redirect to="/login" />
//         )}
//       </Switch>
//     </div>
//   );
// };

// const PageRoutes = ({ pages }) => {
//   return (
//     <Switch>
//       {pages.map((page, k: number) => {
//         if (page.loginRequired)
//           return (
//             <ProtectedRoute
//               key={k}
//               path={page.path}
//               component={page.component}
//             />
//           );

//         return <Route key={k} path={page.path} component={page.component} />;
//       })}

//       {/* <Route component={PageNotFound} /> */}
//     </Switch>
//   );
// };

// const RecursiveWrapper = ({ children, pages }) => {
//   const wrappedChildren = React.Children.map(children, child => {
//     if (child.type.name === 'PageContainer') {
//       return <PageRoutes pages={pages} />;
//     }

//     if (child.props && child.props.children) {
//       return React.cloneElement(child, {
//         ...child.props,

//         // Wrap grandchildren too
//         children: child.props.children ? (
//           <RecursiveWrapper pages={pages}>
//             {child.props.children}
//           </RecursiveWrapper>
//         ) : null,
//       });
//     }

//     return child;
//   });

//   return <React.Fragment>{wrappedChildren}</React.Fragment>;
// };

type TSNodeOptions = {
  project?: string;
  // compilerOptions?: any;
  // "compiler-options"?: any;
  "prefer-ts-exts"?: boolean;
  ignore?: string;
  dir?: string;
  "script-mode"?: boolean;
  emit?: boolean;
  files?: boolean;
  "transpile-only"?: boolean;
  pretty?: boolean;
  scope?: boolean;
  "log-error"?: boolean;
  "skip-project"?: boolean;
  "skip-ignore"?: boolean;
  compiler?: string;
  "compiler-host"?: boolean;
  "ignore-diagnostics"?: string;
};

const init = ({
  script,
  scriptArgs,
  nodeArgs,
  tsNodeDevOpts,
}: {
  script: string;
  scriptArgs: string[];
  nodeArgs: string[];
  tsNodeDevOpts: TSNodeOptions;
}) => {
  try {
    const filebasename = path.basename(__filename);
    // const routes = {};

    fs.readdirSync(__dirname)
      .filter((file) => {
        return (
          file.indexOf(".") !== 0 &&
          file !== filebasename &&
          file.slice(-3) === ".ts"
        );
      })
      .forEach((file) => {
        const page = require(path.join(__dirname, file));

        console.log("page", page);
        // routes[page.name] = page;
      });

    runDev("src/index.ts", null, null, { "transpile-only": true });
    // Object.keys(db).forEach(modelName => {
    //   if (db[modelName].associate) {
    //     db[modelName].associate(db);
    //   }
    // });
  } catch (err) {
    console.log("err", err);
    //   logException(err, {
    //     level: LogLevel.Error,
    //     message: 'Failure initializing sequelize models',
    //     tags: {
    //       component: 'Database',
    //       file: 'models/index.js',
    //       func: 'export default ()',
    //       type: 'CaughtException',
    //     },
    //   });
    // }
  }
};

export default init({
  nodeArgs: [""],
  script: "src/index.ts",
  scriptArgs: [""],
  tsNodeDevOpts: {
    "transpile-only": true,
  },
});
