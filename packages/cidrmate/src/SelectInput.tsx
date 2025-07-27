import type { FC } from "react";
import type { InputProps } from "./types";

const SelectInput: FC<InputProps> = ({
  id = undefined,
  value,
  onChange = undefined,
  options = null,
  className = null,
}) => (
  <select
    id={id}
    value={value}
    onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
    className={`${className} appearance-none px-3 py-2 bg-transparent text-inherit border-0 outline-0 flex-1`}
  >
    {normalizeOptions(options || []).map(([key, value]) => (
      <option key={key} value={key}>
        {value}
      </option>
    ))}
  </select>
);

function normalizeOptions(
  options: string[] | Record<string, string>,
): [string | number, string][] {
  if (Array.isArray(options)) {
    return options.map((v) => [v, v]);
  }
  return Object.entries(options);
}

export default SelectInput;
