export function cidrToIpPrefix(cidr: string): [string, number] {
  if (!isValidCidr(cidr)) {
    return ["", 0];
  }
  const [ip, prefix] = cidr.split("/");
  const prefixNum = parseInt(prefix, 10);
  return [ip, prefixNum];
}

export function ipPrefixToCidr(ip: string, prefix: number): string {
  if (isValidIp(ip) && isValidPrefix(prefix)) {
    return `${ip}/${prefix}`;
  }
  return "";
}

export function ipToInt(ip: string): number {
  return ip.split(".").reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0);
}

export function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join(".");
}

function prefixToMaskInt(prefix: number): number {
  return (0xffffffff << (32 - prefix)) >>> 0;
}

export function prefixToMask(prefix: number): string {
  return intToIp(prefixToMaskInt(prefix));
}

export function maskToPrefix(mask: string): number {
  const parts = mask.split(".").map(Number);
  const maskInt =
    (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  return 32 - Math.trunc(Math.log2((~maskInt >>> 0) + 1));
}

export function getNetworkDetails(
  ip: string,
  prefix: number,
): {
  networkAddress: string;
  broadcastAddress: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
} {
  const ipInt = ipToInt(ip);
  const maskInt = prefixToMaskInt(prefix);
  const wildcardInt = ~prefixToMaskInt(prefix) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const hosts = Math.max(0, Math.pow(2, 32 - prefix) - 2);

  return {
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    wildcardMask: intToIp(wildcardInt),
    firstHost: intToIp(networkInt + 1),
    lastHost: intToIp(broadcastInt - 1),
    totalHosts: hosts,
  };
}

export function isValidIp(ip: string): boolean {
  const parts = ip.split(".");
  return (
    parts.length === 4 &&
    parts.every((part) => {
      const num = parseInt(part);
      return num >= 0 && num <= 255 && part === num.toString();
    })
  );
}

export function isValidCidr(cidr: string | null): boolean {
  if (typeof cidr !== "string") {
    return false;
  }
  const [ip, prefix] = cidr.split("/");
  return isValidIp(ip) && isValidPrefix(prefix);
}

export function isValidPrefix(prefix: number | string): boolean {
  const prefixNum = typeof prefix === "string" ? parseInt(prefix) : prefix;
  return typeof prefixNum === "number" && prefixNum >= 0 && prefixNum <= 32;
}
