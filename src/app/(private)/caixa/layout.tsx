import KeyboardNavCaixa from "@/components/keyboradNavCaixa";

export default function CaixaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <KeyboardNavCaixa />
      {children}
    </main>
  );
}
