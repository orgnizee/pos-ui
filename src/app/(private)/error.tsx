"use client";

import Link from "next/link";

export default function Error() {
  return (
    <main>
      <Link href={"/"}>
        <h1 className="ml-4 sm:ml-10 mt-8 text-5xl sm:text-6xl text-start">
          Deu erro :(
        </h1>
      </Link>
    </main>
  );
}
