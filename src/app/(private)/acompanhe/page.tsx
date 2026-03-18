import ArrowRight from "@/icons/ArrowRight";

export default function Acompanhe() {
  return (
    <main>
      {/* HEADER */}
      <p className="ml-2 text-sm normal-case">
        Acompanhe o andamento do seu projeto
      </p>

      <div className="mt-8 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex px-1 pt-1 pb-5 gap-4 font-bold items-center">
            <div className="flex items-center justify-center w-fit h-fit px-1 py-0.5 pt-1 shrink-0 rounded-md bg-secondary/20 overflow-hidden">
              <p className="text-center text-sm normal-case font-light">
                01 de abril • 2026
              </p>
            </div>
            <div className="relative flex items-center justify-center min-w-77 min-h-45 sm:min-w-100 sm:min-h-55 shrink-0 rounded-full bg-secondary/10 overflow-hidden">
              <p className="text-center text-secondary">
                diagnóstico & pesquisa
              </p>
              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center px-2.5 py-1 text-sm normal-case font-light text-tertiary">
                10 a 20 dias
              </p>
            </div>
            <div className="relative flex items-center justify-center min-w-107 min-h-45 sm:min-w-150 sm:min-h-55 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
              <p className="text-center text-secondary">desenvolvimento</p>
              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center px-2.5 py-1 text-sm normal-case font-light text-tertiary">
                30 a 40 dias
              </p>
            </div>
            <div className="relative flex items-center justify-center min-w-127 min-h-45 sm:min-w-200 sm:min-h-55 shrink-0 rounded-full bg-secondary/10 overflow-hidden">
              <p className="text-center text-secondary">implementação</p>
              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center px-2.5 py-1 text-sm normal-case font-light text-tertiary">
                50 a 60 dias
              </p>
            </div>
            <div className="relative flex items-center justify-center min-w-77 min-h-45 sm:min-w-150 sm:min-h-55 shrink-0 rounded-md bg-secondary/10 overflow-hidden">
              <p className="text-center text-secondary">refinamento</p>
              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center px-2.5 py-1 text-sm normal-case font-light text-tertiary">
                tempo necessário
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-10 w-full">
        <ArrowRight
          className="absolute right-0 h-full text-secondary"
          strokeWidth={0.5}
        />
      </div>
    </main>
  );
}
