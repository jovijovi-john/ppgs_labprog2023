import { useEffect } from "react";
import { Outlet } from "react-router";
import { useNavigate, Link } from "react-router-dom";
// import { useState } from "react";

export default function App() {
  // const [pageActive, setPageActive] = useState("");
  const navigate = useNavigate();

  useEffect(() => {}), [navigate];

  const pages = ["Dashboard", "Tecnicas", "Producoes", "Docentes"];

  function handleButton(title) {
    return (
      <li className="mt-2 w-full p-4 text-left" key={title}>
        <Link
          to={`/app/${title}`}
          className="pl-6 w-full h-full text-zinc-100 font-bold block"
        >
          {title}
        </Link>
      </li>
    );
  }

  return (
    <div className="bg-black h-screen w-full ">
      <div className="h-full w-screen flex pl-72 overflow-hidden">
        <aside className="fixed top-0 left-0 h-full bg-indigo-600 w-72">
          <h1 className="text-3xl font-bold text-white py-6 px-6 border-b-2 ">
            PPGS
          </h1>

          <ul className="flex flex-col text-zinc-200 w-full">
            {pages.map((page) => handleButton(page))}
          </ul>
        </aside>

        <div className="mt-12 mx-16 w-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
