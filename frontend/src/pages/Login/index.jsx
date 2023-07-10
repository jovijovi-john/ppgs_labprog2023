import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    navigate("/app");
  }

  return (
    <main className="h-screen w-full bg-indigo-900 flex ">
      <form
        onSubmit={handleSubmit}
        className="mx-auto my-auto flex flex-col w-full max-w-xl bg-indigo-950 rounded-lg p-4 h-[500px] "
      >
        <h1 className="text-white text-center text-4xl font-bold my-6">
          Login
        </h1>

        <div className="flex flex-col w-full mt-8 px-8">
          <label className="text-zinc-300 text-md mb-4" htmlFor="">
            Nome
          </label>
          <input
            className="pb-4 border-b-2 border-zinc-500 bg-transparent outline-none text-gray-100"
            type="text"
            name="name"
          />
        </div>

        <div className="flex flex-col w-full mt-8 px-8">
          <label className="text-zinc-300 text-md  mb-4 " htmlFor="">
            Password
          </label>
          <input
            className="pb-4 border-b-2 border-zinc-500 bg-transparent outline-none text-gray-100"
            type="password"
            name="password"
          />
        </div>

        <button
          type="submit"
          className="text-white p-4 mt-auto mb-8 bg-indigo-600 hover:bg-emerald-600 transition-all ease-out w-64 mx-auto duration-500 rounded-full"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
