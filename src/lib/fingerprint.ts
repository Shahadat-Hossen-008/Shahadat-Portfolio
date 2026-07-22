import crypto from 'crypto'
import { Jimp } from 'jimp'

/**
 * Generates a content-based fingerprint for ANY file type (images, PDFs,
 * DOCX, audio, etc.) by hashing the raw file bytes exactly as they are.
 *
 * A hash function takes any input and produces a fixed-length string that
 * acts like a fingerprint: same input → always the same output, and even
 * a tiny change to the input produces a completely different output.
 *
 * IMPORTANT: this hashes the file's raw bytes — its compressed/encoded
 * format. That means the SAME picture saved as .jpg vs .png will produce
 * DIFFERENT hashes here, because the byte-level encoding is different even
 * though the picture looks identical. Use `fingerprintPerceptual` below if
 * you want format-independent, image content-based matching.
 *
 * @param buffer - Raw byte data of the file
 * @returns SHA-256 hex string. SHA-256 is a well-tested algorithm with an
 *   extremely low chance of two different files accidentally producing the
 *   same hash (called a "collision").
 */
export function fingerprint(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

/**
 * Generates a fingerprint for IMAGES based on their actual decoded pixel
 * colors, not their compressed file bytes.
 *
 * Why this is different from `fingerprint()` above:
 * An image file's raw bytes are a COMPRESSED ENCODING (JPEG, PNG, etc.) —
 * not literally a list of colors. Two files with completely different
 * bytes (say, a .jpg and a .png export of the same photo) can decode into
 * the exact same picture. Hashing raw bytes would treat those as two
 * different files. Hashing the DECODED PIXELS instead means: same visual
 * content → same hash, regardless of file format or compression used.
 *
 * How it works:
 *  1. Decode the compressed file into a grid of pixels (Jimp.read)
 *  2. Read out each pixel's color values (bitmap.data) — this is a flat
 *     list of [Red, Green, Blue, Alpha, Red, Green, Blue, Alpha, ...]
 *     numbers, one group of 4 per pixel
 *  3. Hash THAT color data, instead of the original compressed bytes
 *
 * Limitation: this only matches images that decode to IDENTICAL pixels.
 * Resizing, cropping, or recompressing the same photo will still change
 * the pixel data and produce a different hash — it's not a fuzzy/similarity
 * match, just "format-independent exact match."
 *
 * @param buffer - Image file's raw bytes (still compressed/encoded)
 * @param mimeType - Must start with "image/" — throws otherwise
 * @returns SHA-256 hex string, based on decoded pixel colors
 */
export async function fingerprintPerceptual(buffer: Buffer, mimeType: string): Promise<string> {
  if (!mimeType.startsWith('image/')) {
    throw new Error('Perceptual fingerprint can only be generated for image files')
  }

  const image = await Jimp.read(buffer)

  const pixelColorData = image.bitmap.data

  return crypto.createHash('sha256').update(pixelColorData).digest('hex')
}
