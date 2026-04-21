import BackButton from "@/components/backButton";
import { isApiError } from "@/lib/api/types";
import { getAccountByID } from "@/lib/api/bank-accounts";
import { UpdateBankAccountForm } from "@/components/bankAccountForm";

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
