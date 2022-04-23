import { TypedFlags } from 'meow';
import { ReactElement } from 'react';
declare type AppContainerProps = {
    initialTab?: string;
    cliVersion?: string;
    flags?: TypedFlags<{}> & Record<string, unknown>;
};
export declare const AppContainer: ({ initialTab, cliVersion, }: AppContainerProps) => ReactElement;
export {};
//# sourceMappingURL=AppContainer.d.ts.map