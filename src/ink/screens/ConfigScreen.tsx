/* istanbul ignore file */
import { Box, Text, useInput } from 'ink';
import { maskApiKey } from '../../utils/validation';

interface Props {
  apiKey: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onQuit: () => void;
  currentKey?: string;
}

export default function ConfigScreen({ apiKey, onChange, onSubmit, onQuit, currentKey }: Props) {
  useInput((input, key) => {
    if (key.escape) { onQuit(); return; }
    if (key.return && apiKey.trim()) { onSubmit(apiKey.trim()); return; }
    if (key.backspace) { onChange(apiKey.slice(0, -1)); return; }
    if (input && !key.ctrl && !key.meta) { onChange(apiKey + input); }
  });

  const title = currentKey ? 'Change API key' : 'API key not configured.';
  const help = currentKey ? 'Enter new key (Esc to cancel):' : 'Enter your Vercel AI Gateway API key (Esc to quit):';

  return (
    <Box flexDirection="column" paddingY={1}>
      <Box marginBottom={1}>
        <Text bold>{title}</Text>
      </Box>
      {currentKey && (
        <Box marginBottom={1}>
          <Text dimColor>Current: </Text>
          <Text>{maskApiKey(currentKey)}</Text>
        </Box>
      )}
      <Box marginBottom={1}>
        <Text dimColor>{help}</Text>
      </Box>
      <Box>
        <Text color="cyan">&gt; </Text>
        <Text>{apiKey.length === 0 ? <Text dimColor>Paste or type your Vercel AI Gateway API key...</Text> : '•'.repeat(apiKey.length)}</Text>
      </Box>
      {apiKey.trim().length > 0 && (
        <Box marginTop={1}>
          <Text dimColor>Press Enter to save</Text>
        </Box>
      )}
    </Box>
  );
}
