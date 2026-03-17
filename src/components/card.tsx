import { quicksand } from "@/app/fonts";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string[];
  year: string;
  where: string;
  link: string;
  bg?: string;
  text?: string;
}

export default function Card({
  title,
  description,
  year,
  where,
  link,
  bg = "bg-secondary/20",
  text = "text-primary/75",
}: CardProps) {
  return (
    <Link
        href={link}
      className={`relative min-w-77.25 min-h-112.5 sm:min-w-100 sm:min-h-125 shrink-0 rounded-md shadow-lg ${bg} hover:bg-secondary/10 overflow-hidden`}
    >
      <p className={`absolute top-4 left-4 text-xl ${text}`}>{title}</p>

      <p
        className={`absolute top-14 left-4 pr-2 sm:pr-0 text-5xl sm:text-6xl font-light ${text} ${quicksand.className}`}
      >
        {description.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </p>

      <p className={`absolute bottom-4 left-4 text-sm ${text} normal-case font-light`}>
        {year} • {where}
      </p>

      <div
        className={`grid absolute bottom-5 right-4 gap-4`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
      </div>
    </Link>
  );
}