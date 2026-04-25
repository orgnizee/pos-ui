"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const keyMap: Record<string, string> = {
  "F1": "/",
  "F2": "/pdv",
  "F3": "/caixa",
  "F4": "/fiados",
  "F5": "/contatos",
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
