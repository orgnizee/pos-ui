import Card from "@/components/card";
import ArrowRight from "@/icons/ArrowRight";
import { getUser } from "@/lib/api/user";
import { isApiError } from "@/lib/api/types";
import { getTotalBalance } from "@/lib/api/bank-accounts";
import { formatBRL } from "@/lib/utils/format";

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

      <div className="overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex px-1 pt-1 pb-5 gap-4 font-bold">
            <Card
              title="vendas hoje"
              description={["01"]}
              year="fazer venda"
              where=""
              link="/entrar"
            />

            <Card
              title="saldo em caixa"
              description={[formatBRL(totalBalance.total_balance)]}
              year="ver caixa"
              where=""
              link="/caixa"
            />

            <Card
              title="a receber"
              description={["fiados"]}
              year="ver contas a receber"
              where=""
              link="/receber"
            />

            <Card
              title="a pagar"
              description={["contas"]}
              year="ver contas a pagar"
              where=""
              link="/pagar"
            />

            <Card
              title="clientes & fornecedores"
              description={["pesquisar"]}
              year="cadastar • editar"
              where=""
              link="/contatos"
            />

            <Card
              title="produtos"
              description={["pesquisar"]}
              year="cadastar • editar"
              where=""
              link="/termos"
            />
          </div>
        </div>
      </div>

      <div className="relative h-10 w-full block sm:hidden">
        <ArrowRight
          className="absolute right-0 h-full text-secondary"
          strokeWidth={0.5}
        />
      </div>
    </main>
  );
}
