import { Box, Text } from 'ink';
import { IconPreset, MODELS, PRESET_DEFINITIONS } from '../../types';
import Spinner from '../components/Spinner';

interface Props {
  preset: IconPreset;
  modelIdx: number;
  prompt: string;
}

export default function GeneratingScreen({ preset, modelIdx, prompt }: Props) {
  const d = PRESET_DEFINITIONS[preset];
  const m = MODELS[modelIdx];

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Preset: </Text>
        <Text color="yellow">{d.label}</Text>
        <Text dimColor>  {d.width}×{d.height}  {d.aspectRatio}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold>Model: </Text>
        <Text color="cyan">{m.name}</Text>
        <Text dimColor>  {m.provider}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold>Prompt: </Text>
        <Text wrap="wrap">{prompt}</Text>
      </Box>
      <Box marginTop={1}>
        <Spinner />
        <Text> </Text>
        <Text bold>Generating...</Text>
      </Box>
      <Box>
        <Text dimColor>This may take a moment</Text>
      </Box>
    </Box>
  );
}
