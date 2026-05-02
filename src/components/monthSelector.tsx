"use client";

import { filterClass } from "@/lib/styleFilterButtons";
import { useRouter, useSearchParams } from "next/navigation";

const year = new Date().getFullYear();

const months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(year, i, 1);

  return {
    label: date.toLocaleString("pt-BR", { month: "long" }),
    value: date.toISOString().slice(0, 7), // YYYY-MM
  };
});

// format YYYY-MM-DD in America/Recife without UTC shift
function formatDateRecife(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Recife",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;

  return `${y}-${m}-${d}`;
}

export default function MonthSelect({endpoint}: {endpoint: string}) {
  const router = useRouter();
  const params = useSearchParams();

  const startDate = params.get("start_date");
  const current = startDate ? startDate.slice(0, 7) : "";
  const isActive = !!startDate;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newParams = new URLSearchParams(params.toString());
    const value = e.target.value;

    if (value) {
      const [y, m] = value.split("-").map(Number);

      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0);

      newParams.delete("date")
      newParams.set("start_date", formatDateRecife(start));
      newParams.set("end_date", formatDateRecife(end));
    } else {
      newParams.delete("start_date");
      newParams.delete("end_date");
    }

    router.push(`/${endpoint}?${newParams.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className={`${filterClass(isActive)}`}
    >
      <option value="">MÊS</option>

      {months.map((m) => (
        <option key={m.value} value={m.value}>
          {m.label.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
