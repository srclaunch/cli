import { Box, Text, useFocus, useFocusManager } from 'ink';
import React, { PropsWithChildren, ReactElement, useEffect, useState } from 'react';

import Button from './Button.js';

type TabsProps = PropsWithChildren<{ title: string }>;

export const Tabs = ({ children, title }: TabsProps): ReactElement => {
  const { enableFocus, focusNext } = useFocusManager();
  const [activeTab, setActiveTab] = useState(0);
  const { isFocused } = useFocus({
    autoFocus: true,
  });

  useEffect(() => {
    enableFocus();
  }, [enableFocus]);

  useEffect(() => {
    if (isFocused) {
      focusNext();
    }
  }, [isFocused, focusNext]);

  // useEffect(() => {
  //   console.log;
  // }, [activeTab]);

  return (
    <Box flexGrow={1} flexDirection={'column'}>
      {/* Tab navigation */}
      <Box flexDirection={'row'} height={1}>
        <Box paddingLeft={1} flexGrow={1}>
          {/* @ts-ignore */}
          {React.Children.map(children, (child: typeof Tab, i) => {
            return (
              <Box marginRight={2}>
                <Button
                  onFocus={() => setActiveTab(i)}
                  // @ts-ignore
                  label={child?.props?.label}
                  // @ts-ignore
                  status={child?.props?.status}
                />
              </Box>
            );
          })}
        </Box>

        {title && (
          <Box alignItems={'flex-end'} paddingRight={1}>
            <Text>{title}</Text>
          </Box>
        )}
      </Box>

      {/* Tab content */}
      <Box
        flexGrow={1}
        flexDirection={'column'}
        borderStyle="round"
        borderColor="gray"
        width="100%"
      >
        {/* @ts-ignore */}
        {React.Children.map(children, (child1: typeof Tab, i) => {
          return (
            <Box
              display={activeTab === i ? 'flex' : 'none'}
              flexDirection={'column'}
            >
              {React.Children.map(child1, child2 => {
                return <>{child2}</>;
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

type TabProps = PropsWithChildren<{
  label: string;
  status?: string;
}>;

export const Tab = ({ children }: TabProps): ReactElement => {
  return <>{children}</>;
};
