export function imageInfo(
  bytes: Uint8Array,
): { type: string; width: number; height: number } | null {
  const b = bytes,
    view = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (b.length < 24) return null;
  const result = (type: string, width: number, height: number) =>
    width > 0 &&
    height > 0 &&
    width <= 12000 &&
    height <= 12000 &&
    width * height <= 24_000_000
      ? { type, width, height }
      : null;
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => b[i] === v))
    return result('image/png', view.getUint32(16), view.getUint32(20));
  const ascii = (start: number, end: number) =>
    new TextDecoder().decode(b.slice(start, end));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    const format = ascii(12, 16);
    if (format === 'VP8X' && b.length >= 30) {
      if (b[20] & 2) return null;
      return result(
        'image/webp',
        1 + b[24] + (b[25] << 8) + (b[26] << 16),
        1 + b[27] + (b[28] << 8) + (b[29] << 16),
      );
    }
    if (format === 'VP8L' && b.length >= 25 && b[20] === 0x2f)
      return result(
        'image/webp',
        1 + b[21] + ((b[22] & 63) << 8),
        1 + (b[22] >> 6) + (b[23] << 2) + ((b[24] & 15) << 10),
      );
    if (
      format === 'VP8 ' &&
      b.length >= 30 &&
      b[23] === 157 &&
      b[24] === 1 &&
      b[25] === 42
    )
      return result(
        'image/webp',
        view.getUint16(26, true) & 16383,
        view.getUint16(28, true) & 16383,
      );
    return null;
  }
  if (b[0] === 255 && b[1] === 216) {
    let offset = 2;
    while (offset + 4 < b.length) {
      if (b[offset] !== 255) return null;
      const marker = b[offset + 1];
      if (marker === 218 || marker === 217) return null;
      const length = view.getUint16(offset + 2);
      if (length < 2 || offset + 2 + length > b.length) return null;
      if (
        [
          192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207,
        ].includes(marker) &&
        length >= 7
      )
        return result(
          'image/jpeg',
          view.getUint16(offset + 7),
          view.getUint16(offset + 5),
        );
      offset += 2 + length;
    }
  }
  return null;
}
