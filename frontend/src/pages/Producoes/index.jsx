import { useEffect, useState } from "react";

import connection from "../../configs/connection";

export default function Producoes() {
  const [docentes, setDocentes] = useState([]);
  const [producoesDocente, setProducoesDocente] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState("");

  useEffect(() => {
    fetch(`${connection.api_url}/docente/obterDocentes`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDocentes(data);
        setSelectedDocente(data[1]);
        console.log(docentes);
      })
      .catch((error) => console.error(error));

    fetch(`${connection.api_url}/docente/obter_producoes/15/2020/2023`)
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setProducoesDocente(data);
      });
  }, []);

  function handleSelectedDocente(e) {
    setSelectedDocente(e.target.value);
  }

  return (
    <div className="">
      <select
        value={selectedDocente}
        onChange={handleSelectedDocente}
        className="w-full"
      >
        {docentes.map((docente) => (
          <option className=" text-black" key={docente.id} value={docente.nome}>
            {docente.nome}
          </option>
        ))}
      </select>

      <table className="p-4 overflow-scroll">
        <thead className="text-white border-b-2 border-zinc-700">
          <tr className="">
            <th className="text-left p-4">Ano</th>
            <th className="text-left p-4">Docente</th>
            <th className="text-left p-4">Titulo</th>
            <th className="text-left p-4">Local</th>
            <th className="text-left p-4">Orientação</th>
            <th className="text-left p-4">Estatísticas</th>
          </tr>
        </thead>

        <tbody className="text-zinc-300">
          {producoesDocente.map((producao) => (
            <tr key={producao.id} className=" ml-4">
              <td className="p-4">{producao.ano}</td>
              <td className="p-4">Luis Jorge Enrique Rivero Cabrejos</td>
              <td className="p-4">{producao.titulo}</td>
              <td className="p-4">{producao.nomeLocal}</td>
              <td className="p-4">Sim</td>
              <td className="p-4">20G | 10M | 2D </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
