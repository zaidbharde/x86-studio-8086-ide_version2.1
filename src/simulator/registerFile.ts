export type Register16 = "AX" | "BX" | "CX" | "DX" | "SP" | "BP" | "SI" | "DI";
export type Register8 = "AH" | "AL" | "BH" | "BL" | "CH" | "CL" | "DH" | "DL";

const HIGH_ALIAS: Record<Register8, Register16> = { AH: "AX", BH: "BX", CH: "CX", DH: "DX", AL: "AX", BL: "BX", CL: "CX", DL: "DX" };
const IS_HIGH: Set<Register8> = new Set(["AH", "BH", "CH", "DH"]);

export class RegisterFile {
  private readonly values: Record<Register16, number> = {
    AX: 0, BX: 0, CX: 0, DX: 0, SP: 0, BP: 0, SI: 0, DI: 0,
  };

  read16(name: Register16): number { return this.values[name]; }

  write16(name: Register16, value: number): void {
    this.values[name] = value & 0xffff;
  }

  read8(name: Register8): number {
    const word = this.values[HIGH_ALIAS[name]];
    return IS_HIGH.has(name) ? (word >>> 8) & 0xff : word & 0xff;
  }

  write8(name: Register8, value: number): void {
    const register = HIGH_ALIAS[name];
    const current = this.values[register];
    const byte = value & 0xff;
    this.values[register] = IS_HIGH.has(name)
      ? ((byte << 8) | (current & 0x00ff))
      : ((current & 0xff00) | byte);
  }

  snapshot(): Readonly<Record<Register16, number>> { return { ...this.values }; }
  reset(): void { for (const name of Object.keys(this.values) as Register16[]) this.values[name] = 0; }
}
