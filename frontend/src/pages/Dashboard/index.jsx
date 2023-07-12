import { useEffect, useState, useRef } from "react";

import { Bar } from "react-chartjs-2";

import InputAno from "../../components/InputAno";

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

export default function Dashboard() {
  const [docentes, setDocentes] = useState([]);
  const [anoInicio, setAnoInicio] = useState(2020);
  const [anoFim, setAnoFim] = useState(2023);

  const [selectedPrograma, setSelectedPrograma] = useState("");
  const [programas, setProgramas] = useState([]);
  const [producoesPrograma, setProducoesPrograma] = useState([]);

  const [iGeral, setIGeral] = useState(0);
  const [iRestrito, setIRestrito] = useState(0);
  const [iNaoRestrito, setINaoRestrito] = useState(0);

  const programasRef = useRef();

  function getLabels() {
    const labels = [];
    const [anoIni, anoFim] = [anoInicio, anoFim];

    for (let ano = anoFim; ano >= anoIni; ano--) {
      labels.push(ano);
    }

    return labels;
  }
  const dados = {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "A1",
        data: [17, 26, 30, 33, 9],
        backgroundColor: "#2b2b2b",
      },
      {
        label: "A2",
        data: [6, 17, 13, 8, 0],
        backgroundColor: "#646464",
      },
      {
        label: "A3",
        data: [20, 46, 24, 26, 12],
        backgroundColor: "#c2c2c2",
      },
      {
        label: "A4",
        data: [55, 25, 49, 30, 0],
        backgroundColor: "#fafafa",
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

  async function fetchProgramas() {
    fetch(`${connection.api_url}/programa/obterTodosProgramas`)
      .then((data) => data.json())
      .then((data) => {
        setProgramas(data);
        fetchQualisPrograma();
        const valueSelect = programasRef.current.value;
        setSelectedPrograma(valueSelect);
      });
  }

  async function getIndicadores() {
    fetch(`${connection.api_url}/qualis/indice/${selectedPrograma}`)
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
      `${connection.api_url}/programa/obterProducoesPrograma/${selectedPrograma}/${anoInicio}/${anoFim}`
    )
      .then((data) => data.json())
      .then((data) => {
        console.log(data.length);
        setProducoesPrograma(data);
        console.log(producoesPrograma);
      });
  }

  function fetchQualisPrograma() {
    fetch("http://localhost:8080/api/programa/obterQualisPrograma/15/2020/2023")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setDocentes(data);
        console.log(docentes);
      });
  }

  function validateQuery() {
    if (anoInicio >= 1950 && anoFim >= 1950 && selectedPrograma) {
      fetchQualisPrograma();
      getProducoesPrograma();
      getIndicadores();
    }
  }
  // Executar quando o ano de início ou ano de fim mudar
  useEffect(() => {
    // Verifica se os anos informados são válidos, se sim, faça uma nova requisição
    validateQuery();
  }, [anoInicio, anoFim]);

  useEffect(() => {
    // Fetch para pegar todos os programas
    fetchProgramas();
  }, []);

  useEffect(() => {
    if (selectedPrograma) {
      fetchQualisPrograma();
      getIndicadores();
      getProducoesPrograma();
    }
  }, [selectedPrograma]);

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
              className="bg-zinc-700 text-zinc-300 rounded p-2 w-36 ml-1 mt-2"
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
            <InputAno
              className="p-2 rounded bg-zinc-700 text-zinc-300 w-32 ml-1 mt-2"
              ano={anoInicio}
              setAno={setAnoInicio}
            />
          </div>

          <div>
            <h5 className="text-md">Ano final</h5>
            <InputAno
              className="p-2 rounded bg-zinc-700 text-zinc-300 w-32 ml-1 mt-2"
              ano={anoFim}
              setAno={setAnoFim}
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

      <table className="p-4 w-full overflow-x-auto text-sm mt-8 mb-16 outline-none">
        <thead className="text-white border-b-2 border-zinc-700">
          <tr className="text-lg text-zinc-100 font-bold">
            <th className="text-left p-4">Docente</th>
            <th className="text-left p-4">A1</th>
            <th className="text-left p-4">A2</th>
            <th className="text-left p-4">A3</th>
            <th className="text-left p-4">A4</th>
            <th className="text-left p-4">B1</th>
            <th className="text-left p-4">B2</th>
            <th className="text-left p-4">B3</th>
            <th className="text-left p-4">B4</th>
            <th className="text-left p-4">C</th>
          </tr>
        </thead>

        <tbody className="text-[16px]">
          {docentes.map((docenteAtual) => (
            <tr
              key={docenteAtual.docente.id}
              className="border-b border-zinc-900 text-zinc-200"
            >
              <td className="text-left p-4">{docenteAtual.docente.nome}</td>
              <td className="text-left p-4">
                {String(docenteAtual.qualis[0]).padStart(2, "0")}
              </td>
              <td className="text-left p-4">
                {String(docenteAtual.qualis[1]).padStart(2, "0")}
              </td>
              <td className="text-left p-4">
                {String(docenteAtual.qualis[2]).padStart(2, "0")}
              </td>
              <td className="text-left p-4">
                {String(docenteAtual.qualis[3]).padStart(2, "0")}
              </td>
              <td className="text-left p-4">
                {String(docenteAtual.qualis[4]).padStart(2, "0")}
              </td>
              <td className="text-left p-4">
                {String(docenteAtual.qualis[5]).padStart(2, "0")}
              </td>
              <td className="text-left p-4">
                {String(docenteAtual.qualis[6]).padStart(2, "0")}
              </td>
              <td className="text-left p-4">
                {String(docenteAtual.qualis[7]).padStart(2, "0")}
              </td>
              <td className="text-left p-4">
                {String(docenteAtual.qualis[8]).padStart(2, "0")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
