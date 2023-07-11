import { useEffect, useState } from "react";

export default function Producoes() {
  const [docentes, setDocentes] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/docente/obterDocentes")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDocentes(data);
        setSelectedDocente(data[1]);
        console.log(docentes);
      })
      .catch((error) => console.error(error));
  }, []);

  function handleSelectedDocente(e) {
    setSelectedDocente(e.target.value);
  }

  return (
    <div className="bg-red-500">
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

      <table className="table-auto w-full">
        <thead className="text-white">
          <tr>
            <th className="text-left">Ano</th>
            <th className="text-left">Docente</th>
            <th className="text-left">Titulo</th>
            <th className="text-left">Local</th>
            <th className="text-left">Orientação</th>
            <th className="text-left">Estatísticas</th>
          </tr>
        </thead>
        <tbody className="text-zinc-300">
          <tr>
            <td>2022</td>
            <td>Geraldo Braz Junior</td>
            <td>Sexos e jumentos</td>
            <td>São Luis</td>
            <td>Sim</td>
            <td>20G | 10M | 2D </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
