import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

const SEARCH = "?cidr=192.168.1.0/24";
const URL = "http://localhost/";
const HREF = `${URL}${SEARCH}`;

let historySpy;

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("location", { search: SEARCH, href: HREF });
    historySpy = vi.spyOn(history, "pushState").mockImplementation(() => {});
  });

  it("updates all fields when CIDR is changed", () => {
    render(<App />);
    const cidrInput = screen.getByLabelText("CIDR");
    fireEvent.change(cidrInput, { target: { value: "10.0.0.0/16" } });

    expect(screen.getByLabelText("IP").value).toBe("10.0.0.0");
    expect(screen.getByLabelText("Integer").value).toBe("167772160");
    expect(screen.getByLabelText("Prefix").value).toBe("16");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.0.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("65534");
  });

  it("updates all fields when CIDR is blurred", () => {
    const expectedCidr = "10.0.0.0/16";
    render(<App />);
    const cidrInput = screen.getByLabelText("CIDR");
    fireEvent.blur(cidrInput, { target: { value: expectedCidr } });

    expect(screen.getByLabelText("IP").value).toBe("10.0.0.0");
    expect(screen.getByLabelText("Integer").value).toBe("167772160");
    expect(screen.getByLabelText("Prefix").value).toBe("16");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.0.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("65534");
    expect(historySpy).toHaveBeenCalledWith(
      { cidr: expectedCidr },
      "",
      `${URL}?cidr=${encodeURIComponent(expectedCidr)}`,
    );
  });

  it("updates all fields when IP is changed", () => {
    render(<App />);
    const ipInput = screen.getByLabelText("IP");
    fireEvent.change(ipInput, { target: { value: "192.168.1.1" } });

    expect(screen.getByLabelText("CIDR").value).toBe("192.168.1.1/24");
    expect(screen.getByLabelText("Integer").value).toBe("3232235777");
    expect(screen.getByLabelText("Prefix").value).toBe("24");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.255.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("254");
  });

  it("updates all fields when IP is blurred", () => {
    const expectedCidr = "192.168.1.1/24";
    render(<App />);
    const ipInput = screen.getByLabelText("IP");
    fireEvent.blur(ipInput, { target: { value: "192.168.1.1" } });

    expect(screen.getByLabelText("CIDR").value).toBe("192.168.1.1/24");
    expect(screen.getByLabelText("Integer").value).toBe("3232235777");
    expect(screen.getByLabelText("Prefix").value).toBe("24");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.255.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("254");
    expect(historySpy).toHaveBeenCalledWith(
      { cidr: expectedCidr },
      "",
      `${URL}?cidr=${encodeURIComponent(expectedCidr)}`,
    );
  });

  it("updates all fields when Integer is changed", () => {
    render(<App />);
    const intInput = screen.getByLabelText("Integer");
    fireEvent.change(intInput, { target: { value: "167772160" } });

    expect(screen.getByLabelText("CIDR").value).toBe("10.0.0.0/24");
    expect(screen.getByLabelText("IP").value).toBe("10.0.0.0");
    expect(screen.getByLabelText("Prefix").value).toBe("24");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.255.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("254");
  });

  it("updates all fields when Integer is blurred", () => {
    const expectedCidr = "10.0.0.0/24";
    render(<App />);
    const intInput = screen.getByLabelText("Integer");
    fireEvent.blur(intInput, { target: { value: "167772160" } });

    expect(screen.getByLabelText("CIDR").value).toBe("10.0.0.0/24");
    expect(screen.getByLabelText("IP").value).toBe("10.0.0.0");
    expect(screen.getByLabelText("Prefix").value).toBe("24");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.255.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("254");
    expect(historySpy).toHaveBeenCalledWith(
      { cidr: expectedCidr },
      "",
      `${URL}?cidr=${encodeURIComponent(expectedCidr)}`,
    );
  });

  it("updates all fields when Prefix is changed", () => {
    render(<App />);
    const prefixInput = screen.getByLabelText("Prefix");
    fireEvent.change(prefixInput, { target: { value: "16" } });

    expect(screen.getByLabelText("CIDR").value).toBe("192.168.1.0/16");
    expect(screen.getByLabelText("IP").value).toBe("192.168.1.0");
    expect(screen.getByLabelText("Integer").value).toBe("3232235776");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.0.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("65534");
  });

  it("updates all fields when Prefix is blurred", () => {
    const expectedCidr = "192.168.1.0/16";
    render(<App />);
    const prefixInput = screen.getByLabelText("Prefix");
    fireEvent.blur(prefixInput, { target: { value: "16" } });

    expect(screen.getByLabelText("CIDR").value).toBe("192.168.1.0/16");
    expect(screen.getByLabelText("IP").value).toBe("192.168.1.0");
    expect(screen.getByLabelText("Integer").value).toBe("3232235776");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.0.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("65534");
    expect(historySpy).toHaveBeenCalledWith(
      { cidr: expectedCidr },
      "",
      `${URL}?cidr=${encodeURIComponent(expectedCidr)}`,
    );
  });

  it("updates all fields when Subnet Mask is changed", () => {
    render(<App />);
    const subnetInput = screen.getByLabelText("Subnet Mask");
    fireEvent.change(subnetInput, { target: { value: "255.255.0.0" } });

    expect(screen.getByLabelText("CIDR").value).toBe("192.168.1.0/16");
    expect(screen.getByLabelText("IP").value).toBe("192.168.1.0");
    expect(screen.getByLabelText("Integer").value).toBe("3232235776");
    expect(screen.getByLabelText("Prefix").value).toBe("16");
    expect(screen.getByLabelText("Total Hosts").value).toBe("65534");
  });

  it("updates all fields when Subnet Mask is blurred", () => {
    const expectedCidr = "192.168.1.0/16";
    render(<App />);
    const subnetInput = screen.getByLabelText("Subnet Mask");
    fireEvent.blur(subnetInput, { target: { value: "255.255.0.0" } });

    expect(screen.getByLabelText("CIDR").value).toBe("192.168.1.0/16");
    expect(screen.getByLabelText("IP").value).toBe("192.168.1.0");
    expect(screen.getByLabelText("Integer").value).toBe("3232235776");
    expect(screen.getByLabelText("Prefix").value).toBe("16");
    expect(screen.getByLabelText("Total Hosts").value).toBe("65534");
    expect(historySpy).toHaveBeenCalledWith(
      { cidr: expectedCidr },
      "",
      `${URL}?cidr=${encodeURIComponent(expectedCidr)}`,
    );
  });

  it("should copy the cidr when the copy button is clicked", async () => {
    const spy = vi.spyOn(navigator.clipboard, "writeText");
    render(<App />);
    const copyButton = screen.getAllByTitle("Copy to clipboard")[0];
    await act(async () => {
      await fireEvent.click(copyButton);
    });
    expect(spy).toHaveBeenCalledWith("192.168.1.0/24");
  });
});
