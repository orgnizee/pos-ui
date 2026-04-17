import "./globals.css";
import { lekton } from "./fonts";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import KeyboardNav from "@/components/keyboard-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
    <html
      lang="en"
      className={cn("scroll-smooth", "font-sans", inter.variable)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body
        className={`bg-background ${lekton.className} uppercase antialiased`}
      >
        <KeyboardNav />
        {children}
      </body>
    </html>
  );
}
