export const formatBRL = (value: string) =>
  Math.abs(parseFloat(value)).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export function formatDateTime(dateTime: string): string {
  const date = new Date(dateTime);

  const day = date.toLocaleString("pt-BR", {
    day: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  const month = date
    .toLocaleString("pt-BR", {
      month: "short",
      timeZone: "America/Sao_Paulo",
    })
    .toUpperCase()
    .replace(".", "");

  const year = date.toLocaleString("pt-BR", {
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });

  const time = date.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
    hour12: false,
  });

  return `${day} ${month} ${year} ${time}`;
}
