import BackButton from "@/components/back-button";
import { isApiError } from "@/lib/api/types";
import { getAccountByID } from "@/lib/api/bank-accounts";
import { UpdateBankAccountForm } from "@/components/bank-account-form";

export default async function UpdateBankAccount({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await getAccountByID(id);

  if (isApiError(account)) {
    return <p>{account.message}</p>;
  }

  return (
    <section>
      <BackButton />
      <div className="flex flex-col mr-3 sm:mr-0 mt-10 sm:mt-8 px-1 pt-1 items-center font-bold">
        <div className="relative ml-auto mr-auto flex items-start justify-start w-full sm:w-150">
          <p className="text-6xl text-start font-light normal-case">
            {account.name.toLowerCase()}
          </p>
        </div>
        <div className="mt-2 py-8 sm:py-0 relative ml-auto mr-auto flex items-center justify-center w-full min-h-65 sm:w-150 sm:min-h-95 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
          <UpdateBankAccountForm account={account} />
        </div>
      </div>
    </section>
  );
}
