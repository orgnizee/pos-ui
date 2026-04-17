import { quicksand } from "@/app/fonts";
import Link from "next/link";

interface MainHomeCardProps {
  title: string;
  description: string[];
  notes: string;
  link: string;
  bg?: string;
  text?: string;
}

export default function MainHomeCard({
  title,
  description,
  notes,
  link,
  bg = "bg-secondary/10",
  text = "text-primary/75",
}: MainHomeCardProps) {
  return (
    <Link
        href={link}
      className={`relative max-w-full min-h-60 sm:min-w-50 sm:min-h-60 shrink-0 rounded-md shadow-lg ${bg} hover:bg-secondary/20 overflow-hidden`}
    >
      <p className={`absolute top-4 left-4 text-xl ${text}`}>{title}</p>

      <p
        className={`absolute top-14 left-4 pr-2 sm:pr-0 text-4xl sm:text-4xl font-light ${text} ${quicksand.className}`}
      >
        {description.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </p>

      <p className={`absolute bottom-4 left-4 text-sm ${text} normal-case font-light`}>
        {notes}
      </p>

      {/* <div
        className={`grid absolute bottom-5 right-4 gap-4`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-tertiary"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
      </div> */}
    </Link>
  );
}