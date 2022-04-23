import { Box } from 'ink';
import { useState } from 'react';
import { Scrollable } from '../components/Scrollable';

export const Build = () => {
  const [mainOutput, setMainOutput] = useState<string[]>([]);

  const addToLogs = (str: string) => {
    setMainOutput(currentState => [...currentState, str]);
  };

  return (
    <Box flexGrow={1}>
      <Box flexGrow={1} borderStyle="round" borderColor="gray" marginLeft={1}>
        <Scrollable items={mainOutput} />
      </Box>
    </Box>
  );
};
