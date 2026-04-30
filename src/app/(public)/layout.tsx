export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="p-4">
      <header className="top-0 left-0 right-0">
        <p className="text-xs sm:text-sm justify-self-center">
          frigorífico saraiva
        </p>
      </header>

      {children}
    </main>
  );
}
