export default function Loading() {
  return (
    <section className="mt-6 animate-pulse">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-16 rounded bg-zinc-200" />
        <div className="h-6 w-20 rounded bg-zinc-200" />
      </div>

      <div className="sm:flex justify-between">
        <div className="h-14 w-36 rounded bg-zinc-200" />
        <div className="flex flex-col px-1 pt-1 items-center">
          <div className="relative mt-2 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-full sm:w-140 h-130 border border-zinc-200">
            <div className="absolute top-5 h-4 w-40 rounded bg-zinc-200" />

            <div className="mt-10 sm:mt-10 h-12 w-52 rounded bg-zinc-200" />
            <div className="mt-2 h-5 w-36 rounded bg-zinc-200" />

            <div className="mt-5 h-5 w-28 rounded bg-zinc-200" />

            <div className="space-y-4 mt-8 w-full sm:w-100">
              <div className="h-4 w-full rounded bg-zinc-200" />
              <div className="h-4 w-full rounded bg-zinc-200" />
              <div className="h-4 w-full rounded bg-zinc-200" />
              <div className="h-4 w-full rounded bg-zinc-200" />
              <div className="h-4 w-full rounded bg-zinc-200" />
            </div>

            <div className="relative mt-4 w-full sm:w-100 px-2 py-3 flex flex-col gap-1">
              <div className="h-4 w-full rounded bg-zinc-200" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="h-5 w-20 rounded bg-zinc-200" />
        <div className="h-4 w-10 rounded bg-zinc-200" />
      </div>
    </section>
  );
}
