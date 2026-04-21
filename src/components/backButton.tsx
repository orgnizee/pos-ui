"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex cursor-pointer uppercase text-xs ml-1"
    >
      voltar
    </button>
  );
}
