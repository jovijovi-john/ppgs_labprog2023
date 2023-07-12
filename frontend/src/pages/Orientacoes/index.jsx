import { useEffect, useState } from "react";

import TitlePage from "../../components/TitlePage";
import InputAno from "../../components/InputAno";

import connection from "../../configs/connection";

export default function Orientacoes() {
  const [anoInicio, setAnoInicio] = useState(1950);
  const [anoFim, setAnoFim] = useState(2023);

  const [docentes, setDocentes] = useState([]);
  // const [docenteName, setDocenteName] = useState("");
  const [orientacoesDocente, setOrientacoesDocente] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState("");

  // Executar quando carregar a página
  useEffect(() => {
    fetchDocentes();
  }, []);

  // Executar quando o docente selecionado mudar
  useEffect(() => {
    if (selectedDocente) {
      // fetchDocente();
      fetchOrientacoesDocente();
    }
  }, [selectedDocente]);

  // Executar quando o ano de início ou ano de fim mudar
  useEffect(() => {
    // Verifica se os anos informados são válidos, se sim, faça uma nova requisição
    validateQuery();
  }, [anoInicio, anoFim]);

  // function fetchDocente() {
  //   fetch(`${connection.api_url}/docente/${selectedDocente}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setDocenteName(data.nome);
  //     })
  //     .catch((error) => console.error(error));
  // }
  function fetchDocentes() {
    fetch(`${connection.api_url}/docente/obter_docentes`)
      .then((response) => response.json())
      .then((data) => {
        setDocentes(data);
        setSelectedDocente(data[0].id);
        // setDocenteName(data[0].nome);
      })
      .catch((error) => console.error(error));
  }

  function fetchOrientacoesDocente() {
    fetch(
      `${connection.api_url}/docente/obter_orientacoes/${selectedDocente}/${anoInicio}/${anoFim}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOrientacoesDocente(data);
      })
      .catch((error) => console.error(error));
  }
  function validateQuery() {
    if (anoInicio >= 1950 && anoFim >= 1950 && selectedDocente) {
      fetchOrientacoesDocente();
    }
  }

  function handleSelectedDocente(e) {
    setSelectedDocente(e.target.value);
  }

  return (
    <div className="w-full text-white">
      <TitlePage title="Orientações" />
      {/* Select de Docentes */}
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

      <table className="p-4 max-w-full overflow-x-auto text-sm mt-8 mb-16 outline-none">
        <thead className="text-white border-b-2 border-zinc-700">
          <tr className="">
            <th className="text-left p-4 ">Ano</th>
            <th className="text-left p-4 w-[450px]">Titulo</th>
            <th className="text-left p-4">Discente</th>
            <th className="text-left p-4">Instituição</th>
            <th className="text-left p-4">Curso</th>
            <th className="text-left p-4">Status</th>
          </tr>
        </thead>

        <tbody className="text-zinc-300">
          {orientacoesDocente.map((orientacao) => (
            <tr key={orientacao.id} className=" ml-4">
              <td className="p-4">{orientacao.ano}</td>
              <td className="p-4">{orientacao.titulo}</td>
              <td className="p-4">{orientacao.discente}</td>
              <td className="p-4">{orientacao.instituicao}</td>
              <td className="p-4">{orientacao.curso}</td>
              <td className="p-4">{orientacao.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
