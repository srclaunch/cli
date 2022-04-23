import { Box, Newline, Static, Text, useInput } from 'ink';
import { TypedFlags } from 'meow';
import { ReactElement, useEffect, useState } from 'react';
import { Worker } from 'worker_threads';
import MultiSelect from 'ink-multi-select';

// import { getAppLabMetadata } from '../applab';
// import { startThread } from '../worker-thread';

import { FullScreen } from './FullScreen.js';
import { Scrollable } from './Scrollable.js';
import { Tab, Tabs } from './Tabs.js';
// import { Tab, Tabs } from './Tabs.js';

type AppContainerProps = {
  cliVersion?: string;
  flags?: TypedFlags<{}> & Record<string, unknown>;
};

export const AppContainer = ({
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
      <Tabs title={`🧬 SrcLaunch CLI ${cliVersion}`}>
        <Tab label="Build">
          <Box
            flexGrow={1}
            borderStyle="round"
            borderColor="gray"
            marginLeft={1}
          >
            <Scrollable items={mainOutput} />
          </Box>
        </Tab>
        <Tab label="Tests"></Tab>
        <Tab label="Changes">
          <Box
            borderStyle="round"
            borderColor="blue"
            flexDirection="column"
            width={30}
            padding={1}
            paddingLeft={2}
          >
            {/* <Box flexGrow={1}></Box> */}

            <Box>
              <Text>
                Change type
                {/* items.length: {items.length} - lineCount: {lineCount} */}
              </Text>
            </Box>

            <Box>
              <Text>New Feature</Text>
              <Text>Bugfix</Text>
              <Text>Documentation</Text>
              <Text>Formatting</Text>
              <Text>Refactor</Text>
              <Text>Performance</Text>
              <Text>Testing</Text>
              <Text>Chore</Text>
            </Box>
            {/* 
            <MultiSelect
              items={[
                {
                  label: 'First',
                  value: 'first',
                },
                {
                  label: 'Second',
                  value: 'second',
                },
                {
                  label: 'Third',
                  value: 'third',
                },
              ]}
              // onSubmit={() => {}}
            /> */}
          </Box>
        </Tab>
      </Tabs>
    </FullScreen>
  );
};
