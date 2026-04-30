"use client";

import { useState } from "react";
import { Account } from "@/lib/api/bankAccounts";
import { Payable } from "@/lib/api/payables";
import SettlePayableModal from "./settlePayableModal";

export default function SettlePayableButton({
  payable,
  accounts,
}: {
  payable: Payable;
  accounts: Account[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 ml-1 flex justify-start items-center cursor-pointer uppercase text-xs"
      >
        pagar
      </button>

      {open && (
        <SettlePayableModal
          payment={payable}
          accounts={accounts}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
