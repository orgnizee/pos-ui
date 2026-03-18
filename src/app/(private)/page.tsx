import Card from "@/components/card";
import ArrowRight from "@/icons/ArrowRight";
import { getUser } from "@/lib/api/user";
import { isApiError } from "@/lib/api/types";

export default async function Home() {
  const res = await getUser();
  let name = "";

  if (!isApiError(res)) {
    name = res.username;
  }

  return (
    <main>
      <h1 className="ml-1 mt-8 text-5xl sm:text-6xl text-start normal-case">
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
              description={["R$1.230,00"]}
              year="ver caixa"
              where=""
              link="/caixa"
            />

            <Card
              title="clientes & fornecedores"
              description={["pesquisar"]}
              year="cadastar • editar"
              where=""
              link="/termos"
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
