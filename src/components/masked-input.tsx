"use client";

import { useState } from "react";

interface MaskedInputProps {
  name: string;
  placeholder: string;
  formatter: (value: string) => string;
  maxLength?: number;
  required?: boolean;
}

export default function MaskedInput({
  name,
  placeholder,
  formatter,
  maxLength,
  required,
}: MaskedInputProps) {
  const [display, setDisplay] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatter(e.target.value);
    setDisplay(formatted);
  }

  return (
    <div className="flex-1 h-10 text-sm font-light rounded-md bg-background relative">
      <input
        type="text"
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="w-full h-full p-2 placeholder:text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
      />
      {/* Hidden input sends raw digits to the action */}
      <input type="hidden" name={name} value={display.replace(/\D/g, "")} />
    </div>
  );
}
