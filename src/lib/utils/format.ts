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

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{1})(\d{4})(\d{1,4})$/, "$1$2-$3");
}

export function stripMask(value: string): string {
  return value.replace(/\D/g, "");
}