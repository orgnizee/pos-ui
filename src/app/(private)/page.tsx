import { isApiError } from "@/lib/api/types";
import { getUser } from "@/lib/api/user";
import Link from "next/link";

export default async function Home() {
  const user = await getUser();

  if (isApiError(user)) {
    return;
  }

  return (
    <main className="flex flex-col mt-12 text-6xl sm:text-8xl font-light">
      {user.username !== "hugo" && (
        <>
          <Link href={"/pdv"}>
            <span className="text-2xl">1</span>
            pdv
          </Link>

          <Link href={"/caixa"}>
            <span className="text-2xl">2</span>
            caixa
          </Link>

          <Link href={"/fiados"}>
            <span className="text-2xl">3</span>
            fiados
          </Link>

          <Link href={"/contatos"}>
            <span className="text-2xl">4</span>
            contatos
          </Link>

          <Link href={"/vendas"}>
            <span className="text-2xl">5</span>
            vendas
          </Link>

          <Link href={"/produtos"}>
            <span className="text-2xl">6</span>
            produtos
          </Link>
        </>
      )}
      {user.username === "hugo" && (
        <>
          <Link href={"/caixa"}>
            <span className="text-2xl">2</span>
            caixa
          </Link>

          <Link href={"/fiados"}>
            <span className="text-2xl">3</span>
            recer
          </Link>

          <Link href={"/pagamentos"}>
            <span className="text-2xl">4</span>
            pagar
          </Link>

          <Link href={"/contatos"}>
            <span className="text-2xl">5</span>
            contatos
          </Link>
        </>
      )}
    </main>
  );
}
