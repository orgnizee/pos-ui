"use client";

import Link from "next/link";

export default function Error() {
  return (
    <main>
      <Link href={"/"}>
        <h1 className="font-light text-5xl sm:text-6xl text-start">
          Deu erro :(
        </h1>
      </Link>
    </main>
  );
}
