import { OutputFormat } from '../types';

export async function convertFormat(
  buffer: Buffer,
  format: OutputFormat,
  quality?: number,
): Promise<Buffer> {
  if (format === 'ico') {
    return toIco(buffer, [16, 32, 48, 256]);
  }

  const sharp = (await import('sharp')).default;
  const opts: { quality?: number } = {};
  if ((format === 'jpeg' || format === 'webp') && quality) {
    opts.quality = quality;
  }

  return sharp(buffer).toFormat(format, opts).toBuffer();
}

export async function toIco(buffer: Buffer, sizes: number[]): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  const pngToIco = (await import('png-to-ico')).default;
  const resized = await Promise.all(
    sizes.map((s) => sharp(buffer).resize(s, s).png().toBuffer()),
  );
  return pngToIco(resized);
}
