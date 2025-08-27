import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { FC } from "react";
import type { CopyButtonProps } from "./types";

function prefixClassName(className: string | null, prefix: string) {
  return className && `${prefix}-${className}`;
}

const CopyButton: FC<CopyButtonProps> = ({
  value,
  title = "Copy to clipboard",
  size = 16,
  buttonStyle = "soft",
  buttonSize = "md",
  buttonShape = null,
  className = null,
  children = null,
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
      className={`${className || ""} btn ${prefixClassName(buttonStyle, "btn")} ${prefixClassName(buttonSize, "btn")} ${prefixClassName(buttonShape, "btn")} swap ${copiedField ? "swap-active" : ""}`}
      title={title}
    >
      <span className="inline-block swap-on">
        <Check size={size} className="text-success" />
      </span>
      <span className="inline-block swap-off">
        {children || <Copy size={size} />}
      </span>
    </button>
  );
};

export default CopyButton;
