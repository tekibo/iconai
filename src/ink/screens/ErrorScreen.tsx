/* istanbul ignore file */
import { Box, Text, useInput } from 'ink';

interface Props {
  error: string;
  onRestart: () => void;
  onQuit: () => void;
}

export default function ErrorScreen({ error, onRestart, onQuit }: Props) {
  useInput((input, key) => {
    if (key.return) onRestart();
    if (input === 'q') onQuit();
  });

  return (
    <Box flexDirection="column">
      <Box borderStyle="round" borderColor="red" paddingX={2} paddingY={1}>
        <Box marginBottom={1}>
          <Text color="red" bold>✗ Error</Text>
        </Box>
        <Text color="red" wrap="wrap">{error}</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Enter · try again    q · quit</Text>
      </Box>
    </Box>
  );
}
