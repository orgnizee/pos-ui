import { logoutAction } from "@/lib/api/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="text-xs cursor-pointer">
        SAIR
      </button>
    </form>
  );
}
