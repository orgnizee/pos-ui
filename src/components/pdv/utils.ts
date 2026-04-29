export const FALLBACK_DEFAULT_CUSTOMER = {
  id: null,
  name: "CONSUMIDOR FINAL",
};

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseCurrencyToCents(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "");
  return Number(digits || "0");
}

export function parsePriceToCents(price: string | null | undefined) {
  const parsed = Number.parseFloat(price ?? "0");
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(parsed * 100);
}

export function lineTotalCents(
  price: string | null | undefined,
  quantity: number,
) {
  const priceCents = parsePriceToCents(price);
  const quantityThousandths = Math.round(quantity * 1000);
  return Math.max(Math.round((priceCents * quantityThousandths) / 1000), 0);
}

export function automaticCentDiscountCents(
  price: string | null | undefined,
  quantity: number,
) {
  return lineTotalCents(price, quantity) % 100;
}

export function formatQty(qty: number) {
  return qty.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export function parseQtyInput(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "");
  return Number(digits || "0") / 1000;
}

export function parseScaleBarcode(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits.startsWith("2") || digits.length !== 13) return null;

  const productCode = digits.slice(1, 6);
  const weightDigits = digits.slice(7, 12);
  const weightQty = Number(weightDigits) / 1000;

  if (!productCode || Number.isNaN(weightQty) || weightQty <= 0) return null;

  return {
    productCode,
    weightQty: Number(weightQty.toFixed(3)),
  };
}

export function getDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);

  return d
    .toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");
}

export function getTodayDate() {
  const d = new Date();
  d.setDate(d.getDate());

  return d
    .toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");
}
