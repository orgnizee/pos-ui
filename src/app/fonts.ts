import { Lekton, Quicksand, Orbit } from "next/font/google";

export const lekton = Lekton({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const quicksand = Quicksand({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const orbit = Orbit({ weight: ["400"] });
