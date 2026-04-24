"use client";

import { useState } from "react";
import { InputField } from "./inputField";

interface MaskedInputProps {
  label: string;
  name: string;
  placeholder?: string;
  formatter: (value: string) => string;
  maxLength?: number;
  required?: boolean;
  defaultValue?: string;
}

export default function MaskedInput({
  label,
  name,
  formatter,
  maxLength,
  required,
  defaultValue = "",
}: MaskedInputProps) {
  const [display, setDisplay] = useState(() =>
    defaultValue ? formatter(defaultValue) : "",
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatter(e.target.value);
    setDisplay(formatted);
  }

  return (
    <div>
      <InputField
        label={label}
        type="text"
        value={display}
        onChange={handleChange}
        maxLength={maxLength}
        required={required}
      />
      {/* Hidden input sends raw digits to the action */}
      <input type="hidden" name={name} value={display.replace(/\D/g, "")} />
    </div>
  );
}
