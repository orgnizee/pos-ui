import { Suspense } from "react";
import BackButton from "@/components/backButton";
import { isApiError } from "@/lib/api/types";
import { getAccountByID } from "@/lib/api/bankAccounts";
import { UpdateBankAccountForm } from "@/components/bankAccountForm";
import Loading from "./loading";

export async function UpdateBankAccountPayload({ id }: { id: string }) {
  const account = await getAccountByID(id);

  if (isApiError(account)) {
    return <p>{account.message}</p>;
  }

  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">
        {account.name.toLowerCase()}
      </p>

      <div className="flex flex-col items-center">
        <div className="mt-2 relative ml-auto mr-auto flex items-center justify-center sm:w-150 sm:min-h-95">
          <UpdateBankAccountForm account={account} />
        </div>
      </div>
    </section>
  );
}

export default async function UpdateBankAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="mt-6">
      <div className="no-print">
        <Suspense fallback={<Loading />}>
          <UpdateBankAccountPayload id={id} />
        </Suspense>
      </div>
    </section>
  );
}