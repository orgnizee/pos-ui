import BackButton from "@/components/back-button";
import { getFinanceCategories } from "@/lib/api/finance-category";
import { isApiError } from "@/lib/api/types";
import { Plus } from "lucide-react";
import Link from "next/link";

const GROUP_NAMES = ["receitas", "despesas"];

export default async function CategoriesPage() {
  const categories = await getFinanceCategories();
  if (isApiError(categories)) {
    return <p>{categories.message}</p>;
  }

  const parents = categories.filter((c) =>
    GROUP_NAMES.includes(c.name.toLowerCase()),
  );

  const childrenOf = (parentId: number | string) =>
    categories.filter(
      (c) => c.parent !== null && String(c.parent.id) === String(parentId),
    );

  const orphans = categories.filter(
    (c) => c.parent === null && !GROUP_NAMES.includes(c.name.toLowerCase()),
  );

  return (
    <section>
      <BackButton />
      <div className="flex flex-col mr-3 sm:mr-0 mt-10 sm:mt-8 px-1 pt-1 items-center font-bold">
        <div className="relative ml-auto mr-auto flex items-end justify-end w-full sm:w-150">
          <Link
            href={"/financeiro/categorias/adicionar"}
            className="items-center justify-center flex bg-secondary/20 w-8 h-8 rounded-full"
          >
            <Plus strokeWidth={1.2} className="text-tertiary" />
          </Link>
        </div>
      </div>

      {parents.map((parent) => (
        <div key={parent.id} className="mr-3 sm:mr-0">
          <div className="relative mt-8 ml-auto mr-auto flex items-start justify-start w-full sm:w-150">
            <p className="text-6xl text-start font-light normal-case">
              {parent.name.toLowerCase()}
            </p>
          </div>
          <div className="mt-2 mb-8 relative ml-auto mr-auto flex flex-col items-start justify-start w-full sm:w-150 h-fit shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
            <ul className="w-full px-6 py-6">
              {childrenOf(parent.id).map((c) => (
                <li
                  key={c.id}
                  className="py-2.5 text-3xl normal-case font-light border-b border-tertiary/10 last:border-none"
                >
                  {c.name.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {orphans.length > 0 && (
        <div>
          <div className="relative mt-8 ml-auto mr-auto flex items-start justify-start w-full sm:w-150">
            <p className="text-6xl text-start font-light normal-case">ocultas</p>
          </div>
          <div className="mt-2 mb-8 relative ml-auto mr-auto flex flex-col items-start justify-start w-full h-fit sm:w-150 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
            <ul className="w-full px-6 py-6">
              {orphans.map((c) => (
                <li
                  key={c.id}
                  className="py-2.5 text-3xl normal-case font-light border-b border-tertiary/10 last:border-none"
                >
                  {c.name.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
