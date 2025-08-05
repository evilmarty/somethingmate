import { useState, useEffect } from "react";
import { AppContainer, Field } from "@somethingmate/shared";
import Cidr4 from "./Cidr4";
import IpAddress4 from "./IpAddress4";
import logo from "./logo.svg";

const DEFAULT_CIDR = Cidr4.fromString("192.168.1.0/24");
const NAME = "CIDR Mate";
const ABOUT =
  "CIDR Mate is a simple tool for calculating CIDR notations and their derived values.";
const LINKS = {
  "Date Mate": "https://marty.zalega.me/datemate",
};

type DerivedValues = {
  cidr: string;
  ip: string;
  ipInt: string;
  prefix: string;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: string;
};

function getCidrFromUrlParam(): Cidr4 {
  const urlParams = new URLSearchParams(window.location.search);
  return Cidr4.fromString(urlParams.get("cidr") || "");
}

function setCidrInUrlParam(cidr: Cidr4) {
  const cidrStr = cidr.toString();
  const url = new URL(window.location.href);
  url.searchParams.set("cidr", cidrStr);
  window.history.pushState({ cidr: cidrStr }, "", url.toString());
}

function getDefaultCidr(): Cidr4 {
  const cidr = getCidrFromUrlParam();
  return isNaN(cidr.valueOf()) ? DEFAULT_CIDR : cidr;
}

function getDerivedValues(cidr: Cidr4): DerivedValues {
  return {
    cidr: cidr.toString(),
    ip: cidr.ip.toString(),
    ipInt: cidr.ip.valueOf().toString(),
    prefix: cidr.prefix.toString(),
    subnetMask: cidr.subnetMask.toString(),
    networkAddress: cidr.networkAddress.toString(),
    broadcastAddress: cidr.broadcastAddress.toString(),
    wildcardMask: cidr.wildcardMask.toString(),
    firstHost: cidr.firstHost().toString(),
    lastHost: cidr.lastHost().toString(),
    totalHosts: cidr.totalHosts().toString(),
  };
}

const App = () => {
  const [cidr, setCidr] = useState<Cidr4>(() => getDefaultCidr());
  const derivedValues = getDerivedValues(cidr);
  const [rawValues, setRawValues] = useState<DerivedValues>(
    () => derivedValues,
  );

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "popstate",
      (e) => {
        const cidr = Cidr4.fromString(e.state?.cidr);
        if (!isNaN(cidr.valueOf())) {
          updateCidr(cidr, false);
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  });

  const updateCidr = (cidr: Cidr4, updatedUrl: boolean = true) => {
    const newValues = getDerivedValues(cidr);
    setCidr(cidr);
    setRawValues(newValues);
    if (updatedUrl) {
      setCidrInUrlParam(cidr);
    }
  };

  const maybeUpdateCidr = (
    newCidr: Cidr4,
    key: keyof DerivedValues,
    value: string,
    reset: boolean = false,
  ) => {
    if (!isNaN(newCidr.valueOf())) {
      updateCidr(newCidr, reset);
    } else {
      setRawValues(reset ? derivedValues : { ...rawValues, [key]: value });
    }
  };

  const handleCidrChange = (value: string, reset: boolean = false) => {
    const newCidr = Cidr4.fromString(value);
    maybeUpdateCidr(newCidr, "cidr", value, reset);
  };

  const handleIpChange = (value: string, reset: boolean = false) => {
    const ip = IpAddress4.fromString(value);
    const newCidr = new Cidr4(ip, cidr.prefix);
    maybeUpdateCidr(newCidr, "ip", value, reset);
  };

  const handlePrefixChange = (value: string, reset: boolean = false) => {
    const prefixNum = parseInt(value, 10);
    const newCidr = new Cidr4(cidr.ip, prefixNum);
    maybeUpdateCidr(newCidr, "prefix", value, reset);
  };

  const handleIntChange = (value: string, reset: boolean = false) => {
    const ip = new IpAddress4(parseInt(value));
    const newCidr = new Cidr4(ip, cidr.prefix);
    maybeUpdateCidr(newCidr, "ipInt", value, reset);
  };

  const handleSubnetMaskChange = (value: string, reset: boolean = false) => {
    const subnetMask = IpAddress4.fromString(value);
    const prefix = Cidr4.fromSubnetMask(subnetMask);
    const newCidr = new Cidr4(cidr.ip, prefix);
    maybeUpdateCidr(newCidr, "subnetMask", value, reset);
  };

  return (
    <AppContainer name={NAME} about={ABOUT} links={LINKS} logo={logo}>
      <Field
        type="cidr"
        label="CIDR"
        value={rawValues.cidr}
        onChange={(e) => handleCidrChange(e.target.value.trim(), false)}
        onBlur={(e) => handleCidrChange(e.target.value.trim(), true)}
        placeholder="192.168.1.0/24"
        fieldName="cidr"
      />

      <Field
        type="ip"
        label="IP"
        value={rawValues.ip}
        onChange={(e) => handleIpChange(e.target.value.trim(), false)}
        onBlur={(e) => handleIpChange(e.target.value.trim(), true)}
        placeholder="192.168.1.0"
        fieldName="ip"
      />

      <Field
        label="Integer"
        type="number"
        value={rawValues.ipInt}
        onChange={(e) => handleIntChange(e.target.value.trim(), false)}
        onBlur={(e) => handleIntChange(e.target.value.trim(), true)}
        fieldName="int"
      />

      <Field
        label="Prefix"
        type="number"
        min="0"
        max="32"
        value={rawValues.prefix}
        onChange={(e) => handlePrefixChange(e.target.value.trim(), false)}
        onBlur={(e) => handlePrefixChange(e.target.value.trim(), true)}
        placeholder="24"
        fieldName="prefix"
      />

      <Field
        type="ip"
        label="Subnet Mask"
        value={rawValues.subnetMask}
        onChange={(e) => handleSubnetMaskChange(e.target.value.trim(), false)}
        onBlur={(e) => handleSubnetMaskChange(e.target.value.trim(), true)}
        placeholder="255.255.255.0"
        fieldName="subnetMask"
      />

      <Field
        type="ip"
        label="Wildcard Mask"
        value={rawValues.wildcardMask}
        placeholder="0.0.0.255"
        fieldName="wildcardMask"
        readOnly
      />

      <Field
        type="ip"
        label="Network Address"
        value={rawValues.networkAddress}
        fieldName="networkAddress"
        readOnly
      />

      <Field
        type="ip"
        label="Broadcast Address"
        value={rawValues.broadcastAddress}
        fieldName="broadcastAddress"
        readOnly
      />

      <Field
        type="ip"
        label="First Host"
        value={rawValues.firstHost}
        fieldName="firstHost"
        readOnly
      />

      <Field
        type="ip"
        label="Last Host"
        value={rawValues.lastHost}
        fieldName="lastHost"
        readOnly
      />

      <Field
        type="number"
        label="Total Hosts"
        value={rawValues.totalHosts}
        fieldName="totalHosts"
        readOnly
      />
    </AppContainer>
  );
};

export default App;
