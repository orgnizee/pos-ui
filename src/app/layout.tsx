import "./globals.css";
import { lekton } from "./fonts";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/logoutButton";

const now = () =>
  new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  });

export const metadata: Metadata = {
  title: "Nizee + Frigorífico Saraiva",
  description: "Software Intelligence",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`bg-background p-4 sm:px-10 ${lekton.className} uppercase antialiased`}
      >
        <header className="top-0 left-0 right-0 p-1 rounded-md bg-secondary/15">
          <div className="grid grid-cols-3 items-center px-1 text-primary font-bold">
            <Link href={"/"}>
              <p className="text-xs sm:text-sm justify-self-start">
                nizee{" "}
                <span className="text-tertiary/60">
                  / <span className="block sm:inline">Frigorífico Saraiva</span>
                </span>
              </p>
            </Link>

            <p className="text-xs sm:text-sm justify-self-center">{now()}</p>

            <div className="justify-self-end">
              <LogoutButton />
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
