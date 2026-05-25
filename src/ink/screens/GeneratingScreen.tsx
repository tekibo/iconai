import { Box, Text } from 'ink';
import { FORMAT_LABELS, IconPreset, MODELS, OutputFormat, PRESET_DEFINITIONS } from '../../types';
import Spinner from '../components/Spinner';

interface Props {
  preset: IconPreset;
  modelIdx: number;
  prompt: string;
  outputFormat: OutputFormat;
}

export default function GeneratingScreen({ preset, modelIdx, prompt, outputFormat }: Props) {
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
        <Text bold>Format: </Text>
        <Text color="green">{FORMAT_LABELS[outputFormat]}</Text>
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
        {outputFormat === 'ico' && <Text dimColor>Converting to .ico...</Text>}
        {outputFormat !== 'ico' && <Text dimColor>This may take a moment</Text>}
      </Box>
    </Box>
  );
}
