export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="p-4 sm:px-10">
      <header className="top-0 left-0 right-0 p-1 rounded-md bg-secondary/15">
        <div className="grid grid-cols-3 h-7 sm:h-fit items-center px-1 text-primary font-bold">
          <p className="text-xs sm:text-sm justify-self-start">
            :){" "}
          </p>

          <p className="text-xs sm:text-sm justify-self-center">frigorífico saraiva</p>

          <p className="text-xs sm:text-sm justify-self-end"></p>
        </div>
      </header>

      {children}
    </main>
  );
}
