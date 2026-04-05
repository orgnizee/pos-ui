export default function FinanceiroLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="mt-3 sm:mt-4 ml-4 mr-1 sm:ml-10">{children}</main>;
}
