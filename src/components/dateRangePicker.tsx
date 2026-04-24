"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Calendar1 } from "lucide-react";

const DateRangePicker = dynamic(
  () => import("@wojtekmaj/react-daterange-picker"),
  { ssr: false },
);

import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DateRange() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<Value>(null);
  const [isOpen, setIsOpen] = useState(false);

  const hasValue = Array.isArray(value) && value[0] && value[1];

  const format = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onChange = (val: Value) => {
    setValue(val);

    if (Array.isArray(val) && val[0] && val[1]) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("start_date", format(val[0]));
      params.set("end_date", format(val[1]));
      params.delete("date");
      router.push(`?${params.toString()}`, {scroll: false});
      setIsOpen(false);
    }

    if (val === null) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("start_date");
      params.delete("end_date");
      router.push(`?${params.toString()}`, {scroll: false});
    }
  };

  const handleClear = () => {
    setValue(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("start_date");
    params.delete("end_date");
    router.push(`?${params.toString()}`, {scroll: false});
  };

  const formatDisplay = (d: Date) =>
    d
      .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
      .replace(".", "")
      .toUpperCase();

  return (
    <div className="relative flex items-center gap-2">
      {/* Show selected range or just the icon */}
      {hasValue && Array.isArray(value) && value[0] && value[1] ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="text-xs font-light uppercase tracking-widest border-b border-black pb-0.5"
          >
            {formatDisplay(value[0])} — {formatDisplay(value[1])}
          </button>
          <button
            onClick={handleClear}
            className="text-xs font-light text-primary"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center justify-center text-primary"
        >
          <Calendar1 size={15} strokeWidth={1.25} />
        </button>
      )}

      {/* Hidden picker — only renders the calendar dropdown */}
      <div className="absolute top-7 left-0 z-50">
        <DateRangePicker
          onChange={onChange}
          value={value}
          locale="pt-BR"
          format="dd/MM/y"
          isOpen={isOpen}
          onCalendarClose={() => setIsOpen(false)}
          calendarIcon={null}
          clearIcon={null}
          className="daterange-hidden"
        />
      </div>
    </div>
  );
}
