export default function buildFilterHref(
  current: { [key: string]: string | string[] | undefined },
  updates: { [key: string]: string | undefined },
): string {
  const params = new URLSearchParams();

  // Copy existing params
  for (const [key, value] of Object.entries(current)) {
    if (typeof value === "string") params.set(key, value);
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
  return qs ? `?${qs}` : "/caixa";
}
