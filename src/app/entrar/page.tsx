import Form from "./form";

export default function Acompanhe() {
  return (
    <main>
      {/* HEADER */}
      <h1 className="ml-1 mt-8 text-5xl sm:text-6xl text-start">Olá</h1>
      <p className="ml-2 text-sm normal-case">entre na sua conta</p>

      <div className="flex mt-8 px-1 pt-1 items-center font-bold">
        <div className="relative ml-auto mr-auto flex items-center justify-center w-full min-h-65 sm:w-150 sm:min-h-75 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
          <Form />
        </div>
      </div>
    </main>
  );
}
