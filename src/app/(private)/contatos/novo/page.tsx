import { Suspense } from "react";

import BackButton from "@/components/backButton";
import ContactForm from "@/components/contactForm";
import Loading from "./loading";

export async function AddContactPayload() {
  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">novo contato</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <ContactForm />
      </div>
    </section>
  );
}

export default async function AddContactPage() {
  return (
    <section className="mt-6">
      <div className="no-print">
        <Suspense fallback={<Loading />}>
          <AddContactPayload />
        </Suspense>
      </div>
    </section>
  );
}
