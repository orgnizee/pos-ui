export default function Loading() {
  return (
    <section className="mt-6 mb-4">
      <div className="mt-6 mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-12 mr-2" />
      </div>

      <div className="sm:flex flex-col px-1 pt-1 items-center">
        <div className="relative mt-2 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-full sm:w-140 h-fit border">
          
          <Skeleton className="absolute top-5 h-4 w-16" />

          <Skeleton className="mt-10 sm:mt-12 h-8 w-60" />
          <Skeleton className="mt-2 h-4 w-32" />

          <div className="mt-5 w-fit h-fit border-b border-secondary/50">
            <Skeleton className="py-0.5 h-3 w-20" />
          </div>

          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-full sm:w-100">
              <div className="relative h-5 py-4 flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <hr className="border-t border-tertiary/25 w-full" />
            </div>
          ))}

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Skeleton className="h-9 w-40" />
      </div>
    </section>
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