export default function buildFilterHref(
  current: { [key: string]: string | string[] | undefined },
  updates: { [key: string]: string | undefined },
): string {
  const params = new URLSearchParams();

  // Copy existing params
  for (const [key, value] of Object.entries(current)) {
    if (typeof value === "string") params.set(key, value);
  }

  // If date is being set, remove range
  if (updates.date !== undefined) {
    params.delete("start_date");
    params.delete("end_date");
  }

  if (updates.start_date !== undefined || updates.end_date !== undefined) {
    params.delete("date");
  }

  // Apply updates (undefined = remove the param)
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "/";
}
