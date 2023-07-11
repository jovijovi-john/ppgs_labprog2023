import { useEffect, useState } from "react";

import connection from "../../configs/connection";

export default function Tecnicas() {
  const [docentes, setDocentes] = useState([]);
  const [docenteName, setDocenteName] = useState("");
  const [tecnicasDocente, setTecnicasDocente] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState("");

  useEffect(() => {
    fetchDocentes();
  }, []);

  useEffect(() => {
    if (selectedDocente) {
      fetchDocente();
      fetchTecnicasDocente();
    }
  }, [selectedDocente]);

  function fetchDocente() {
    fetch(`${connection.api_url}/docente/${selectedDocente}`)
      .then((response) => response.json())
      .then((data) => {
        setDocenteName(data.nome);
      })
      .catch((error) => console.error(error));
  }
  function fetchDocentes() {
    fetch(`${connection.api_url}/docente/obterDocentes`)
      .then((response) => response.json())
      .then((data) => {
        setDocentes(data);
        setSelectedDocente(data[0].id);
        setDocenteName(data[0].nome);
      })
      .catch((error) => console.error(error));
  }

  function fetchTecnicasDocente() {
    fetch(`${connection.api_url}/docente/obter_tecnicas/${selectedDocente}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTecnicasDocente(data);
      })
      .catch((error) => console.error(error));
  }

  function handleSelectedDocente(e) {
    setSelectedDocente(e.target.value);
  }

  return (
    <div className="w-full">
      <select
        value={selectedDocente}
        onChange={handleSelectedDocente}
        className="w-full rounded p-3"
      >
        {docentes.map((docente) => (
          <option className=" text-black" key={docente.id} value={docente.id}>
            {docente.nome}
          </option>
        ))}
      </select>

      <table className="p-4 w-full overflow-x-auto text-sm mt-8 mb-16 outline-none">
        <thead className="text-white border-b-2 border-zinc-700">
          <tr className="">
            <th className="text-left p-4 ">Ano</th>
            <th className="text-left p-4 w-[260px]">Docente</th>
            <th className="text-left p-4">Titulo</th>
            <th className="text-left p-4">Tipo</th>
            <th className="text-left p-4">Autores</th>
            <th className="text-left p-4 w-[400px]">Financiadora</th>
          </tr>
        </thead>

        <tbody className="text-zinc-300">
          {tecnicasDocente.map((tecnica) => (
            <tr key={tecnica.id} className=" ml-4">
              <td className="p-4">{tecnica.ano}</td>
              <td className="p-4">{docenteName}</td>
              <td className="p-4">{tecnica.titulo}</td>
              <td className="p-4">{tecnica.tipo}</td>
              <td className="p-4">{tecnica.autores}</td>
              <td className="p-4">{tecnica.financiadora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
