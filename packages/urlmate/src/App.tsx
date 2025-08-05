import { useState, useEffect } from "react";
import { AppContainer, Field } from "@somethingmate/shared";
import logo from "./logo.svg";

type DerivedValues = {
  href: string;
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  searchParams: [string, string][];
};

const NAME = "URL Mate";
const ABOUT =
  "URL Mate is a simple tool for deconstructing and manipulating URLs.";
const LINKS = {
  "CIDR Mate": "https://marty.zalega.me/cidrmate",
  "Date Mate": "https://marty.zalega.me/datemate",
};

function getUrlFromUrlParam(): URL | null {
  const urlParams = new URLSearchParams(window.location.search);
  const urlParam = urlParams.get("url");
  if (urlParam) {
    try {
      return new URL(urlParam);
    } catch (e) {
      // ignore invalid URLs
    }
  }
  return null;
}

function setUrlInUrlParam(url: URL) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("url", url.href);
  window.history.pushState({ url: url.href }, "", newUrl.toString());
}

function getDerivedValues(url: URL): DerivedValues {
  return {
    href: url.href,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    searchParams: Array.from(url.searchParams.entries()),
  };
}

const App = () => {
  const [currentUrl, setCurrentUrl] = useState<URL>(
    () => getUrlFromUrlParam() || new URL(window.location.href),
  );
  const derivedValues = getDerivedValues(currentUrl);
  const [rawValues, setRawValues] = useState<DerivedValues>(
    () => derivedValues,
  );

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "popstate",
      (e) => {
        try {
          const url = new URL(e.state?.url);
          updateCurrentUrl(url, false);
        } catch (e) {
          // ignore invalid URLs
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  });

  const updateCurrentUrl = (url: URL, updateUrl: boolean = true) => {
    const newValues = getDerivedValues(url);
    setCurrentUrl(url);
    setRawValues(newValues);
    if (updateUrl) {
      setUrlInUrlParam(url);
    }
  };

  const maybeUpdateCurrentUrl = (
    newUrl: URL | string,
    key: keyof DerivedValues,
    value: string,
    reset: boolean = false,
  ) => {
    try {
      newUrl = new URL(newUrl instanceof URL ? newUrl.href : newUrl);
      updateCurrentUrl(newUrl, reset);
    } catch (e) {
      setRawValues(reset ? derivedValues : { ...rawValues, [key]: value });
    }
  };

  const handleHrefChange = (value: string, reset: boolean = false) => {
    maybeUpdateCurrentUrl(value, "href", value, reset);
  };

  const handleProtocolChange = (value: string, reset: boolean = false) => {
    const newUrl = new URL(currentUrl);
    newUrl.protocol = value;
    maybeUpdateCurrentUrl(newUrl, "protocol", value, reset);
  };

  const handleUsernameChange = (value: string, reset: boolean = false) => {
    const newUrl = new URL(currentUrl);
    newUrl.username = value;
    maybeUpdateCurrentUrl(newUrl, "username", value, reset);
  };

  const handlePasswordChange = (value: string, reset: boolean = false) => {
    const newUrl = new URL(currentUrl);
    newUrl.password = value;
    maybeUpdateCurrentUrl(newUrl, "password", value, reset);
  };

  const handleHostnameChange = (value: string, reset: boolean = false) => {
    const newUrl = new URL(currentUrl);
    newUrl.hostname = value;
    maybeUpdateCurrentUrl(newUrl, "hostname", value, reset);
  };

  const handlePortChange = (value: string, reset: boolean = false) => {
    const newUrl = new URL(currentUrl);
    newUrl.port = value;
    maybeUpdateCurrentUrl(newUrl, "port", value, reset);
  };

  const handlePathnameChange = (value: string, reset: boolean = false) => {
    const newUrl = new URL(currentUrl);
    newUrl.pathname = value;
    maybeUpdateCurrentUrl(newUrl, "pathname", value, reset);
  };

  const handleSearchChange = (value: string, reset: boolean = false) => {
    const newUrl = new URL(currentUrl);
    newUrl.search = value;
    maybeUpdateCurrentUrl(newUrl, "search", value, reset);
  };

  const handleSearchParamChange = (
    key: string,
    value: string,
    reset: boolean = false,
  ) => {
    const newUrl = new URL(currentUrl);
    newUrl.searchParams.set(key, value);
    maybeUpdateCurrentUrl(newUrl, "search", value, reset);
  };

  const handleHashChange = (value: string, reset: boolean = false) => {
    const newUrl = new URL(currentUrl);
    newUrl.hash = value;
    maybeUpdateCurrentUrl(newUrl, "hash", value, reset);
  };

  return (
    <AppContainer name={NAME} about={ABOUT} links={LINKS} logo={logo}>
      <Field
        label="URL"
        value={rawValues.href}
        onChange={(e) => handleHrefChange(e.target.value, false)}
        onBlur={(e) => handleHrefChange(e.target.value.trim(), true)}
        placeholder="e.g., https://example.com:8080/path?query=value#hash"
        fieldName="href"
      />

      <Field
        label="Protocol"
        value={rawValues.protocol}
        onChange={(e) => handleProtocolChange(e.target.value, false)}
        onBlur={(e) => handleProtocolChange(e.target.value.trim(), true)}
        fieldName="protocol"
      />

      <Field
        label="Username"
        value={rawValues.username}
        onChange={(e) => handleUsernameChange(e.target.value, false)}
        onBlur={(e) => handleUsernameChange(e.target.value.trim(), true)}
        fieldName="username"
        autoComplete="off"
      />

      <Field
        label="Password"
        value={rawValues.password}
        onChange={(e) => handlePasswordChange(e.target.value, false)}
        onBlur={(e) => handlePasswordChange(e.target.value.trim(), true)}
        fieldName="password"
        autoComplete="off"
      />

      <Field
        label="Hostname"
        value={rawValues.hostname}
        onChange={(e) => handleHostnameChange(e.target.value, false)}
        onBlur={(e) => handleHostnameChange(e.target.value.trim(), true)}
        fieldName="hostname"
      />

      <Field
        label="Port"
        value={rawValues.port}
        onChange={(e) => handlePortChange(e.target.value.trim(), false)}
        onBlur={(e) => handlePortChange(e.target.value.trim(), true)}
        fieldName="port"
      />

      <Field
        label="Pathname"
        value={rawValues.pathname}
        onChange={(e) => handlePathnameChange(e.target.value, false)}
        onBlur={(e) => handlePathnameChange(e.target.value.trim(), true)}
        fieldName="pathname"
      />

      <Field
        label="Search"
        value={rawValues.search}
        onChange={(e) => handleSearchChange(e.target.value, false)}
        onBlur={(e) => handleSearchChange(e.target.value.trim(), true)}
        fieldName="search"
      />

      {rawValues.searchParams.map(([key, value]) => (
        <Field
          key={`searchparam_${key}`}
          label={key}
          value={value}
          onChange={(e) => handleSearchParamChange(key, e.target.value, false)}
          onBlur={(e) =>
            handleSearchParamChange(key, e.target.value.trim(), true)
          }
          fieldName={`searchparam_${key}`}
        />
      ))}

      <Field
        label="Hash"
        value={rawValues.hash}
        onChange={(e) => handleHashChange(e.target.value.trim(), false)}
        onBlur={(e) => handleHashChange(e.target.value.trim(), true)}
        fieldName="hash"
      />
    </AppContainer>
  );
};

export default App;
