import PaymentsPage from "@/components/payment-page";

export default async function AReceberPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <PaymentsPage
      resolvedParams={await searchParams}
    />
  );
}
