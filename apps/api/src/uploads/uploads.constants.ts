import { join } from 'node:path';

/** Pasta onde as fotos enviadas pelo painel ficam guardadas */
export const UPLOADS_DIR = join(process.cwd(), 'uploads');

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
