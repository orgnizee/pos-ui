import { ChevronDown } from "lucide-react";
import { baseInput, baseLabel, errorText, floatedLabel } from "./inputField";

type Option = { label: string; value: string };

export type OptionGroup = { label: string; options: Option[] };

type SelectProps = {
  label: string;
  options?: Option[];
  groups?: OptionGroup[];
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function SelectInputField({
  label,
  options,
  groups,
  error,
  ...props
}: SelectProps) {
  return (
    <div className="relative mt-6">
      <select
        defaultValue=""
        {...props}
        className={`${baseInput} appearance-none ${
          error ? "border-red-500 focus:border-red-500" : ""
        }`}
      >
        <option value="" disabled hidden>-</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {groups?.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <label
        className={`${baseLabel} ${floatedLabel}
          peer-[[value='']]:top-2 peer-[[value='']]:text-sm
          peer-[&:not([value=''])]:-top-3.5 peer-[&:not([value=''])]:text-[12px]
          ${error ? "text-red-500" : ""}`}
      >
        {label}
      </label>

      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
        <ChevronDown strokeWidth={0.8} size={16} />
      </span>

      {error && <p className={errorText}>{error}</p>}
    </div>
  );
}
