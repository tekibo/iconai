export function validatePrompt(prompt: string): string | null {
  if (!prompt || prompt.trim().length === 0) return 'Prompt cannot be empty';
  if (prompt.length > 1000) return 'Prompt too long (max 1000 characters)';
  return null;
}

export function validateApiKey(apiKey: string): string | null {
  if (!apiKey || apiKey.trim().length === 0) return 'API key cannot be empty';
  return null;
}

export function validateOutputPath(outputPath: string): string | null {
  if (!outputPath || outputPath.trim().length === 0) return 'Output path cannot be empty';
  return null;
}

export function maskApiKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '•'.repeat(key.length);
  return key.slice(0, 4) + '…' + key.slice(-4);
}
