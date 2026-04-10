"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { filterClass } from "@/lib/style-filter-buttons";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";

interface DateFilterProps {
  endpoint: string;
  resolvedParams: { [key: string]: string | string[] | undefined };
}

const DATE_SHORTCUTS = [
  { label: "hoje", value: "today" },
  { label: "semana", value: "week" },
] as const;

function getMonthList() {
  const months: { label: string; start: string; end: string }[] = [];
  const now = new Date();
  for (let offset = -12; offset <= 12; offset++) {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    const label = d
      .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
      .replace(".", "")
      .replace(" de ", " ");
    months.push({ label, start, end });
  }
  return months;
}

export default function DateFilter({
  endpoint,
  resolvedParams,
}: DateFilterProps) {
  const router = useRouter();
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const months = getMonthList();

  const currentDate =
    typeof resolvedParams.date === "string" ? resolvedParams.date : "";
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

  const activeMonth = months.find(
    (m) => m.start === currentStart && m.end === currentEnd,
  );

  const hasFilter = currentDate || currentStart || currentEnd;
  const hasRangeFilter = !activeMonth && (currentStart || currentEnd);

  useEffect(() => {
    if (!monthDropdownOpen) return;
    setTimeout(() => {
      document
        .getElementById("month-current")
        ?.scrollIntoView({ block: "center" });
    }, 0);
  }, [monthDropdownOpen]);

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

  function clear() {
    setRange({});
    router.push(buildUrl({}));
  }

  function isShortcut(value: string) {
    return currentDate === value;
  }

  function applyShortcut(value: string) {
    setRange({});
    setMonthDropdownOpen(false);
    setCalendarOpen(false);
    router.push(buildUrl({ date: value }));
  }

  function applyMonth(start: string, end: string) {
    setRange({});
    setMonthDropdownOpen(false);
    router.push(buildUrl({ start_date: start, end_date: end }));
  }

  function applyRange(start: string, end: string) {
    router.push(buildUrl({ start_date: start, end_date: end }));
  }

  function toYMD(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function formatDate(d: Date) {
    return d
      .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
      .replace(".", "");
  }

  function handleRangeSelect(r: { from?: Date; to?: Date } | undefined) {
    if (!r) return;
    setRange(r);
    if (r.from && r.to) {
      setCalendarOpen(false);
      applyRange(toYMD(r.from), toYMD(r.to));
    }
  }

  const rangeLabel = range.from
    ? range.to
      ? `${formatDate(range.from)} – ${formatDate(range.to)}`
      : formatDate(range.from)
    : "período";

  return (
    <div className="flex flex-wrap pt-1 pb-2 gap-2 font-bold items-center">
      {DATE_SHORTCUTS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => (isShortcut(value) ? clear() : applyShortcut(value))}
        >
          <p className={filterClass(isShortcut(value))}>{label}</p>
        </button>
      ))}

      {/* Month */}
      <div ref={monthDropdownRef} data-month-dropdown className="relative">
        <button onClick={() => setMonthDropdownOpen((v) => !v)}>
          <p className={filterClass(!!activeMonth)}>
            {activeMonth ? activeMonth.label : "mês"}
          </p>
        </button>
        {monthDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMonthDropdownOpen(false)}
            />
            <div className="absolute left-0 top-full mt-1 z-50 w-32 max-h-64 overflow-y-auto rounded-xl bg-background border border-tertiary shadow-sm py-1">
              {" "}
              {months.map((m, i) => {
                const isNow = i === 12;
                const isActive = activeMonth?.start === m.start;
                return (
                  <button
                    id={isNow ? "month-current" : undefined}
                    key={m.start}
                    className={`w-full text-left px-3 py-1.5 text-sm normal-case transition-colors hover:bg-secondary/20
                      ${isActive ? "font-bold text-primary" : "font-light text-tertiary"}
                      ${isNow && !isActive ? "text-primary" : ""}
                    `}
                    onClick={() =>
                      isActive ? clear() : applyMonth(m.start, m.end)
                    }
                  >
                    {m.label}
                    {isNow && (
                      <span className="ml-1 text-xs text-tertiary">•</span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Calendar */}
      <div ref={calendarRef} className="relative">
        <button onClick={() => setCalendarOpen((v) => !v)}>
          <p className={filterClass(!!hasRangeFilter)}>{rangeLabel}</p>
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
              <style>{`
    .rdp-root {
      --rdp-accent-color: #2563eb;
      --rdp-accent-background-color: #eff6ff;
      --rdp-day-height: 32px;
      --rdp-day-width: 32px;
      --rdp-font-family: inherit;
      font-size: 13px;
      color: var(--color-text-primary);
    }
    .rdp-month_caption { font-size: 13px; font-weight: 500; margin-bottom: 8px; text-transform: capitalize; }
    .rdp-weekday { font-size: 11px; font-weight: 400; color: var(--color-text-tertiary); text-transform: capitalize; }
    .rdp-day { border-radius: 6px; font-weight: 300; }
    .rdp-day:hover:not([disabled]) { background: #eff6ff; }
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
    }
    .rdp-nav button { color: var(--color-text-secondary); }
    .rdp-nav button:hover { color: var(--color-text-primary); }
  `}</style>
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

      {hasFilter && (
        <button
          onClick={clear}
          className="text-xs font-light text-tertiary hover:text-primary transition-colors normal-case"
        >
          limpar
        </button>
      )}
    </div>
  );
}
