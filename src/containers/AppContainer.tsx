import { Box, Newline, Spacer, Static, Text, useInput } from 'ink';
import { TypedFlags } from 'meow';
import { ReactElement, useEffect, useState } from 'react';
import { Worker } from 'worker_threads';
import MultiSelect from 'ink-multi-select';

// import { getAppLabMetadata } from '../applab';
// import { startThread } from '../worker-thread';

import { FullScreen } from '../components/FullScreen.js';
import { Scrollable } from '../components/Scrollable.js';
import { Tab, Tabs } from '../components/Tabs.js';
import { Changes } from '../pages/Changes.js';
import { Tests } from '../pages/Tests.js';
import { Release } from '../pages/Release.js';
import { Build } from '../pages/Build.js';
import { Overview } from '../pages/Overview.js';
// import { Tab, Tabs } from './Tabs.js';

type AppContainerProps = {
  initialTab?: string;
  cliVersion?: string;
  flags?: TypedFlags<{}> & Record<string, unknown>;
};

export const AppContainer = ({
  initialTab,
  cliVersion,
}: AppContainerProps): ReactElement => {
  const [mainOutput, setMainOutput] = useState<string[]>([]);
  const [serviceStatus, setServiceStatus] = useState<undefined | string>(
    undefined,
  );

  const addToLogs = (str: string) => {
    setMainOutput(currentState => [...currentState, str]);
  };

  useInput(async (input, key) => {
    if (input === 'q') {
      addToLogs('Quitting');

      throw new Error('Quitting');
      // Exit program
    }

    // if (input === "r") {
    //   console.info("Restarting");
    //   await restart();
    //   process.exit(0);
    //   // Exit program
    // }

    if (key.leftArrow) {
      // Left arrow key pressed
    }
  });

  // useEffect(() => {
  //   setMainScrollCursor(m => (m += 1));
  // }, [mainOutput.length]);

  useEffect(() => {
    const handleFlags = async () => {
      addToLogs(``);
      // addToLogs('Initializing services...');
      //
      // const { name, type } = await getAppLabMetadata();
      //
      // setServiceStatus('starting');
      // addToLogs(`Starting service ${name}...`);
      //
      // const thread: Worker = await startThread({
      //   name,
      //   type,
      // });
      //
      // thread.on('online', () => {
      //   addToLogs(`${name} worker online`);
      // });
      //
      // thread.on('message', (message: string) => {
      //   addToLogs(message);
      // });
      //
      // thread.on('error', async (err: Error) => {
      //   addToLogs(`ERROR: ${err.name}: ${err.message}`);
      //
      //   setServiceStatus('error');
      // });
      //
      // thread.on('exit', async () => {
      //   setServiceStatus('error');
      // });
      //
      // setServiceStatus('started');
      // addToLogs(`Service ${name} started`);

      if (serviceStatus) {
        addToLogs(serviceStatus);
      }
    };

    handleFlags();
  }, []);

  return (
    <FullScreen
      borderStyle="round"
      borderColor="lightgrey"
      flexDirection="column"
    >
      <Tabs>
        <Tab initial={initialTab === 'Overview'} label="Overview">
          <Overview />
        </Tab>
        <Tab initial={initialTab === 'Build'} label="Build">
          <Build />
        </Tab>
        <Tab initial={initialTab === 'Tests'} label="Tests">
          <Tests />
        </Tab>
        <Tab initial={initialTab === 'Changes'} label="Changes">
          <Changes />
        </Tab>
        <Tab initial={initialTab === 'Release'} label="Release">
          <Release />
        </Tab>
      </Tabs>
      <Box flexDirection="row">
        <Spacer />
        <Box alignItems="flex-end" paddingRight={1}>
          <Text>{cliVersion}</Text>
        </Box>
      </Box>
    </FullScreen>
  );
};
