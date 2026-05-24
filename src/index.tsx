#!/usr/bin/env node

process.removeAllListeners("warning");
process.on("warning", (warning) => {
  if (
    warning.name === "DeprecationWarning" &&
    warning.message.includes("punycode")
  ) {
    return;
  }
  console.warn(warning.stack);
});

import { render } from 'ink';
import App from './ink/App';

if (!process.stdin.isTTY) {
  console.log('iconai is an interactive CLI — run it directly without piping.');
  process.exit(0);
}

const { waitUntilExit } = render(<App />, { exitOnCtrlC: true });
await waitUntilExit();
