"use client";
import { useState } from "react";
import Link from "next/link";

export default function DropdownTypeMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="grid items-center justify-center shrink-0 rounded-md overflow-hidden"
      >
        <p className="w-fit h-fit px-5 py-0.5 pt-1 rounded-md text-center text-sm normal-case bg-secondary/20 cursor-pointer">
          tipo
        </p>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-10 flex flex-col rounded-md overflow-hidden bg-background shadow-md">
          {[
            { label: "crédito", value: "credit" },
            { label: "débito", value: "debit" },
            { label: "transferência", value: "transfer" },
          ].map(({ label, value }) => (
            <Link
              key={value}
              href={`?tipo=${value}`}
              onClick={() => setOpen(false)}
              className="px-5 py-1.5 text-sm normal-case font-light hover:bg-secondary/10 whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
