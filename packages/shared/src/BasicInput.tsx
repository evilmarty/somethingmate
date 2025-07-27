import type { FC } from "react";
import type { InputProps } from "./types";

const BasicInput: FC<InputProps> = ({
  id = undefined,
  type = "text",
  value,
  onChange = undefined,
  className = null,
  ...rest
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
    className={`${className} px-3 py-2 bg-transparent text-inherit border-0 outline-0 flex-1`}
    {...rest}
  />
);

export default BasicInput;
