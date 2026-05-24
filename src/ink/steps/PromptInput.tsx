import { Box, Text, useInput } from 'ink';

interface Props {
  prompt: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function PromptInput({ prompt, onChange, onConfirm, onBack }: Props) {
  useInput((input, key) => {
    if (key.escape) { onBack(); return; }
    if (key.return && prompt.trim()) { onConfirm(); return; }
    if (key.backspace) { onChange(prompt.slice(0, -1)); return; }
    if (input && !key.ctrl && !key.meta) { onChange(prompt + input); }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Describe the icon you want (Esc back):</Text>
      </Box>
      <Box>
        <Text color="cyan">&gt; </Text>
        <Text wrap="wrap">
          {prompt.length === 0 ? <Text dimColor>e.g. minimalist calculator app icon</Text> : prompt}
        </Text>
      </Box>
      {prompt.trim().length > 0 && (
        <Box marginTop={1}>
          <Text dimColor>Press Enter to continue</Text>
        </Box>
      )}
    </Box>
  );
}
