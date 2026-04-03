import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function BackButton() {
  return (
    <Link
      href={"/caixa"}
      className="flex w-5 h-7 items-center justify-center rounded-full bg-secondary/20"
    >
      <ChevronLeft className="text-tertiary" size={16} />
    </Link>
  );
}
