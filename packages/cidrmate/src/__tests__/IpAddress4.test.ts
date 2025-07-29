import IpAddress4 from "../IpAddress4";

describe("IpAddress4", () => {
  it("should handle zero as a valid number", () => {
    const ip = new IpAddress4(0); // 0.0.0.0
    expect(ip.n).toBe(0);
    expect(ip.toString()).toBe("0.0.0.0");
  });

  it("should handle the maximum value for an IPv4 address", () => {
    const ip = new IpAddress4(4294967295); // 255.255.255.255
    expect(ip.n).toBe(4294967295);
    expect(ip.toString()).toBe("255.255.255.255");
  });

  it("should convert to string correctly", () => {
    const ip = new IpAddress4(3232235521); // 192.168.0.1
    expect(ip.toString()).toBe("192.168.0.1");
  });

  it("should get parts correctly", () => {
    const ip = new IpAddress4(3232235521); // 192.168.0.1
    expect(ip.parts).toEqual([192, 168, 0, 1]);
  });

  it("should create from string correctly", () => {
    const ip = IpAddress4.fromString("192.168.0.1");
    expect(ip.n).toBe(3232235521);
  });

  it("should create from string for 0.0.0.0", () => {
    const ip = IpAddress4.fromString("0.0.0.0");
    expect(ip.valueOf()).toBe(0);
  });

  it("should create from string for 255.255.255.255", () => {
    const ip = IpAddress4.fromString("255.255.255.255");
    expect(ip.valueOf()).toBe(4294967295);
  });

  it("should return NaN for invalid string", () => {
    const ip = IpAddress4.fromString("invalid-ip");
    expect(ip.valueOf()).toBeNaN();
  });

  it("should return NaN for incomplete IP address", () => {
    const ip = IpAddress4.fromString("192.168.0");
    expect(ip.valueOf()).toBeNaN();
  });

  it("should return NaN for IP address with out-of-range parts", () => {
    const ip = IpAddress4.fromString("192.168.0.256");
    expect(ip.valueOf()).toBeNaN();
  });

  it("should return the numeric value with valueOf", () => {
    const ip = new IpAddress4(3232235521);
    expect(ip.valueOf()).toBe(3232235521);
  });
});

