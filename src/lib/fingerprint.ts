import crypto from 'crypto'

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
