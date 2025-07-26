import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App", () => {
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

  it("updates all fields when IP is changed", () => {
    render(<App />);
    const ipInput = screen.getByLabelText("IP");
    fireEvent.change(ipInput, { target: { value: "192.168.1.1" } });

    expect(screen.getByLabelText("CIDR").value).toBe("192.168.1.1/24");
    expect(screen.getByLabelText("Integer").value).toBe("-1062731519");
    expect(screen.getByLabelText("Prefix").value).toBe("24");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.255.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("254");
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

  it("updates all fields when Prefix is changed", () => {
    render(<App />);
    const prefixInput = screen.getByLabelText("Prefix");
    fireEvent.change(prefixInput, { target: { value: "16" } });

    expect(screen.getByLabelText("CIDR").value).toBe("192.168.1.0/16");
    expect(screen.getByLabelText("IP").value).toBe("192.168.1.0");
    expect(screen.getByLabelText("Integer").value).toBe("-1062731520");
    expect(screen.getByLabelText("Subnet Mask").value).toBe("255.255.0.0");
    expect(screen.getByLabelText("Total Hosts").value).toBe("65534");
  });

  it("updates all fields when Subnet Mask is changed", () => {
    render(<App />);
    const subnetInput = screen.getByLabelText("Subnet Mask");
    fireEvent.change(subnetInput, { target: { value: "255.255.0.0" } });

    expect(screen.getByLabelText("CIDR").value).toBe("192.168.1.0/16");
    expect(screen.getByLabelText("IP").value).toBe("192.168.1.0");
    expect(screen.getByLabelText("Integer").value).toBe("-1062731520");
    expect(screen.getByLabelText("Prefix").value).toBe("16");
    expect(screen.getByLabelText("Total Hosts").value).toBe("65534");
  });
});