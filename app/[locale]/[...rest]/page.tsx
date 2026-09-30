import { notFound } from "next/navigation";

/* Танигдаагүй бүх хаяг `[locale]/not-found.tsx`-ийг (цэс, хөлтэй,
   хэлээрээ) харуулна — Next-ийн хоосон 404 биш. */
export default function CatchAll() {
  notFound();
}
