import { Box, Text } from 'ink';
import { PRESET_DEFINITIONS, MODELS, IconPreset } from '../../types';

interface Props {
  preset: IconPreset;
  modelIdx: number;
  prompt: string;
  count: number;
  onGenerate: () => void;
  onBack: () => void;
}

export default function ConfirmView({ preset, modelIdx, prompt, count }: Props) {
  const d = PRESET_DEFINITIONS[preset];
  const m = MODELS[modelIdx];

  return (
    <Box flexDirection="column">
      <Box flexDirection="column" paddingLeft={2} marginTop={1}>
        <Box>
          <Text bold>Preset: </Text>
          <Text color="yellow">{d.label}</Text>
          <Text dimColor> ({d.width}x{d.height})</Text>
        </Box>
        <Box marginTop={1}>
          <Text bold>Model: </Text>
          <Text color="cyan">{m.name}</Text>
          <Text dimColor> — {m.id}</Text>
        </Box>
        <Box marginTop={1}>
          <Text bold>Prompt: </Text>
          <Text wrap="wrap">{prompt}</Text>
        </Box>
        <Box marginTop={1}>
          <Text bold>Images: </Text>
          <Text>{count}</Text>
        </Box>
        <Box marginTop={1}>
          <Text bold>Output: </Text>
          <Text>./assets/</Text>
        </Box>
      </Box>
      <Box marginTop={2}>
        <Text dimColor>Enter to generate</Text>
      </Box>
    </Box>
  );
}
