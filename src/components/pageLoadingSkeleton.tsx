type PageLoadingSkeletonProps = {
  variant?: "default" | "private" | "public";
};

export default function PageLoadingSkeleton({
  variant = "default",
}: PageLoadingSkeletonProps) {
  if (variant === "public") {
    return (
      <main className="animate-pulse py-6 sm:px-10">
        <header className="p-2">
          <div className="mx-auto h-4 w-28 sm:w-36 rounded bg-zinc-200" />
        </header>

        <section className="mt-8 w-full sm:mx-auto sm:max-w-md rounded border border-zinc-100 p-4 sm:p-6">
          <div className="mb-5 h-6 w-32 sm:h-8 sm:w-44 rounded bg-zinc-200" />

          <div className="space-y-3">
            <div className="h-10 sm:h-11 rounded bg-zinc-100" />
            <div className="h-10 sm:h-11 rounded bg-zinc-100" />
          </div>

          <div className="mt-5 h-10 sm:h-11 rounded bg-zinc-200" />
        </section>
      </main>
    );
  }

  return (
    <main className="animate-pulse py-6 sm:p-6">
      <div className="w-full sm:mx-auto sm:max-w-6xl flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <header className="grid grid-cols-3 items-center">
          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded bg-zinc-200" />
          <div className="mx-auto h-5 w-28 sm:h-6 sm:w-36 rounded bg-zinc-200" />
          <div className="ml-auto h-5 w-5 sm:h-6 sm:w-6 rounded bg-zinc-200" />
        </header>

        {/* Cards */}
        <section className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-20 sm:h-24 rounded border border-zinc-100 bg-zinc-100" />
          <div className="h-20 sm:h-24 rounded border border-zinc-100 bg-zinc-100" />
          <div className="h-20 sm:h-24 rounded border border-zinc-100 bg-zinc-100" />
        </section>

        {/* List */}
        <section className="rounded border border-zinc-100 p-3 sm:p-4">
          <div className="mb-4 h-6 w-40 sm:h-7 sm:w-64 rounded bg-zinc-200" />

          <div className="space-y-2 sm:space-y-3">
            <div className="h-10 sm:h-11 rounded bg-zinc-100" />
            <div className="h-10 sm:h-11 rounded bg-zinc-100" />
            <div className="h-10 sm:h-11 rounded bg-zinc-100" />
            <div className="h-10 sm:h-11 rounded bg-zinc-100" />
            <div className="h-10 sm:h-11 rounded bg-zinc-100" />
          </div>
        </section>
      </div>
    </main>
  );
}
