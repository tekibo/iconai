export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function icoSizes(preset: 'web-icon' | 'desktop-icon'): number[] {
  return preset === 'web-icon'
    ? [16, 32, 48, 256]
    : [16, 32, 48, 256, 512];
}

export function extFromFormat(format: string): string {
  if (format === 'jpeg') return 'jpg';
  return format;
}
