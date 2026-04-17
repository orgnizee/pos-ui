import { getUser } from "@/lib/api/user";
import { isApiError } from "@/lib/api/types";
import { getTotalBalance } from "@/lib/api/bank-accounts";
import { formatBRL } from "@/lib/utils/format";
import MainHomeCard from "@/components/main-home-cards";

export default async function Home() {
  const res = await getUser();
  const totalBalance = await getTotalBalance();
  let name = "";

  if (!isApiError(res)) {
    name = res.username;
  }

  if (isApiError(totalBalance)) {
    return <p className="ml-4 sm:ml-10">{totalBalance.message}</p>;
  }

  return (
    <main className="ml-4 mr-1 sm:ml-10">
      <h1 className="ml-1 mt-8 text-4xl sm:text-5xl text-start normal-case">
        oi, @{name}
      </h1>

      <div className="grid sm:grid-cols-4 gap-2 grid-cols-2 mb-6 sm:mb-5 mr-2 sm:mr-10">
        {/* Full width on mobile, 3-cols on sm */}
        <div className="col-span-2 sm:col-span-3 grid pt-1 pb-2 font-bold">
          <MainHomeCard
            title="saldo em caixa"
            description={[formatBRL(totalBalance.total_balance)]}
            notes="s"
            link="/caixa"
          />
        </div>

        {/* 1 col on mobile, 1 col on sm — sits beside nothing on mobile row */}
        <div className="grid pt-1 pb-2 font-bold">
          <MainHomeCard
            title="vendas hoje"
            description={["01"]}
            notes="v"
            link="/entrar"
          />
        </div>

        {/* These two will naturally pair side-by-side on mobile */}
        <div className="grid pt-1 pb-2 font-bold">
          <MainHomeCard
            title="a receber"
            description={["fiados"]}
            notes="r"
            link="/receber"
          />
        </div>

        <div className="grid pt-1 pb-2 font-bold">
          <MainHomeCard
            title="contas"
            description={["pagar"]}
            notes="p"
            link="/pagar"
          />
        </div>

        {/* Full width on mobile */}
        <div className="col-span-2 sm:col-span-1 grid pt-1 pb-2 font-bold">
          <MainHomeCard
            title="pesquisar"
            description={["contatos"]}
            notes="c"
            link="/contatos"
          />
        </div>

        <div className="col-span-2 sm:col-span-1 grid pt-1 pb-2 font-bold">
          <MainHomeCard
            title="pesquisar"
            description={["produtos"]}
            notes="s"
            link="/"
          />
        </div>
      </div>

      {/* <div className="overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex px-1 pt-1 pb-2 gap-4 font-bold">
            <Card
              title="pesquisar"
              description={["contatos"]}
              notes="cadastar • editar"
              link="/contatos"
            />

            <Card
              title="pesquisar"
              description={["produtos"]}
              notes="cadastar • editar"
              link="/"
            />
          </div>
        </div>
      </div> */}

      {/* <div className="relative h-10 w-full block sm:hidden">
        <ArrowRight
          className="absolute right-0 h-full text-secondary"
          strokeWidth={0.5}
        />
      </div> */}
    </main>
  );
}
