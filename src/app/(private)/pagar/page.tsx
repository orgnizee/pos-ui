import PayablePage from "@/components/payable-page";

export default async function APagarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <PayablePage
      resolvedParams={await searchParams}
    />
  );
}
