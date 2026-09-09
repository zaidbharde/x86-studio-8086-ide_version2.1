export interface ByteReader {
  readonly offset: number;
  readonly remaining: number;
  readUint8(): number;
  readUint16LE(): number;
  readBytes(length: number): Uint8Array;
}

export function createByteReader(bytes: Uint8Array, start = 0): ByteReader {
  let offset = Math.max(0, Math.min(start, bytes.length));
  const requireBytes = (length: number): void => {
    if (!Number.isInteger(length) || length < 0) throw new Error('length must be non-negative');
    if (offset + length > bytes.length) throw new RangeError('read exceeds available memory');
  };
  return {
    get offset() { return offset; },
    get remaining() { return bytes.length - offset; },
    readUint8() { requireBytes(1); return bytes[offset++]; },
    readUint16LE() {
      requireBytes(2);
      const value = bytes[offset] | (bytes[offset + 1] << 8);
      offset += 2;
      return value;
    },
    readBytes(length) {
      requireBytes(length);
      const value = bytes.slice(offset, offset + length);
      offset += length;
      return value;
    },
  };
}
