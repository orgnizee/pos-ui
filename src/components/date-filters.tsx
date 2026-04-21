"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { filterClass } from "@/lib/styleFilterButtons";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";

interface DateFilterProps {
  endpoint: string;
  resolvedParams: { [key: string]: string | string[] | undefined };
}

export default function DateFilter({
  endpoint,
  resolvedParams,
}: DateFilterProps) {
  const router = useRouter();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const currentStart =
    typeof resolvedParams.start_date === "string"
      ? resolvedParams.start_date
      : "";
  const currentEnd =
    typeof resolvedParams.end_date === "string" ? resolvedParams.end_date : "";

  const [range, setRange] = useState<{ from?: Date; to?: Date }>({
    from: currentStart ? new Date(currentStart + "T00:00:00") : undefined,
    to: currentEnd ? new Date(currentEnd + "T00:00:00") : undefined,
  });

  const hasRangeFilter = currentStart;

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(resolvedParams)) {
      if (["date", "start_date", "end_date"].includes(key)) continue;
      if (typeof val === "string") params.set(key, val);
    }
    for (const [key, val] of Object.entries(overrides)) {
      if (val) params.set(key, val);
    }
    const qs = params.toString();
    return `/${endpoint}${qs ? `?${qs}` : ""}`;
  }

  function applyRange(start: string, end: string) {
    router.push(buildUrl({ start_date: start, end_date: end }));
  }

  function toYMD(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function handleRangeSelect(r: { from?: Date; to?: Date } | undefined) {
    if (!r) return;
    setRange(r);
    if (r.from && r.to) {
      setCalendarOpen(false);
      applyRange(toYMD(r.from), toYMD(r.to));
    }
  }

  function formatLabel() {
    if (range.from && range.to) {
      return `${range.from.toLocaleDateString("pt-BR")} - ${range.to.toLocaleDateString("pt-BR")}`;
    }

    if (range.from) {
      return range.from.toLocaleDateString("pt-BR");
    }

    return "data";
  }

  return (
    <div className="flex flex-wrap pt-0 font-bold items-center">
      {/* Calendar */}
      <div ref={calendarRef} className="relative">
        <button onClick={() => setCalendarOpen((v) => !v)}>
          <p className={filterClass(!!hasRangeFilter)}>{formatLabel()}</p>
        </button>
        {calendarOpen && (
          <>
            {/* overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setCalendarOpen(false)}
            />
            {/* calendar */}
            <div className="absolute left-0 top-full mt-1 z-50 rounded-xl bg-background border border-tertiary shadow-sm p-3">
              <style>
                {`
                .rdp-root {
                  --rdp-accent-color: #2563eb;
                  --rdp-accent-background-color: #eff6ff;
                  --rdp-day-height: 32px;
                  --rdp-day-width: 32px;
                  --rdp-font-family: inherit;
                  font-size: 13px;
                  color: var(--color-text-primary);
                }
                .rdp-month_caption { font-size: 16px; font-weight: 800; margin-bottom: 8px; text-transform: uppercase; margin-left: 10px;}
                .rdp-weekday { font-size: 11px; font-weight: 400; color: var(--color-text-tertiary); text-transform: normal-case; }
                .rdp-day { border-radius: 6px; font-weight: 300; }
                .rdp-day:hover:not([disabled]) { background: #bcb8b1ff; border-radius: 999px;}
                .rdp-range_start .rdp-day_button,
                .rdp-range_end .rdp-day_button {
                  background: #2563eb;
                  color: #ffffff;
                  border-radius: 999px;
                }
                .rdp-range_middle .rdp-day_button {
                  background: #eff6ff;
                  color: #3b82f6;
                  border-radius: 0;
                }
                .rdp-selected .rdp-day_button {
                  background: #2563eb;
                  color: #ffffff;
                  border-radius: 999px;
                  margin: 2px;
                }
                .rdp-nav button { color: var(--color-text-secondary); }
                .rdp-nav button:hover { color: var(--color-text-primary); }
                .rdp-nav button svg { width: 14px; height: 14px; }
                .rdp-nav button svg path { stroke-width: 1; }
                `}
              </style>
              <DayPicker
                mode="range"
                locale={ptBR}
                selected={range as { from: Date; to?: Date }}
                onSelect={handleRangeSelect}
                defaultMonth={range.from ?? new Date()}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
