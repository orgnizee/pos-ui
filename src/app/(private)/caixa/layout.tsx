export default function CaixaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="mt-6 sm:mt-8 ml-4 mr-1 sm:ml-10">{children}</main>;
}
