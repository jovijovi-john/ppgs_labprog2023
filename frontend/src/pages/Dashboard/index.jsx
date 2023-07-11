import { useEffect, useState, useRef } from "react";

import { Bar } from "react-chartjs-2";

import connection from "../../configs/connection";
import TitlePage from "../../components/TitlePage";
import Indicador from "../../components/Indicador";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const dados = {
  labels: ["2019", "2020", "2021", "2022", "2023"],
  datasets: [
    {
      label: "A1",
      data: [17, 26, 30, 33, 9],
      backgroundColor: "#4f46e5",
    },
    {
      label: "A2",
      data: [6, 17, 13, 8, 0],
      backgroundColor: "#5d30b1",
    },
    {
      label: "A3",
      data: [20, 46, 24, 26, 12],
      backgroundColor: "#e0e7ff",
    },
    {
      label: "A4",
      data: [55, 25, 49, 30, 0],
      backgroundColor: "#818cf8",
    },
  ],
};

const options = {
  plugins: {
    title: {
      display: true,
      text: "Produção vs Qualis",
      color: "#fff",
      weight: 500,
      font: {
        size: 18,
      },
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export default function Dashboard() {
  const [selectedPrograma, setSelectedPrograma] = useState("");
  const [programas, setProgramas] = useState([]);
  const [producoesPrograma, setProducoesPrograma] = useState([]);

  const [iGeral, setIGeral] = useState(0);
  const [iRestrito, setIRestrito] = useState(0);
  const [iNaoRestrito, setINaoRestrito] = useState(0);

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

  async function getIndicadores() {
    fetch(`${connection.api_url}/qualis/indice/15`)
      .then((data) => data.json())
      .then((data) => {
        setIGeral(data.indice.indiceGeral.toFixed(2));
        setINaoRestrito(data.indice.indiceNRest.toFixed(2));
        setIRestrito(data.indice.indiceRest.toFixed(2));
        console.log(data);
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
    getIndicadores();
    getProducoesPrograma();
  }, []);

  function handleSelectedPrograma(e) {
    setSelectedPrograma(e.target.value);
  }

  return (
    <div className="text-white">
      <TitlePage title="Dashboard" />
      <div className="flex flex-col ">
        {/* Filtros */}
        <h4 className="text-xl text-white font-semibold">Filtros</h4>
        <div className="flex gap-4 mt-3 ml-3">
          <div>
            <h5 className="text-md">Programas</h5>
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
            <h5 className="text-md">Ano inicial</h5>
            <input
              type="number"
              className="text-black p-2 rounded bg-zinc-200 w-32 ml-1 mt-2"
              maxLength={4}
            />
          </div>

          <div>
            <h5 className="text-md">Ano final</h5>
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
        <h4 className="text-xl text-white font-semibold">Indicadores Capes</h4>
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

      <div className="flex w-3/4 mx-auto mt-8 ">
        <Bar data={dados} options={options} />
      </div>
    </div>
  );
}
