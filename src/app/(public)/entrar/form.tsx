"use client";

import { useActionState } from "react";
import { getTokenAction, TokenActionState } from "@/lib/api/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState<TokenActionState, FormData>(
    getTokenAction,
    null,
  );

  return (
    <form action={action} className="">
      <p className="text-center text-3xl normal-case">oi,</p>
      <p className="ml-2 text-center text-sm font-light normal-case">
        entre na sua conta
      </p>

      <div className="mt-6 w-50 h-fit text-sm font-light rounded-md bg-background">
        <input
          required
          name="username"
          placeholder="usuário"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full p-2 placeholder:text-tertiary outline-none focus:border focus:border-tertiary focus:rounded-md"
        />
      </div>

      <div className="mt-2 w-50 h-fit text-sm font-light rounded-md bg-background">
        <input
          required
          name="password"
          placeholder="senha"
          type="password"
          className="w-full p-2 placeholder:text-tertiary outline-none focus:border focus:border-tertiary focus:rounded-md"
        />
      </div>

      <div className="mt-1 relative h-5">
        {state && "error" in state && (
          <p className="text-end text-xs font-light normal-case text-red-500">
            {state.message}
          </p>
        )}
      </div>

      <div className="relative w-fit px-2 py-0.5 rounded-md bg-black cursor-pointer">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center text-sm text-white cursor-pointer"
        >
          entrar
        </button>
      </div>
    </form>
  );
}
