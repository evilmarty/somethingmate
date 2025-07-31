import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { FC } from "react";
import type { CopyButtonProps } from "./types";

const CopyButton: FC<CopyButtonProps> = ({
  value,
  size = 16,
  className = null,
}) => {
  const [copiedField, setCopiedField] = useState(false);
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(true);
      setTimeout(() => setCopiedField(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <button
      onClick={() => copyToClipboard(value)}
      className={`${className || ""} btn btn-soft swap ${copiedField && "swap-active"}`}
      title="Copy to clipboard"
    >
      <span className="inline-block swap-on">
        <Check size={size} className="text-success" />
      </span>
      <span className="inline-block swap-off">
        <Copy size={size} />
      </span>
    </button>
  );
};

export default CopyButton;
