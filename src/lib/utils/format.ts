export const formatBRL = (value: string) =>
  parseFloat(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
