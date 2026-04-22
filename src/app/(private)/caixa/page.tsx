import TransactionTable from "@/components/transactionTable";
import { getAccounts, getTotalBalance } from "@/lib/api/bankAccounts";
import { getTransactions } from "@/lib/api/transaction";
import { isApiError } from "@/lib/api/types";
import { formatBRL } from "@/lib/utils/format";
import buildFilterHref from "@/lib/utils/search-params";
import { ArrowRightLeft, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { filterClass } from "../../../lib/styleFilterButtons";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import SearchInput from "@/components/searchInput";
import Pagination from "@/components/pagination";
import SelectTypeInput from "@/components/selecTypeInput";
import SelectCategoryInput from "@/components/selectCategoryInput";
import SelectBankAccountInput from "@/components/SelectBankAccountInput";

export default async function CaixaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const accounts = await getAccounts();
  const categories = await getFinanceCategories();
  const totalBalance = await getTotalBalance();

  const resolvedParams = await searchParams;

  const { bank, date, type, search, category, inativas } = resolvedParams;
  const isAll = !date && !type && !bank && !category;
  const isToday = date === "today";
  const isWeek = date === "week";
  const isMonth = date === "month";

  const transactions = await getTransactions({
    ...(typeof bank === "string" && { bank }),
    ...(typeof date === "string" && { date }),
    ...(typeof type === "string" && { type }),
    ...(typeof search === "string" && { search }),
    ...(typeof category === "string" && { category }),
  });

  if (isApiError(accounts)) {
    return <p>{accounts.message}</p>;
  }

  if (isApiError(categories)) {
    return <p>{categories.message}</p>;
  }

  if (isApiError(totalBalance)) {
    return <p>{totalBalance.message}</p>;
  }

  if (isApiError(transactions)) {
    return <p>{transactions.message}</p>;
  }

  const showAllAccount = inativas === "true";
  const filtered = showAllAccount
    ? accounts
    : accounts.filter((a) => a.is_active);

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-8xl font-light">caixa</h1>

        {/* Add Transaction Buttons */}
        <div className="flex gap-2">
          <Link
            href={"caixa/entrada"}
            className="flex w-10 h-10 items-center justify-center border border-primary hover:border-tertiary"
          >
            <Plus className="text-primary" size={16} />
          </Link>
          <Link
            href={"caixa/saida"}
            className="flex w-10 h-10 items-center justify-center border border-primary hover:border-tertiary"
          >
            <Minus className="text-primary" size={16} />
          </Link>
          <Link
            href={"caixa/transferencia"}
            className="flex w-10 h-10 items-center justify-center border border-primary hover:border-tertiary"
          >
            <ArrowRightLeft className="text-primary" size={16} />
          </Link>
        </div>
      </div>

      {/* Saldo Total */}
      <div className="ml-1">
        <p className="mt-8 text-start text-lg font-light">saldo total</p>
        <p className="text-start text-5xl font-normal">
          {formatBRL(totalBalance.total_balance)}
        </p>
      </div>

      {/* Show All Accounts */}
      <Link
        href={showAllAccount ? "/caixa" : "/caixa?inativas=true"}
        className="flex mt-8 ml-1 w-fit h-fit"
      >
        <div className="text-tertiary text-xs">
          {showAllAccount ? <p>todas</p> : <p>ativas</p>}
        </div>
      </Link>

      {/* Bank Account Cards */}
      <div className="overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex px-1 pt-1 pb-5 gap-4 font-bold items-center">
            {filtered.map((account) => (
              <Link
                href={`/caixa/conta/${account.id}`}
                key={account.id}
                className={`relative flex items-center justify-center min-w-50 min-h-55 shrink-0 overflow-hidden border ${!account.is_active ? "border-secondary text-secondary" : "border-primary text-primary"}`}
              >
                <p
                  className={`text-center text-xl font-normal ${Number(account.balance) < 0 && "text-red-500"}`}
                >
                  {account.is_active ? formatBRL(account.balance) : "/"}
                </p>
                <p
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-2.5 py-1 text-center text-lg normal-case font-light`}
                >
                  {account.name.toLowerCase()}
                </p>
              </Link>
            ))}

            <Link
              href={"/caixa/conta"}
              className={`relative flex items-center justify-center min-w-50 min-h-55 shrink-0 overflow-hidden`}
            >
              <div className="text-primary">
                <Plus strokeWidth={0.8} size={35} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-8 text-start text-lg font-light">histórico</p>

      {/* Filter Date */}
      <div className="flex overflow-x-auto scrollbar-hidden gap-6 pt-1 pb-5 justify-start items-center text-center">
        <Link scroll={false} href="/caixa" className="shrink-0 block">
          <p className={filterClass(isAll)}>tudo</p>
        </Link>

        <Link
          scroll={false}
          href={buildFilterHref(resolvedParams, { date: "today" })}
          className="shrink-0 block"
        >
          <p className={filterClass(isToday)}>hoje</p>
        </Link>

        <Link
          scroll={false}
          href={buildFilterHref(resolvedParams, { date: "week" })}
          className="shrink-0 block"
        >
          <p className={filterClass(isWeek)}>essa semana</p>
        </Link>

        <Link
          scroll={false}
          href={buildFilterHref(resolvedParams, { date: "month" })}
          className="shrink-0 block"
        >
          <p className={filterClass(isMonth)}>esse mês</p>
        </Link>
      </div>

      <div className="flex justify-end mt-4 mr-3">
        <SearchInput endpoint="caixa" />
      </div>

      {/* Filter Fields */}
      <div className="flex w-full">
        <div className="ml-auto mt-4 mr-3 w-fit flex flex-col gap-3">
          <SelectTypeInput />
          <SelectCategoryInput categories={categories} />
          <SelectBankAccountInput accounts={accounts} />
        </div>
      </div>

      {/* Transaction History */}
      <TransactionTable
        transactions={transactions.results.map((r) => r.transaction)}
      />

      <Pagination count={transactions.count} />
    </section>
  );
}
