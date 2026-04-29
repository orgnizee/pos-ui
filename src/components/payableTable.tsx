"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import { Account } from "@/lib/api/bankAccounts";
import { SelectInputField } from "./inputFieldSelect";
import { Payable, PaymentStatus } from "@/lib/api/payables";
import { SettleBatchPayableActionState, settleBatchPayablesAction } from "@/lib/api/actions/settlePayable";

interface PayableTableProps {
  payables: Payable[];
  basePath: string;
  accounts: Account[];
}

const statusDot: Record<PaymentStatus, string> = {
  pending: "bg-primary",
  paid: "bg-green-500",
  overdue: "bg-red-500",
  partially_paid: "bg-orange-400",
};

const selectableStatuses: PaymentStatus[] = [
  "pending",
  "overdue",
  "partially_paid",
];

export default function PayaableTable({
  payables,
  basePath,
  accounts,
}: PayableTableProps) {
  const grouped = groupByIssuedDate(
    [...payables].sort(
      (a, b) =>
        new Date(a.issued_at).getTime() - new Date(b.issued_at).getTime(),
    ),
  );

  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openBatchModal, setOpenBatchModal] = useState(false);
  const [batchState, batchAction, pendingBatch] = useActionState<
    SettleBatchPayableActionState,
    FormData
  >(settleBatchPayablesAction, null);

  const selectedReceivables = useMemo(
    () =>
      payables.filter(
        (payable) =>
          selectedIds.includes(payable.id) &&
          selectableStatuses.includes(payable.status),
      ),
    [payables, selectedIds],
  );

  const totalSelected = selectedReceivables
    .reduce(
      (sum, payable) => sum + parseFloat(payable.outstanding_balance),
      0,
    )
    .toFixed(2);

  useEffect(() => {
    if (!batchState || batchState.error) return;

    printBatchReceipt(batchState.transactions);
    router.refresh();
  }, [batchState, router]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectedCount = selectedReceivables.length;

  return (
    <section className="mt-12">
      {selectedCount > 0 && (
        <div className="mb-6 border p-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase">
              {selectedCount}{" "}
              {selectedCount === 1 ? "selecionado" : "selecionados"}
            </p>

            <p className="text-sm">
              total a receber: {formatBRL(totalSelected)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpenBatchModal(true)}
            className="px-4 py-2 border text-xs uppercase cursor-pointer hover:bg-black hover:text-white"
          >
            receber e imprimir
          </button>
        </div>
      )}

      {Object.entries(grouped).map(([label, group]) => (
        <div key={label}>
          <p>{label}</p>
          <div className="mt-2 w-full overflow-hidden">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-10 sm:w-10" />
                <col className="w-32 sm:w-22" />
                <col className="hidden sm:table-column w-42" />
                <col className="w-22" />
                <col className="hidden sm:table-column w-32" />
                <col className="hidden sm:table-column w-28" />
                <col className="hidden sm:table-column w-52" />
              </colgroup>

              <thead>
                <tr className="text-xs uppercase text-left">
                  <th className=" border-secondary/50"></th>
                  <th className="px-2  border-secondary/50">Total</th>
                  <th className="hidden sm:table-cell px-2  border-secondary/50">
                    Cliente
                  </th>
                  <th className="px-2 pr-4 text-end sm:text-start  border-secondary/50">
                    pago
                  </th>
                  <th className="hidden sm:table-cell px-2 pr-4  border-secondary/50">
                    a pagar
                  </th>
                  <th className="hidden sm:table-cell px-2 pr-4  border-secondary/50">
                    Vencimento
                  </th>
                  <th className="hidden sm:table-cell pr-4 text-right  border-secondary/50">
                    Notas
                  </th>
                </tr>
              </thead>

              <tbody>
                {group.map((payable) => (
                  <tr
                    key={payable.id}
                    className="h-15 cursor-pointer"
                    onClick={() => router.push(`${basePath}/${payable.id}`)}
                  >
                    <td className="border-b border-secondary/50">
                      <div className="flex items-center gap-2">
                        {selectableStatuses.includes(payable.status) ? (
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(payable.id)}
                            onChange={() => toggleSelected(payable.id)}
                            onClick={(event) => event.stopPropagation()}
                            className="appearance-none w-4 h-4 border border-primary rounded-none cursor-pointer relative checked:bg-primary checked:border-primary checked:after:content-[''] checked:after:absolute checked:after:top-0.5 checked:after:left-1.25 checked:after:w-1 checked:after:h-2 checked:after:border checked:after:border-white checked:after:border-t-0 checked:after:border-l-0 checked:after:rotate-45"
                            aria-label={`selecionar fiado ${payable.id}`}
                          />
                        ) : (
                          <span className="w-4" />
                        )}
                        <div
                          className={`w-2 h-2 ${statusDot[payable.status]}`}
                        />
                      </div>
                    </td>
                    <td className="px-2 text-start border-b border-secondary/50">
                      {formatBRL(payable.total_amount)}
                    </td>
                    <td className="hidden sm:table-cell px-2 text-start border-b border-secondary/50">
                      {payable.contact.name ?? "-"}
                    </td>
                    <td className="hidden sm:table-cell px-2 pr-4 text-start border-b border-secondary/50">
                      {formatBRL(payable.amount_paid)}
                    </td>
                    <td className="px-2 pr-4 text-end sm:text-start border-b border-secondary/50">
                      {formatBRL(payable.outstanding_balance)}
                    </td>
                    <td className="hidden sm:table-cell px-2 pr-4 text-start border-b border-secondary/50">
                      {formatDateTime(payable.due_at)}
                    </td>
                    <td className="hidden sm:table-cell pr-4 text-right border-b border-secondary/50">
                      {payable.notes}
                    </td>
                  </tr>
                ))}
                <tr className="h-10"></tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {openBatchModal && selectedCount > 0 && (
        <BatchSettleModal
          accounts={accounts}
          selectedReceivables={selectedReceivables}
          onClose={() => setOpenBatchModal(false)}
          action={batchAction}
          pending={pendingBatch}
          state={batchState}
        />
      )}
    </section>
  );
}

function BatchSettleModal({
  accounts,
  selectedReceivables,
  onClose,
  action,
  pending,
  state,
}: {
  accounts: Account[];
  selectedReceivables: Payable[];
  onClose: () => void;
  action: (payload: FormData) => void;
  pending: boolean;
  state: SettleBatchPayableActionState;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const items = selectedReceivables.map((receivable) => ({
    id: receivable.id,
    amount: receivable.outstanding_balance,
  }));

  const total = items
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toFixed(2);

  const accountOptions = accounts.map((a) => ({
    label: a.name.toUpperCase(),
    value: String(a.id),
  }));

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-white/90"
    >
      <div className="w-full sm:w-120 border bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <p className="text-sm font-light uppercase tracking-widest text-primary">
            receber múltiplos fiados
          </p>
          <button
            onClick={onClose}
            className="text-tertiary hover:text-primary text-xs uppercase tracking-widest font-light"
          >
            cancelar
          </button>
        </div>

        <div className="px-6 pb-4 text-sm">
          <p>
            {selectedReceivables.length}{" "}
            {selectedReceivables.length === 1 ? "selecionado" : "selecionados"}
          </p>
          <p className="mt-1">total: {formatBRL(total)}</p>
        </div>

        <form action={action} className="px-6 pb-8 flex flex-col gap-4">
          <input type="hidden" name="items" value={JSON.stringify(items)} />

          <SelectInputField
            label="conta"
            name="account"
            required
            defaultValue=""
            options={accountOptions}
          />

          {state?.error && (
            <p className="text-xs font-light normal-case text-red-500">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || items.length === 0}
            className="w-full py-2 bg-black text-sm text-white uppercase cursor-pointer disabled:bg-white disabled:text-primary disabled:border"
          >
            confirmar e imprimir
          </button>
        </form>
      </div>
    </div>
  );
}

function printBatchReceipt(
  transactions: {
    id: string;
    amount: string;
    account: { name: string };
    contact: { name: string | null };
    timestamp: string;
    description: string;
  }[],
) {
  const printWindow = window.open("", "_blank", "width=420,height=720");
  if (!printWindow) return;

  const total = transactions
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)
    .toFixed(2);

  const rows = transactions
    .map(
      (transaction) => `
        <div style="margin-bottom: 10px; border-bottom: 1px dashed #999; padding-bottom: 8px;">
          <div style="display:flex; justify-content:space-between;"><span>cliente:</span><span>${transaction.contact.name ?? "-"}</span></div>
          <div style="display:flex; justify-content:space-between;"><span>conta:</span><span>${transaction.account.name.toLowerCase()}</span></div>
          <div style="display:flex; justify-content:space-between;"><span>valor:</span><span>${formatBRL(transaction.amount)}</span></div>
          <div style="display:flex; justify-content:space-between;"><span>data:</span><span>${formatDateTime(transaction.timestamp)}</span></div>
          <div style="text-align:center; justify-content:center;"><span>${transaction.description}</span></div>
        </div>
      `,
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>Comprovante de recebimentos</title>
      </head>
      <body style="font-family: monospace; font-size: 12px; width: 80mm; margin: 0 auto; padding: 8px;">
        <p style="text-align: center; font-size: 16px; margin: 4px 0; font-weight: bold;">FRIGORÍFICO SARAIVA</p>
        <p style="text-align: center; margin: 0 0 10px 0;">comprovante de recebimentos</p>
        ${rows}
        <div style="display:flex; justify-content:space-between; font-weight: bold; border-top: 1px dashed #999; padding-top: 8px;">
          <span>total</span>
          <span>${formatBRL(total)}</span>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

// const groupByDueDate = (receivables: Receivable[]) => {
//   const groups: Record<string, Receivable[]> = {};

//   const today = new Date();
//   const yesterday = new Date();
//   yesterday.setDate(today.getDate() - 1);

//   const isSameDay = (a: Date, b: Date) =>
//     a.getDate() === b.getDate() &&
//     a.getMonth() === b.getMonth() &&
//     a.getFullYear() === b.getFullYear();

//   for (const receivable of receivables) {
//     const [year, month, day] = receivable.due_at
//       .split("T")[0]
//       .split("-")
//       .map(Number);
//     const date = new Date(year, month - 1, day); // local time, no UTC shift

//     let label: string;
//     if (isSameDay(date, today)) {
//       label = "hoje";
//     } else if (isSameDay(date, yesterday)) {
//       label = "ontem";
//     } else {
//       label = date
//         .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
//         .replace(".", "")
//         .replace(/^\w/, (c) => c.toUpperCase());
//     }

//     if (!groups[label]) groups[label] = [];
//     groups[label].push(receivable);
//   }

//   return groups;
// };

const groupByIssuedDate = (payables: Payable[]) => {
  const groups: Record<string, Payable[]> = {};

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  for (const payable of payables) {
    const [year, month, day] = payable.issued_at
      .split("T")[0]
      .split("-")
      .map(Number);
    const date = new Date(year, month - 1, day); // local time, no UTC shift

    let label: string;
    if (isSameDay(date, today)) {
      label = "hoje";
    } else if (isSameDay(date, yesterday)) {
      label = "ontem";
    } else {
      label = date
        .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        .replace(".", "")
        .replace(/^\w/, (c) => c.toUpperCase());
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(payable);
  }

  return groups;
};
