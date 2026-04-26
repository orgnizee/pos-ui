import Link from "next/link";
import { logoutAction } from "@/lib/api/actions/auth";
import { LogOut } from "lucide-react";

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
    <main className="px-6 py-2">
      <div>
        <header className="top-0 left-0 right-0 no-print">
          <div className="grid grid-cols-3 items-center">
            <Link href={"/"}>
              <p className="pt-1.5 text-lg justify-self-start">/</p>
            </Link>

            <p className="text-lg justify-self-center">{now()}</p>

            <div className="pt-1 justify-self-end">
              <form action={logoutAction}>
                <button type="submit" className="text-lg cursor-pointer">
                  <LogOut strokeWidth={1.2} size={20} />
                </button>
              </form>
            </div>
          </div>
        </header>
      </div>

      {children}
    </main>
  );
}
