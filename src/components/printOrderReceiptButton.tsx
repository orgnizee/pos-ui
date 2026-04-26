"use client";

export default function PrintOrderReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-xs cursor-pointer mr-2 uppercase"
    >
      imprimir
    </button>
  );
}
