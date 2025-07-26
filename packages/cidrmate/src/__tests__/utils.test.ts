import { describe, it, expect } from "vitest";
import {
  cidrToIpPrefix,
  ipPrefixToCidr,
  ipToInt,
  intToIp,
  prefixToMask,
  maskToPrefix,
  getNetworkDetails,
  isValidIp,
  isValidCidr,
  isValidPrefix,
} from "../utils";

describe("cidrToIpPrefix", () => {
  it("should convert CIDR to IP and prefix", () => {
    expect(cidrToIpPrefix("192.168.1.1/24")).toEqual(["192.168.1.1", 24]);
  });
  it("should return null when CIDR is invalid", () => {
    expect(cidrToIpPrefix("999.999.9.9/99")).toEqual(null);
  });
});

describe("ipPrefixToCidr", () => {
  it("should convert IP and prefix to CIDR", () => {
    expect(ipPrefixToCidr("192.168.1.1", 24)).toBe("192.168.1.1/24");
  });
  it("should return empty string for invalid IP", () => {
    expect(ipPrefixToCidr("999.999.999.999", 24)).toBe("");
  });
  it("should return empty string for invalid prefix", () => {
    expect(ipPrefixToCidr("192.168.1.1", 99)).toBe("");
  });
});

describe("ipToInt", () => {
  it("should convert IP to integer", () => {
    expect(ipToInt("192.168.1.1")).toBe(-1062731519);
  });
});

describe("intToIp", () => {
  it("should convert integer to IP", () => {
    expect(intToIp(3232235777)).toBe("192.168.1.1");
  });
});

describe("prefixToMask", () => {
  it("should convert prefix to mask", () => {
    expect(prefixToMask(24)).toBe("255.255.255.0");
  });
});

describe("maskToPrefix", () => {
  it("should convert mask to prefix", () => {
    expect(maskToPrefix("255.255.255.0")).toBe(24);
  });
});

describe("getNetworkDetails", () => {
  it("should get network details", () => {
    expect(getNetworkDetails("192.168.1.1", 24)).toEqual({
      networkAddress: "192.168.1.0",
      broadcastAddress: "192.168.1.255",
      wildcardMask: "0.0.0.255",
      firstHost: "192.168.1.1",
      lastHost: "192.168.1.254",
      totalHosts: 254,
    });
  });
});

describe("isValidIp", () => {
  it("should validate IP", () => {
    expect(isValidIp("192.168.1.1")).toBe(true);
    expect(isValidIp("192.168.1.256")).toBe(false);
  });
});

describe("isValidCidr", () => {
  it("should validate CIDR", () => {
    expect(isValidCidr("192.168.1.1/24")).toBe(true);
    expect(isValidCidr("192.168.1.1/33")).toBe(false);
  });
});

describe("isValidPrefix", () => {
  it("should validate prefix", () => {
    expect(isValidPrefix(24)).toBe(true);
    expect(isValidPrefix(33)).toBe(false);
  });
});
