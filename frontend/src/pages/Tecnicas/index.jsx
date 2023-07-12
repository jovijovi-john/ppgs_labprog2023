import { useEffect, useState } from "react";

import TitlePage from "../../components/TitlePage";
import InputAno from "../../components/InputAno";

import connection from "../../configs/connection";

export default function Tecnicas() {
  const [anoInicio, setAnoInicio] = useState(1950);
  const [anoFim, setAnoFim] = useState(2023);

  const [docentes, setDocentes] = useState([]);
  const [tecnicasDocente, setTecnicasDocente] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState("");

  // Executar quando carregar a página
  useEffect(() => {
    fetchDocentes();
  }, []);

  // Executar quando o docente selecionado mudar
  useEffect(() => {
    if (selectedDocente) {
      fetchTecnicasDocente();
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

  function fetchTecnicasDocente() {
    fetch(
      `${connection.api_url}/docente/obter_tecnicas/${selectedDocente}/${anoInicio}/${anoFim}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(
          `${connection.api_url}/docente/obter_tecnicas/${selectedDocente}/${anoInicio}/${anoFim}`
        );
        setTecnicasDocente(data);
      })
      .catch((error) => console.error(error));
  }
  function validateQuery() {
    if (anoInicio >= 1950 && anoFim >= 1950 && selectedDocente) {
      fetchTecnicasDocente();
    }
  }

  function handleSelectedDocente(e) {
    setSelectedDocente(e.target.value);
  }

  return (
    <div className="w-full text-white">
      <TitlePage title="Técnicas" />
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
            <th className="text-left p-4">Titulo</th>
            <th className="text-left p-4">Tipo</th>
            <th className="text-left p-4">Autores</th>
            <th className="text-left p-4">Financiadora</th>
          </tr>
        </thead>

        <tbody className="text-zinc-300">
          {tecnicasDocente.map((tecnica) => (
            <tr key={tecnica.id} className=" ml-4">
              <td className="p-4">{tecnica.ano}</td>
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
