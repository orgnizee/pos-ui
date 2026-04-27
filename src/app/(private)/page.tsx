import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex flex-col mt-16">
      <Link href={"/pdv"} className="text-8xl font-light">
        <span className="text-2xl">1</span>
        pdv
      </Link>

      <Link href={"/caixa"} className="text-8xl font-light">
        <span className="text-2xl">2</span>
        caixa
      </Link>

      <Link href={"/fiados"} className="text-8xl font-light">
        <span className="text-2xl">3</span>
        fiados
      </Link>

      <Link href={"/contatos"} className="text-8xl font-light">
        <span className="text-2xl">4</span>
        contatos
      </Link>

      <Link href={"/vendas"} className="text-8xl font-light">
        <span className="text-2xl">5</span>
        vendas
      </Link>

      <Link href={"/produtos"} className="text-8xl font-light">
        <span className="text-2xl">6</span>
        produtos
      </Link>
    </main>
  );
}
