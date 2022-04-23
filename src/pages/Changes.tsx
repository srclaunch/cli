import { Box, Text } from 'ink';

export const Changes = () => {
  return (
    <Box flexGrow={1}>
      <Box
        borderStyle="round"
        borderColor="blue"
        flexDirection="column"
        width={30}
        padding={1}
        paddingLeft={2}
      >
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
      </Box>
    </Box>
  );
};
