import { SVGProps } from "react";

export default function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="12 24 40 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="44 40 52 32 44 24" />
      <line x1="52" y1="32" x2="12" y2="32" />
    </svg>
  );
}
