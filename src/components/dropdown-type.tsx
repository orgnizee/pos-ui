"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function DropdownTypeMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("type") ?? "";

  const options = [
    { label: "tipo", value: "" },
    { label: "entrada", value: "credit" },
    { label: "saída", value: "debit" },
    { label: "transferência", value: "transfer" },
  ];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("type", value);
    } else {
      params.delete("type");
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      style={{ textAlignLast: "center" }}
      className="w-fit h-fit px-5 py-0.5 pt-1 rounded-md text-sm normal-case bg-secondary/20 cursor-pointer border-none outline-none appearance-none"
    >
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
