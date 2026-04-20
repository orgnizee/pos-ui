export const formatBRL = (value: string) =>
  Math.abs(parseFloat(value)).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export function formatDateTime(dateTime: string): string {
  const [datePart, timePart] = dateTime.split("T");

  const [year, month, day] = datePart.split("-");

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  const formattedDay = String(date.getDate()).padStart(2, "0");

  const formattedMonth = date
    .toLocaleString("pt-BR", { month: "short" })
    .toUpperCase()
    .replace(".", "");

  const formattedYear = date.getFullYear();

  let time = "";
  if (timePart) {
    const [hour, minute] = timePart.split(":");
    time = ` ${hour}:${minute}`;
  }

  return `${formattedDay} ${formattedMonth} ${formattedYear}${time}`;
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