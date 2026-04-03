import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

const now = () =>
  new Date()
    .toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
    .replace(/\./g, "")
    .replace(" de ", " ");

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="p-4 sm:px-10">
        <header className="top-0 left-0 right-0 p-1 rounded-md bg-secondary/15">
          <div className="grid grid-cols-3 items-center px-1 text-primary font-bold">
            <Link href={"/"}>
              <p className="text-xs sm:text-sm justify-self-start text-tertiary">
                :)
              </p>
            </Link>

            <p className="text-xs sm:text-sm justify-self-center text-tertiary">
              {now()}
            </p>

            <div className="justify-self-end">
              <LogoutButton />
            </div>
          </div>
        </header>
      </div>

      {children}
    </main>
  );
}
