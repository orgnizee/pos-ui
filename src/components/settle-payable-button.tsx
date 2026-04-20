"use client";

import { useState } from "react";
import { Account } from "@/lib/api/bank-accounts";
import { DollarSign } from "lucide-react";
import SettlePayableModal from "./settle-payable-modal";
import { Payable } from "@/lib/api/payable";

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
        className="mt-5 w-5 h-7 flex justify-center items-center rounded-full bg-green-600 disabled:opacity-50 cursor-pointer"
      >
        <DollarSign
          strokeWidth={1.5}
          size={15}
          className="text-white translate-y-px"
        />
      </button>

      {open && (
        <SettlePayableModal
          payable={payable}
          accounts={accounts}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
