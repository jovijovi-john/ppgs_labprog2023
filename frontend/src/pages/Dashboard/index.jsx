import { useEffect, useState, useRef } from "react";

import connection from "../../configs/connection";
import TitlePage from "../../components/TitlePage";
import Indicador from "../../components/Indicador";

export default function Dashboard() {
  const [selectedPrograma, setSelectedPrograma] = useState("");
  const [programas, setProgramas] = useState([]);
  const [producoesPrograma, setProducoesPrograma] = useState([]);

  const [iGeral, setIGeral] = useState("17,43");
  const [iRestrito, setIRestrito] = useState("16,45");
  const [iNaoRestrito, setINaoRestrito] = useState("0,99");

  const programasRef = useRef();

  async function getProgramas() {
    fetch(`${connection.api_url}/programa/obterTodosProgramas`)
      .then((data) => data.json())
      .then((data) => {
        setProgramas(data);

        const valueSelect = programasRef.current.value;
        setSelectedPrograma(valueSelect);
      });
  }

  function getProducoesPrograma() {
    // Fetch para pegar todas as produções de um programa
    fetch(
      `${connection.api_url}/programa/obterProducoesPrograma?programa=15&anoIni=2018&anoFin=2022`
    )
      .then((data) => data.json())
      .then((data) => {
        console.log(data.length);
        setProducoesPrograma(data);
        console.log(producoesPrograma);
      });
  }

  useEffect(() => {
    // Fetch para pegar todos os programas
    getProgramas();
    getProducoesPrograma();
  }, []);

  function handleSelectedPrograma(e) {
    setSelectedPrograma(e.target.value);
  }

  return (
    <div className="text-white">
      <TitlePage title="Dashboard" />

      <div className="flex flex-col">
        {/* Filtros */}
        <div className="w-16 bg-red-500">{selectedPrograma}</div>
        <h4 className="text-white font-semibold">Filtros</h4>
        <div className="flex gap-4 mt-3 ml-3">
          <div>
            <h5 className="text-sm">Programas</h5>
            <select
              ref={programasRef}
              name="programa"
              id="programa"
              className="bg-zinc-200 text-black rounded p-2 w-36 ml-1 mt-2"
              value={selectedPrograma}
              onChange={handleSelectedPrograma}
            >
              {programas.map((programa) => (
                <option key={programa.id} value={programa.id}>
                  {programa.nome}
                </option>
              ))}{" "}
            </select>
          </div>

          <div>
            <h5 className="text-sm">Ano inicial</h5>
            <input
              type="number"
              className="text-black p-2 rounded bg-zinc-200 w-32 ml-1 mt-2"
              maxLength={4}
            />
          </div>

          <div>
            <h5 className="text-sm">Ano final</h5>
            <input
              type="number"
              className="text-black p-2 rounded bg-zinc-200 w-32 ml-1 mt-2"
              maxLength={4}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-6">
        {/* Filtros */}
        <h4 className="text-white font-semibold">Indicadores Capes</h4>
        <div className="flex gap-8 mt-3 ml-3">
          <Indicador
            title="Total Produções"
            value={producoesPrograma.length}
            color="bg-gray-400"
          />
          <Indicador title="I Geral" value={iGeral} color="bg-cyan-400" />
          <Indicador
            title="I Restrito"
            value={iRestrito}
            color="bg-green-400"
          />
          <Indicador
            title="I Não Restrito"
            value={iNaoRestrito}
            color="bg-yellow-400"
          />
        </div>
      </div>
    </div>
  );
}
