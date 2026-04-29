export default function Loading() {
  return (
    <section className="mt-6">
      {/* back */}
      <Skeleton className="h-5 w-20" />

      {/* title */}
      <Skeleton className="mt-8 h-12 w-80" />

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <ReceivableFormSkeleton />
      </div>
    </section>
  );
}

function ReceivableFormSkeleton() {
  return (
    <div className="w-full max-w-4xl mt-12 mb-6">
      {/* VALOR */}
      <div className="mb-8">
        <Skeleton className="h-3 w-16 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* INFORMAÇÕES */}
      <div className="mb-8">
        <Skeleton className="h-3 w-28 mb-4" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* RECORRÊNCIA */}
      <div className="mb-8">
        <Skeleton className="h-3 w-32 mb-4" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          {/* tipo */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-9 w-full" />
          </div>

          {/* dynamic fields placeholder (simulate max case = installments) */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* OBSERVAÇÕES */}
      <div className="mb-8">
        <Skeleton className="h-3 w-32 mb-4" />
        <Skeleton className="h-20 w-full" />
      </div>

      {/* SUBMIT */}
      <div className="mt-10 w-full">
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-gray-200/70 ${className}`}
    >
      <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
