# `fingerprintPerceptual`

```typescript
export async function fingerprintPerceptual(
  buffer: Buffer,
  mimeType: string
): Promise<string>
```

## Description

Generates a fingerprint for **IMAGES** based on their actual decoded pixel colors, not their compressed file bytes.

## Why This Is Different from `fingerprint()`

An image file's raw bytes are a **COMPRESSED ENCODING** (JPEG, PNG, etc.) — not literally a list of colors. Two files with completely different bytes (say, a `.jpg` and a `.png` export of the same photo) can decode into the exact same picture. Hashing raw bytes would treat those as two different files. Hashing the **DECODED PIXELS** instead means: same visual content → same hash, regardless of file format or compression used.

## How It Works

1. Decode the compressed file into a grid of pixels (`Jimp.read`)
2. Read out each pixel's color values (`bitmap.data`) — this is a flat list of `[Red, Green, Blue, Alpha, Red, Green, Blue, Alpha, ...]` numbers, one group of 4 per pixel
3. Hash **THAT** color data, instead of the original compressed bytes

## Limitation

This only matches images that decode to **IDENTICAL** pixels. Resizing, cropping, or recompressing the same photo will still change the pixel data and produce a different hash — it's not a fuzzy/similarity match, just "format-independent exact match."

## Parameters

| Name       | Type     | Description                                         |
|------------|----------|-----------------------------------------------------|
| `buffer`   | `Buffer` | Image file's raw bytes (still compressed/encoded)     |
| `mimeType` | `string` | Must start with `"image/"` — throws otherwise         |

## Returns

`Promise<string>` — SHA-256 hex string, based on decoded pixel colors

## Throws

`Error` — if `mimeType` does not start with `"image/"`

## Example

```typescript
import { fingerprintPerceptual } from './fingerprint'

const buffer = fs.readFileSync('./photo.png')
const hash = await fingerprintPerceptual(buffer, 'image/png')
// Same photo saved as JPEG would produce the same hash
```
