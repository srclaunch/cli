import { BoxProps } from 'ink';
import { PropsWithChildren, ReactElement } from 'react';
declare type TabsProps = PropsWithChildren<BoxProps & {
    title?: string;
}>;
export declare const Tabs: ({ children, title, ...props }: TabsProps) => ReactElement;
declare type TabProps = PropsWithChildren<{
    initial?: boolean;
    label: string;
    status?: string;
}>;
export declare const Tab: ({ children }: TabProps) => ReactElement;
export {};
//# sourceMappingURL=Tabs.d.ts.map