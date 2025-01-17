import { useEffect, useState } from "react";

import connection from "../../configs/connection";

import TitlePage from "../../components/TitlePage";
import InputAno from "../../components/InputAno";

export default function Producoes() {
  const [anoInicio, setAnoInicio] = useState(2020);
  const [anoFim, setAnoFim] = useState(2023);

  const [docentes, setDocentes] = useState([]);
  const [docenteName, setDocenteName] = useState("");
  const [producoesDocente, setProducoesDocente] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState("");

  useEffect(() => {
    fetchDocentes();
  }, []);

  function validateQuery() {
    if (anoInicio >= 1950 && anoFim >= 1950 && selectedDocente) {
      fetchProducoesDocente();
    }
  }

  useEffect(() => {
    // Verifica se os anos informados são válidos, se sim, faça uma nova requisição
    validateQuery();
  }, [anoInicio, anoFim]);

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
    fetch(`${connection.api_url}/docente/obter_docentes`)
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
      `${connection.api_url}/docente/obter_producoes/${selectedDocente}/${anoInicio}/${anoFim}`
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
    <div className="w-full text-white">
      {/* Select de Docentes */}

      <TitlePage title="Produções" />
      <div className="flex gap-4 items-center">
        <label htmlFor="docente" className="text-white text-lg font-bold">
          Docente:
        </label>
        <select
          id="docente"
          value={selectedDocente}
          onChange={handleSelectedDocente}
          className="w-96 rounded p-2 bg-zinc-700 text-zinc-300"
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

        <div className="flex items-center gap-2">
          <h5 className="text-md">Ano inicial: </h5>
          <InputAno
            className="p-2 rounded bg-zinc-700 text-zinc-300 w-32 ml-1"
            ano={anoInicio}
            setAno={setAnoInicio}
          />
        </div>

        <div className="flex items-center gap-2">
          <h5 className="text-md">Ano final: </h5>
          <InputAno
            className="p-2 rounded bg-zinc-700 text-zinc-300 w-32 ml-1"
            ano={anoFim}
            setAno={setAnoFim}
          />
        </div>
      </div>

      {/* Tabela de Produções */}
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
