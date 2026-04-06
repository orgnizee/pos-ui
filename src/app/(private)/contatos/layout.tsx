export default function CaixaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="mt-3 sm:mt-4 mr-4 ml-4 sm:ml-10">{children}</main>;
}
