"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const keyMap: Record<string, string> = {
  "F1": "/pdv",
  "F2": "/caixa",
  "F3": "/fiados",
  "F4": "/contatos",
  "F5": "/vendas",
};

export default function KeyboardNav() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const path = keyMap[e.key];
      if (path) router.push(path);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
