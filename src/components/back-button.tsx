"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex w-5 h-7 items-center justify-center rounded-full bg-secondary/20 hover:bg-tertiary/20 transition-colors cursor-pointer"
    >
      <ChevronLeft className="text-tertiary" size={16} />
    </button>
  );
}
