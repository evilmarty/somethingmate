import Input from "./Input";
import CopyButton from "./CopyButton";
import type { FC } from "react";
import type { FieldProps } from "./types";

const ALIGNMENTS = {
  left: "justify-start text-left [text-align-last:left]",
  center: "justify-center text-center [text-align-last:center]",
  right: "justify-end text-right [text-align-last:right]",
};

const SIZES = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

const Label: FC<FieldProps> = ({
  value,
  size = "md",
  label = undefined,
  align = "right",
  fieldName = null,
  className = null,
  ...rest
}) => (
  <label className={`${className || ""} input ${SIZES[size]} w-full`}>
    {label && <span className="label">{label}</span>}
    <Input
      id={fieldName || label}
      value={value}
      className={`${ALIGNMENTS[align]} w-full`}
      {...rest}
    />
  </label>
);

const LabelWithCopyButton: FC<FieldProps> = ({
  value,
  fieldName = undefined,
  label = undefined,
  className = null,
  ...rest
}) => (
  <div className="join w-full">
    <Label
      label={label}
      fieldName={fieldName}
      value={value}
      className={`${className || ""} join-item`}
      {...rest}
    />
    <CopyButton value={String(value)} className="join-item" />
  </div>
);

const Field: FC<FieldProps> = ({ copyButton = true, ...rest }) =>
  copyButton ? <LabelWithCopyButton {...rest} /> : <Label {...rest} />;

export default Field;
