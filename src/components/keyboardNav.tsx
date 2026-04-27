"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const keyMap: Record<string, string> = {
  F1: "/pdv",
  F2: "/caixa",
  F3: "/fiados",
  F4: "/contatos",
  F5: "/vendas",
  F6: "/produtos",
};

export default function KeyboardNav() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // require Ctrl (or Cmd on macOS), ignore other modifiers
      if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;

      const path = keyMap[e.key];
      if (!path) return;

      e.preventDefault(); // block default browser behavior
      router.push(path);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
