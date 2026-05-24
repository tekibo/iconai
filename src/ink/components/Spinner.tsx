import { Text, useAnimation } from 'ink';
import { SPINNER_CHARS } from '../constants';

interface Props {
  color?: string;
}

export default function Spinner({ color = 'green' }: Props) {
  const { frame } = useAnimation({ interval: 80 });
  return <Text color={color}>{SPINNER_CHARS[frame % SPINNER_CHARS.length]}</Text>;
}
