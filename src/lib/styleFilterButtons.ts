export function filterClass(active: boolean) {
  return `py-0.5 text-xs
  appearance-none outline-none cursor-pointer
  ${active ? "font-bold border-primary" : "font-normal border-secondary"}`;
}
