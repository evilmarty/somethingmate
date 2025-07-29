import IpAddress4 from "./IpAddress4";

class Cidr4 {
  readonly ip: IpAddress4;
  readonly prefix: number;

  constructor(ip: IpAddress4, prefix: number) {
    this.ip = ip;
    this.prefix = prefix >= 0 && prefix <= 32 ? prefix : NaN;
  }

  get mask(): number {
    return (0xffffffff << (32 - this.prefix)) >>> 0;
  }

  get subnetMask(): IpAddress4 {
    return new IpAddress4(this.mask);
  }

  get wildcard(): number {
    return ~this.mask >>> 0;
  }

  get wildcardMask(): IpAddress4 {
    return new IpAddress4(this.wildcard);
  }

  get network(): number {
    return (this.ip.valueOf() & this.mask) >>> 0;
  }

  get networkAddress(): IpAddress4 {
    return new IpAddress4(this.network);
  }

  get broadcast(): number {
    return (this.network | this.wildcard) >>> 0;
  }

  get broadcastAddress(): IpAddress4 {
    return new IpAddress4(this.broadcast);
  }

  firstHost(): IpAddress4 {
    return new IpAddress4(this.network + 1);
  }

  lastHost(): IpAddress4 {
    return new IpAddress4(this.broadcast - 1);
  }

  totalHosts(): number {
    return Math.max(0, Math.pow(2, 32 - this.prefix) - 2);
  }

  valueOf(): number {
    if (isNaN(this.ip.valueOf()) || isNaN(this.prefix)) {
      return NaN;
    }
    return this.network;
  }

  toString(): string {
    if (isNaN(this.ip.valueOf()) || isNaN(this.prefix)) {
      return "Invalid CIDR Notation";
    }
    return `${this.ip}/${this.prefix}`;
  }

  static fromString(cidr: string): Cidr4 {
    const [ipStr, maskStr] = (cidr || "").trim().split("/");
    const ip = IpAddress4.fromString(ipStr);
    const mask = parseInt(maskStr, 10);
    return new this(ip, mask);
  }

  static fromSubnetMask(ip: IpAddress4): number {
    return 32 - Math.trunc(Math.log2((~ip.valueOf() >>> 0) + 1));
  }
}

export default Cidr4;
