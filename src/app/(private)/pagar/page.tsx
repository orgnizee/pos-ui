import PaymentsPage from "@/components/payment-page";

export default async function APagarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <PaymentsPage
      paymentType="payable"
      resolvedParams={await searchParams}
    />
  );
}
