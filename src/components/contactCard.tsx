import { Contact } from "@/lib/api/contacts";
import Link from "next/link";

export default function ContactCard({ contact }: { contact: Contact }) {
  const isCustomer = contact.kind === "customer";

  const displayName = isCustomer
    ? (contact.alias ?? "")
    : (contact.trade_name ?? "");
  const fullName = isCustomer ? contact.name : contact.legal_name;


  return (
    <div className="relative p-2 px-2 w-full min-h-37.5 border">
      {/* Top row: phone pill + ID */}
      <div className="flex items-center justify-between h-7.5 w-full mb-1.5">
        <button className="py-1">
          <kbd className="text-sm text-start font-light text-primary/50">
            {displayName}
          </kbd>
        </button>
        <div className="text-nowrap text-xs text-primary truncate">
          <p>{contact.code}</p>
        </div>
      </div>

      {/* Main card area */}
      <Link
        href={`/contatos/${contact.id}`}
        className="flex flex-col justify-between items-start border w-full h-32.5"
      >
        <div className="px-3 relative py-2 w-full h-full">
          <p className="w-full text-start text-lg text-primary">{fullName}</p>

          <div className="w-full absolute bottom-1 text-start text-primary/50">
            <span className="block truncate text-xs">{contact.address ?? "-"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
