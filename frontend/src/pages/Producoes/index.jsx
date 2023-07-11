import { useEffect, useState } from "react";

import connection from "../../configs/connection";

export default function Producoes() {
  const [docentes, setDocentes] = useState([]);
  const [docenteName, setDocenteName] = useState("");
  const [producoesDocente, setProducoesDocente] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState("");

  useEffect(() => {
    fetchDocentes();
  }, []);

  useEffect(() => {
    if (selectedDocente) {
      fetchDocente();
      fetchProducoesDocente();
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

  function fetchProducoesDocente() {
    fetch(
      `${connection.api_url}/docente/obter_producoes/${selectedDocente}/1950/2023`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProducoesDocente(data);
      })
      .catch((error) => console.error(error));
  }

  function handleSelectedDocente(e) {
    setSelectedDocente(e.target.value);
  }

  return (
    <div className="w-full">
      <div className="flex gap-4 items-center">
        <label htmlFor="docente" className="text-white text-lg font-bold">
          Docente:
        </label>
        <select
          id="docente"
          value={selectedDocente}
          onChange={handleSelectedDocente}
          className="w-96 rounded p-3 bg-zinc-700 text-zinc-300"
        >
          {docentes.map((docente) => (
            <option
              className=" text-zinc-300"
              key={docente.id}
              value={docente.id}
            >
              {docente.nome}
            </option>
          ))}
        </select>
      </div>

      <table className="p-4 w-full overflow-x-auto text-sm mt-8 outline-none">
        <thead className="text-white border-b-2 border-zinc-700">
          <tr className="">
            <th className="text-left p-4 ">Ano</th>
            <th className="text-left p-4 w-72">Docente</th>
            <th className="text-left p-4">Titulo</th>
            <th className="text-left p-4">Local</th>
            <th className="text-left p-4">Orientação</th>
            <th className="text-left p-4 w-40">Estatísticas</th>
          </tr>
        </thead>

        <tbody className="text-zinc-300">
          {producoesDocente.map((producao) => (
            <tr key={producao.id} className=" ml-4">
              <td className="p-4">{producao.ano}</td>
              <td className="p-4">{docenteName}</td>
              <td className="p-4">{producao.titulo}</td>
              <td className="p-4">{producao.nomeLocal}</td>
              <td className="p-4">Sim</td>
              <td className="p-4 w-40">20G | 10M | 2D </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
