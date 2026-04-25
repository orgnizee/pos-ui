import "./globals.css";
import { quicksand } from "./fonts";
import type { Metadata, Viewport } from "next";
import { cn } from "@/lib/utils";

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
      className={cn("scroll-smooth", "font-sans", quicksand.className)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body
        className={`bg-white ${quicksand.className} uppercase antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
