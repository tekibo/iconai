import { Box, Text } from 'ink';

interface Props {
  inputPath: string;
  editing: boolean;
  active: boolean;
}

export default function InputPath({ inputPath, editing, active }: Props) {
  const c = active ? 'cyan' : 'dim';

  if (editing) {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyan">● {'Input'.padEnd(6)}</Text>
        <Box paddingLeft={4}>
          <Text color="cyan">&gt; </Text>
          <Text>{inputPath.length === 0 ? <Text dimColor>path to image file...</Text> : <Text>{inputPath}<Text color="cyan">▌</Text></Text>}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box marginBottom={1}>
      <Text color={c}>{active ? '●' : '○'} </Text>
      <Text bold color={c}>{'Input'.padEnd(6)}</Text>
      <Text> </Text>
      <Text color={active ? 'cyan' : undefined}>{inputPath || <Text dimColor>no file selected</Text>}</Text>
    </Box>
  );
}
