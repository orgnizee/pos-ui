import BackButton from "@/components/backButton";
import BankAccountForm from "@/components/bankAccountForm";

export default async function AddBankAccount() {
  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">
        nova conta
      </p>

      <div className="flex flex-col items-center">
        <div className="mt-2 relative ml-auto mr-auto flex items-center justify-center w-full sm:min-h-95">
          <BankAccountForm />
        </div>
      </div>
    </section>
  );
}
