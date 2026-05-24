import { Box, Text } from 'ink';

const LOGO = [
  '██╗ ██████╗ ██████╗ ███╗   ██╗ █████╗ ██╗',
  '██║██╔════╝██╔═══██╗████╗  ██║██╔══██╗██║',
  '██║██║     ██║   ██║██╔██╗ ██║███████║██║',
  '██║██║     ██║   ██║██║╚██╗██║██╔══██║██║',
  '██║╚██████╗╚██████╔╝██║ ╚████║██║  ██║██║',
  '╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝',
];

export default function Header() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      {LOGO.map((line, i) => (
        <Text key={i} color="cyan">{line}</Text>
      ))}
    </Box>
  );
}
