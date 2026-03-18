import { getAccounts } from "@/lib/api/bank-accounts";
import { isApiError } from "@/lib/api/types";
import { formatBRL } from "@/lib/utils/format";

export default async function Acompanhe() {
  const res = await getAccounts();

  if (isApiError(res)) {
    return <p>{res.message}</p>;
  }

  return (
    <main className="ml-4 mr-1 sm:ml-10">
      <h1 className="ml-1 mt-8 text-5xl sm:text-6xl text-start normal-case">
        caixa
      </h1>

      <div className="mt-8 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex px-1 pt-1 pb-5 gap-4 font-bold items-center">
            <div className="flex items-center justify-center w-40 h-fit px-1 py-0.5 pt-1 shrink-0 rounded-md bg-secondary/20 overflow-hidden">
              <p className="text-center text-sm normal-case">R$ 1.2350,00</p>
            </div>

            {res.map((account) => (
              <div
                key={account.id}
                className="relative flex items-center justify-center min-w-77 min-h-45 sm:min-w-100 sm:min-h-55 shrink-0 rounded-full bg-secondary/10 overflow-hidden"
              >
                <p className="text-center text-2xl text-tertiary">
                  {formatBRL(account.balance)}
                </p>
                <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center px-2.5 py-1 text-sm normal-case font-light text-tertiary">
                  {account.name.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
