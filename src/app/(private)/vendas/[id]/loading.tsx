export default function Loading() {
  return (
    <section className="mt-6 mb-4 animate-pulse">
      <div className="no-print">
        <div className="mt-6 mb-4 flex items-center justify-between">
          <div className="h-6 w-16 rounded bg-zinc-200" />

          <div className="flex items-center gap-3">
            <div className="h-6 w-8 rounded bg-zinc-200" />
            <div className="h-4 w-10 rounded bg-zinc-200" />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="h-14 w-36 rounded bg-zinc-200" />
          <div className="flex flex-col px-1 pt-1 items-center">
            <div className="relative mt-2 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-140 h-fit border border-zinc-200">
              <div className="absolute top-5 h-4 w-44 rounded bg-zinc-200" />

              <div className="mt-10 sm:mt-12 h-11 w-72 rounded bg-zinc-200" />
              <div className="mt-2 h-5 w-36 rounded bg-zinc-200" />

              <div className="mt-5 h-5 w-40 rounded bg-zinc-200" />

              <div className="relative w-full sm:w-100 h-5 mt-8 py-4 flex items-center justify-between">
                <div className="h-4 w-20 rounded bg-zinc-200" />
                <div className="h-4 w-24 rounded bg-zinc-200" />
              </div>
              <hr className="border-t border-zinc-200 w-full sm:w-100" />

              <div className="space-y-4 mt-4 w-full sm:w-100">
                <div className="h-4 w-full rounded bg-zinc-200" />
                <div className="h-4 w-full rounded bg-zinc-200" />
                <div className="h-4 w-full rounded bg-zinc-200" />
              </div>

              <div className="relative mt-6 w-full sm:w-100 py-3 flex flex-col gap-2 border-t border-zinc-200">
                <div className="h-3 w-14 rounded bg-zinc-200" />
                <div className="h-4 w-full rounded bg-zinc-200" />
                <div className="h-4 w-full rounded bg-zinc-200" />
              </div>

              <div className="relative mt-2 w-full sm:w-100 py-3 flex flex-col gap-2 border-t border-zinc-200">
                <div className="h-3 w-24 rounded bg-zinc-200" />
                <div className="h-4 w-full rounded bg-zinc-200" />
                <div className="h-4 w-full rounded bg-zinc-200" />
              </div>

              <div className="relative mt-4 w-full sm:w-100 px-2 py-3 flex flex-col gap-1 border-t border-zinc-200">
                <div className="h-4 w-full rounded bg-zinc-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 h-5 w-20 rounded bg-zinc-200" />
      </div>
    </section>
  );
}
