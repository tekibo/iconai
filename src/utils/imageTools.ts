export function icoSizes(preset: 'web-icon' | 'desktop-icon'): number[] {
  return preset === 'web-icon'
    ? [16, 32, 48, 256]
    : [16, 32, 48, 256, 512];
}

export function extFromFormat(format: string): string {
  if (format === 'jpeg') return 'jpg';
  return format;
}
