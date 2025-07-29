class IpAddress4 {
  readonly n: number;

  constructor(n: number) {
    this.n = isNaN(n) ? NaN : n >>> 0;
  }

  valueOf(): number {
    return this.n;
  }

  get parts(): number[] {
    return [24, 16, 8, 0].map((shift) => (this.n >>> shift) & 255);
  }

  toString(): string {
    if (isNaN(this.n)) {
      return "Invalid IP Address ";
    }
    return this.parts.join(".");
  }

  static fromString(ip: string): IpAddress4 {
    const parts = ip.split(".", 4).map((s) => {
      const n = parseInt(s, 10);
      return n >= 0 && n <= 255 && n.toString() === s ? n : NaN;
    });
    const n = parts.reduce((acc, n) => (isNaN(n) ? n : (acc << 8) + n), 0);
    return new this(parts.length === 4 ? n : NaN);
  }
}

export default IpAddress4;
