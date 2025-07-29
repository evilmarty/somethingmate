import Cidr4 from "../Cidr4";
import IpAddress4 from "../IpAddress4";

describe("Cidr4", () => {
  test("should create a new Cidr4 instance", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr).toBeInstanceOf(Cidr4);
  });

  test("should get the correct IP address", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.ip.toString()).toBe("192.168.1.1");
  });

  test("should get the correct prefix", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.prefix).toBe(24);
  });

  test("should get the correct subnet mask", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.subnetMask.toString()).toBe("255.255.255.0");
  });

  test("should get the correct wildcard mask", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.wildcardMask.toString()).toBe("0.0.0.255");
  });

  test("should get the correct network address", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.networkAddress.toString()).toBe("192.168.1.0");
  });

  test("should get the correct broadcast address", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.broadcastAddress.toString()).toBe("192.168.1.255");
  });

  test("should get the correct first host", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.firstHost().toString()).toBe("192.168.1.1");
  });

  test("should get the correct last host", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.lastHost().toString()).toBe("192.168.1.254");
  });

  test("should get the correct total hosts", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.totalHosts()).toBe(254);
  });

  test("should get the correct valueOf", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.valueOf()).toBe(3232235776);
  });

  test("should get the correct toString", () => {
    const ip = IpAddress4.fromString("192.168.1.1");
    const cidr = new Cidr4(ip, 24);
    expect(cidr.toString()).toBe("192.168.1.1/24");
  });

  test("should create a new Cidr4 instance from a string", () => {
    const cidr = Cidr4.fromString("192.168.1.1/24");
    expect(cidr.ip.toString()).toBe("192.168.1.1");
    expect(cidr.prefix).toBe(24);
  });

  test("should return NaN for invalid CIDR string", () => {
    const cidr = Cidr4.fromString("192.168.1.1");
    expect(cidr.valueOf()).toBeNaN();
  });

  test("should throw an error for invalid prefix", () => {
    const cidr = Cidr4.fromString("192.168.1.1/33");
    expect(cidr.valueOf()).toBeNaN();
  });
});
