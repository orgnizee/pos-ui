"use client";
import { filterClass } from "@/lib/styleFilterButtons";
import { useRouter, useSearchParams } from "next/navigation";

export default function SelectTypeInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("type") ?? "";

  const options = [
    { label: "ENTRADA", value: "credit" },
    { label: "SAÍDA", value: "debit" },
    { label: "TRANSFERÊNCIA", value: "transfer" },
  ];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("type", value);
    } else {
      params.delete("type");
    }
    router.push(`?${params.toString()}`, {scroll: false});
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      style={{ textAlignLast: "end" }}
      className={`${filterClass(current !== "")}`}
    >
      <option disabled value="">
        TIPO
      </option>
      {options.map(({ label, value }) => (
        <option key={value} value={value} className="uppercase">
          {label}
        </option>
      ))}
    </select>
  );
}
