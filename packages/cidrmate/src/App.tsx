import { useState, useEffect } from "react";
import { CopyContext, EmojiCycler, Field } from "shared";
import {
  isValidCidr,
  isValidIp,
  isValidPrefix,
  ipToInt,
  intToIp,
  cidrToIpPrefix,
  ipPrefixToCidr,
  prefixToMask,
  maskToPrefix,
  getNetworkDetails,
} from "./utils";
import logo from "./logo.svg";
import "./App.css"; // Import your CSS file for styling

const DEFAULT_CIDR = "192.168.1.0/24";

const getCidrFromUrlParam = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const cidrParam = urlParams.get("cidr");
  return isValidCidr(cidrParam) ? cidrParam : null;
};

const setCidrInUrlParam = (cidr: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("cidr", cidr);
  window.history.pushState({ cidr }, "", url.toString());
};

function getDefaultCidr(): string {
  return getCidrFromUrlParam() || DEFAULT_CIDR;
}

function getDerivedValues(
  ipInt: number,
  prefix: number,
): Record<string, string> {
  const ip = intToIp(ipInt);
  const details = getNetworkDetails(ip, prefix);
  return {
    cidr: ipPrefixToCidr(ip, prefix),
    ip,
    ipInt: ipInt.toString(),
    prefix: prefix.toString(),
    subnetMask: prefixToMask(prefix),
    ...details,
    totalHosts: details.totalHosts.toString(),
  };
}

function getDerivedValuesFromCidr(cidr: string): Record<string, string> {
  const [ip, prefix] = cidrToIpPrefix(cidr);
  const ipInt = ipToInt(ip);
  return getDerivedValues(ipInt, prefix);
}

const App = () => {
  const copiedField = useState<string | null>(null);
  const [derivedValues, setDerivedValues] = useState(() => {
    return getDerivedValuesFromCidr(getDefaultCidr());
  });
  const [rawValues, setRawValues] = useState(derivedValues);

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "popstate",
      (e) => {
        updateDerivedValuesByCidr(e.state?.cidr, false);
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  });

  const updateDerivedValues = (
    ipInt: number,
    prefix: number,
    updatedUrl: boolean = true,
  ) => {
    const newValues = getDerivedValues(ipInt, prefix);
    setDerivedValues(newValues);
    setRawValues(newValues);
    if (updatedUrl) {
      setCidrInUrlParam(derivedValues.cidr);
    }
  };

  const updateDerivedValuesByCidr = (
    cidr: string,
    updatedUrl: boolean = true,
  ) => {
    const [ip, prefix] = cidrToIpPrefix(cidr);
    const ipInt = ipToInt(ip);
    updateDerivedValues(ipInt, prefix, updatedUrl);
  };

  const updateRawValues = (
    raw: Record<string, string>,
    reset: boolean = false,
  ) => {
    setRawValues(reset ? derivedValues : { ...rawValues, ...raw });
  };

  const handleCidrChange = (value: string, reset: boolean = false) => {
    if (isValidCidr(value)) {
      updateDerivedValuesByCidr(value, reset);
    } else {
      updateRawValues({ cidr: value }, reset);
    }
  };

  const handleIpChange = (value: string, reset: boolean = false) => {
    if (isValidIp(value)) {
      updateDerivedValues(
        ipToInt(value),
        parseInt(derivedValues.prefix),
        reset,
      );
    } else {
      updateRawValues({ ip: value }, reset);
    }
  };

  const handlePrefixChange = (value: string, reset: boolean = false) => {
    const prefixNum = parseInt(value);
    if (isValidPrefix(prefixNum)) {
      updateDerivedValues(parseInt(derivedValues.ipInt), prefixNum, reset);
    } else {
      updateRawValues({ prefix: value }, reset);
    }
  };

  const handleIntChange = (value: string, reset: boolean = false) => {
    const intValue = parseInt(value);
    const ip = intToIp(intValue);
    if (isValidIp(ip)) {
      updateDerivedValues(intValue, parseInt(derivedValues.prefix), reset);
    } else {
      updateRawValues({ ipInt: value }, reset);
    }
  };

  const handleSubnetMaskChange = (value: string, reset: boolean = false) => {
    if (isValidIp(value)) {
      const prefixNum = maskToPrefix(value);
      updateDerivedValues(parseInt(derivedValues.ipInt), prefixNum, reset);
    } else {
      updateRawValues({ subnetMask: value }, reset);
    }
  };

  return (
    <div className="max-w-2xl container mx-auto p-6 min-h-screen">
      <img src={logo} alt="CIDR Mate" className="w-50 mx-auto" />
      <CopyContext.Provider value={copiedField}>
        <div className="space-y-2">
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
            onChange={(e) =>
              handleSubnetMaskChange(e.target.value.trim(), false)
            }
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
        </div>
      </CopyContext.Provider>
      <div className="mt-8 text-sm text-center font-medium text-gray-500 dark:text-gray-400">
        Made with
        <EmojiCycler
          emojis={["❤️", "🍺", "🌯", "🥃", "🍦"]}
          className="inline-block mx-1"
        />
        by
        <a href="https://marty.zalega.me" className="ml-1">
          evilmarty
        </a>
      </div>
    </div>
  );
};

export default App;
