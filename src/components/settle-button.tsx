"use client";

import { useState } from "react";
import { Payment } from "@/lib/api/payments";
import { Account } from "@/lib/api/bank-accounts";
import SettlePaymentModal from "./settle-payment-moda";
import { DollarSign } from "lucide-react";

export default function SettleButton({
  payment,
  accounts,
}: {
  payment: Payment;
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
        <SettlePaymentModal
          payment={payment}
          accounts={accounts}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
