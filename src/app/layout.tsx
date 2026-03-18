import "./globals.css";
import { lekton } from "./fonts";
import type { Metadata, Viewport } from "next";

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
        {children}
      </body>
    </html>
  );
}
