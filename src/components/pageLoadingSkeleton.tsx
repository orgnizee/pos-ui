type PageLoadingSkeletonProps = {
  variant?: "default" | "private" | "public";
};

export default function PageLoadingSkeleton({
  variant = "default",
}: PageLoadingSkeletonProps) {
  if (variant === "public") {
    return (
      <main className="animate-pulse p-4 sm:px-10">
        <header className="p-2">
          <div className="mx-auto h-4 w-36 rounded bg-zinc-200" />
        </header>

        <section className="mx-auto mt-10 w-full max-w-md rounded border border-zinc-100 p-6">
          <div className="mb-5 h-8 w-44 rounded bg-zinc-200" />
          <div className="space-y-3">
            <div className="h-11 rounded bg-zinc-100" />
            <div className="h-11 rounded bg-zinc-100" />
          </div>
          <div className="mt-5 h-11 rounded bg-zinc-200" />
        </section>
      </main>
    );
  }

  return (
    <main className="animate-pulse p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="grid grid-cols-3 items-center">
          <div className="h-6 w-6 rounded bg-zinc-200" />
          <div className="mx-auto h-6 w-36 rounded bg-zinc-200" />
          <div className="ml-auto h-6 w-6 rounded bg-zinc-200" />
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-24 rounded border border-zinc-100 bg-zinc-100" />
          <div className="h-24 rounded border border-zinc-100 bg-zinc-100" />
          <div className="h-24 rounded border border-zinc-100 bg-zinc-100" />
        </section>

        <section className="rounded border border-zinc-100 p-4">
          <div className="mb-4 h-7 w-64 rounded bg-zinc-200" />
          <div className="space-y-3">
            <div className="h-11 rounded bg-zinc-100" />
            <div className="h-11 rounded bg-zinc-100" />
            <div className="h-11 rounded bg-zinc-100" />
            <div className="h-11 rounded bg-zinc-100" />
            <div className="h-11 rounded bg-zinc-100" />
          </div>
        </section>
      </div>
    </main>
  );
}
