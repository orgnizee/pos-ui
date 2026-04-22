"use client";

import { useState } from "react";
import { Receivable } from "@/lib/api/receivables";
import { Account } from "@/lib/api/bankAccounts";
import SettlePaymentModal from "./settleReceivableModal";

export default function SettleButton({
  receivable,
  accounts,
}: {
  receivable: Receivable;
  accounts: Account[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 ml-1 flex justify-start items-center cursor-pointer uppercase text-xs"
      >
        receber
      </button>

      {open && (
        <SettlePaymentModal
          payment={receivable}
          accounts={accounts}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
