import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

const SEARCH =
  "?url=https%3A%2F%2Fuser%3Apass%40example.com%3A8080%2Fpath%3Fquery%3Dvalue%26query2%3Dvalue2%23hash";
const URL = "http://localhost/";
const HREF = `${URL}${SEARCH}`;

let historySpy;

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("location", { search: SEARCH, href: HREF });
    historySpy = vi.spyOn(history, "pushState").mockImplementation(() => {});
  });

  it("should render the app", () => {
    render(<App />);
    expect(screen.getByAltText("URL Mate")).toBeInTheDocument();
  });

  it("should update the url value when the url input changes", () => {
    const expectedUrl = "https://example.com/foo";
    render(<App />);
    const urlInput = screen.getByLabelText("URL", { selector: "#href" });
    expect(urlInput.value).toBe(
      "https://user:pass@example.com:8080/path?query=value&query2=value2#hash",
    );
    fireEvent.change(urlInput, { target: { value: expectedUrl } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the url value when the url input blurred", () => {
    const expectedUrl = "https://example.com/foo";
    render(<App />);
    const urlInput = screen.getByLabelText("URL", { selector: "#href" });
    expect(urlInput.value).toBe(
      "https://user:pass@example.com:8080/path?query=value&query2=value2#hash",
    );
    fireEvent.blur(urlInput, { target: { value: expectedUrl } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });

  it("should update the protocol value when the protocol input changes", () => {
    render(<App />);
    const protocolInput = screen.getByLabelText("Protocol", {
      selector: "#protocol",
    });
    expect(protocolInput.value).toBe("https:");
    fireEvent.change(protocolInput, { target: { value: "http:" } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the protocol value when the protocol input blurred", () => {
    const expectedUrl =
      "http://user:pass@example.com:8080/path?query=value&query2=value2#hash";
    render(<App />);
    const protocolInput = screen.getByLabelText("Protocol", {
      selector: "#protocol",
    });
    expect(protocolInput.value).toBe("https:");
    fireEvent.blur(protocolInput, { target: { value: "http:" } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });

  it("should update the username value when the username input changes", () => {
    render(<App />);
    const usernameInput = screen.getByLabelText("Username", {
      selector: "#username",
    });
    expect(usernameInput.value).toBe("user");
    fireEvent.change(usernameInput, { target: { value: "foo" } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the username value when the username input blurred", () => {
    const expectedUrl =
      "https://foo:pass@example.com:8080/path?query=value&query2=value2#hash";
    render(<App />);
    const usernameInput = screen.getByLabelText("Username", {
      selector: "#username",
    });
    expect(usernameInput.value).toBe("user");
    fireEvent.blur(usernameInput, { target: { value: "foo" } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });

  it("should update the password value when the password input changes", () => {
    render(<App />);
    const passwordInput = screen.getByLabelText("Password", {
      selector: "#password",
    });
    expect(passwordInput.value).toBe("pass");
    fireEvent.change(passwordInput, { target: { value: "bar" } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the password value when the password input blurred", () => {
    const expectedUrl =
      "https://user:bar@example.com:8080/path?query=value&query2=value2#hash";
    render(<App />);
    const passwordInput = screen.getByLabelText("Password", {
      selector: "#password",
    });
    expect(passwordInput.value).toBe("pass");
    fireEvent.blur(passwordInput, { target: { value: "bar" } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });

  it("should update the hostname value when the hostname input changes", () => {
    render(<App />);
    const hostnameInput = screen.getByLabelText("Hostname", {
      selector: "#hostname",
    });
    expect(hostnameInput.value).toBe("example.com");
    fireEvent.change(hostnameInput, { target: { value: "google.com" } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the hostname value when the hostname input blurred", () => {
    const expectedUrl =
      "https://user:pass@google.com:8080/path?query=value&query2=value2#hash";
    render(<App />);
    const hostnameInput = screen.getByLabelText("Hostname", {
      selector: "#hostname",
    });
    expect(hostnameInput.value).toBe("example.com");
    fireEvent.blur(hostnameInput, { target: { value: "google.com" } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });

  it("should update the port value when the port input changes", () => {
    render(<App />);
    const portInput = screen.getByLabelText("Port", { selector: "#port" });
    expect(portInput.value).toBe("8080");
    fireEvent.change(portInput, { target: { value: "9090" } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the port value when the port input blurred", () => {
    const expectedUrl =
      "https://user:pass@example.com:9090/path?query=value&query2=value2#hash";
    render(<App />);
    const portInput = screen.getByLabelText("Port", { selector: "#port" });
    expect(portInput.value).toBe("8080");
    fireEvent.blur(portInput, { target: { value: "9090" } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });

  it("should update the pathname value when the pathname input changes", () => {
    render(<App />);
    const pathnameInput = screen.getByLabelText("Pathname", {
      selector: "#pathname",
    });
    expect(pathnameInput.value).toBe("/path");
    fireEvent.change(pathnameInput, { target: { value: "/foo" } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the pathname value when the pathname input blurred", () => {
    const expectedUrl =
      "https://user:pass@example.com:8080/foo?query=value&query2=value2#hash";
    render(<App />);
    const pathnameInput = screen.getByLabelText("Pathname", {
      selector: "#pathname",
    });
    expect(pathnameInput.value).toBe("/path");
    fireEvent.blur(pathnameInput, { target: { value: "/foo" } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });

  it("should update the search value when the search input changes", () => {
    render(<App />);
    const searchInput = screen.getByLabelText("Search", {
      selector: "#search",
    });
    expect(searchInput.value).toBe("?query=value&query2=value2");
    fireEvent.change(searchInput, { target: { value: "?foo=bar" } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the search value when the search input blurred", () => {
    const expectedUrl = "https://user:pass@example.com:8080/path?foo=bar#hash";
    render(<App />);
    const searchInput = screen.getByLabelText("Search", {
      selector: "#search",
    });
    expect(searchInput.value).toBe("?query=value&query2=value2");
    fireEvent.blur(searchInput, { target: { value: "?foo=bar" } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });

  it("should update the search param value when the search param input changes", () => {
    render(<App />);
    const searchParamInput = screen.getByLabelText("query", {
      selector: "#searchparam_query",
    });
    expect(searchParamInput.value).toBe("value");
    fireEvent.change(searchParamInput, { target: { value: "bar" } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the search param value when the search param input blurred", () => {
    const expectedUrl =
      "https://user:pass@example.com:8080/path?query=bar&query2=value2#hash";
    render(<App />);
    const searchParamInput = screen.getByLabelText("query", {
      selector: "#searchparam_query",
    });
    expect(searchParamInput.value).toBe("value");
    fireEvent.blur(searchParamInput, { target: { value: "bar" } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });

  it("should update the hash value when the hash input changes", () => {
    render(<App />);
    const hashInput = screen.getByLabelText("Hash", { selector: "#hash" });
    expect(hashInput.value).toBe("#hash");
    fireEvent.change(hashInput, { target: { value: "#foo" } });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("should update the hash value when the hash input blurred", () => {
    const expectedUrl =
      "https://user:pass@example.com:8080/path?query=value&query2=value2#foo";
    render(<App />);
    const hashInput = screen.getByLabelText("Hash", { selector: "#hash" });
    expect(hashInput.value).toBe("#hash");
    fireEvent.blur(hashInput, { target: { value: "#foo" } });
    expect(historySpy).toHaveBeenCalledWith(
      { url: expectedUrl },
      "",
      `${URL}?url=${encodeURIComponent(expectedUrl)}`,
    );
  });
});
