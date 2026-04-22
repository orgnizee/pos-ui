"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const keyMap: Record<string, string> = {
  0: "/",
  1: "/pdv",
  2: "/caixa",
  3: "/fiados",
  4: "/contatos",
};

export default function KeyboardNav() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modifier keys are held
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Ignore if focus is inside any editable element
      const tag = (e.target as HTMLElement).tagName;
      const isEditable = (e.target as HTMLElement).isContentEditable;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || isEditable) return;

      const path = keyMap[e.key];
      if (path) router.push(path);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
