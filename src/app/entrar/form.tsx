export default function Form() {
  async function action(formData: FormData) {
    "use server";
    const username = formData.get("username");
    const password = formData.get("password");
    console.log(username);
    console.log(password);
  }

  return (
    <form action={action}>
      <p className="text-center text-3xl">🗝️</p>

      <div className="mt-6 w-50 h-fit text-sm font-light rounded-md bg-background">
        <input
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
          name="password"
          placeholder="senha"
          type="password"
          className="w-full p-2 placeholder:text-tertiary outline-none focus:border focus:border-tertiary focus:rounded-md"
        />
      </div>

      <div className="relative mt-4 w-fit px-2 py-0.5 rounded-md bg-black cursor-pointer">
        <button
          type="submit"
          className="text-white text-sm w-full h-full cursor-pointer"
        >
          entrar
        </button>
      </div>
    </form>
  );
}
