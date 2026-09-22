export interface HexDumpOptions {
  width?: number;
  startAddress?: number;
}

function printable(byte: number): string {
  return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".";
}

export function formatHexDump(bytes: Uint8Array, options: HexDumpOptions = {}): string[] {
  const width = options.width ?? 16;
  const startAddress = options.startAddress ?? 0;
  if (!Number.isInteger(width) || width < 1 || width > 64) throw new Error("width must be 1..64");
  const rows: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += width) {
    const chunk = [...bytes.slice(offset, offset + width)];
    const hex = chunk.map((byte) => byte.toString(16).padStart(2, "0")).join(" ");
    const padded = hex.padEnd(width * 3 - 1, " ");
    const text = chunk.map(printable).join("");
    rows.push(`${(startAddress + offset).toString(16).padStart(8, "0")}  ${padded}  |${text}|`);
  }
  return rows;
}
