import { FC } from "react";
import BasicInput from "./BasicInput";
import SelectInput from "./SelectInput";
import type { InputProps } from "./types";

const Input: FC<InputProps> = ({ type = "text", options = null, ...rest }) => {
  if (options !== null) {
    return <SelectInput options={options} {...rest} />;
  } else {
    return <BasicInput type={type} {...rest} />;
  }
};

export default Input;
