import { Box, Text, useInput } from 'ink';

interface Props {
  files: string[];
  onRestart: () => void;
  onQuit: () => void;
}

export default function DoneScreen({ files, onRestart, onQuit }: Props) {
  useInput((input, key) => {
    if (key.return) onRestart();
    if (input === 'q') onQuit();
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="green" bold>✓ Success!</Text>
      </Box>
      <Box flexDirection="column">
        <Text bold>Saved to:</Text>
        {files.map((f, i) => (
          <Box key={i}>
            <Text color="cyan">  {f}</Text>
          </Box>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Enter · start over    q · quit</Text>
      </Box>
    </Box>
  );
}
