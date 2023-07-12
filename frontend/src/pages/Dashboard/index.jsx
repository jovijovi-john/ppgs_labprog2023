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
  const [labels, setLabels] = useState({});
  const [docentes, setDocentes] = useState([]);
  const [anoInicio, setAnoInicio] = useState(2020);
  const [anoFim, setAnoFim] = useState(2023);

  const [selectedPrograma, setSelectedPrograma] = useState("");
  const [programas, setProgramas] = useState([]);
  const [producoesPrograma, setProducoesPrograma] = useState([]);

  // deus tenha misericórdia
  // const [a1, setA1] = useState([]);
  // const [a2, setA2] = useState([]);
  // const [a3, setA3] = useState([]);
  // const [a4, setA4] = useState([]);
  // const [b1, setB1] = useState([]);
  // const [b2, setB2] = useState([]);
  // const [b3, setB3] = useState([]);
  // const [b4, setB4] = useState([]);
  const [qualis, setQualis] = useState([]);

  const [iGeral, setIGeral] = useState(0);
  const [iRestrito, setIRestrito] = useState(0);
  const [iNaoRestrito, setINaoRestrito] = useState(0);

  const programasRef = useRef();

  // Configurações do gráfico
  const dados = {
    labels: Object.keys(labels),
    datasets: [
      {
        label: "A1",
        data: qualis[0],
        backgroundColor: "#8b1616",
      },
      {
        label: "A2",
        data: qualis[1],
        backgroundColor: "#f09c00",
      },
      {
        label: "A3",
        data: qualis[2],
        backgroundColor: "#f0e000",
      },
      {
        label: "A4",
        data: qualis[3],
        backgroundColor: "#008a4a",
      },

      {
        label: "B1",
        data: qualis[4],
        backgroundColor: "#038fb3",
      },
      {
        label: "B2",
        data: qualis[5],
        backgroundColor: "#0300ad",
      },

      {
        label: "B3",
        data: qualis[6],
        backgroundColor: "#633af7",
      },
      {
        label: "B4",
        data: qualis[7],
        backgroundColor: "#ffa7e9",
      },
      {
        label: "c",
        data: qualis[8],
        backgroundColor: "#fcdff4",
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

  // Requisições

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
        console.log(producoesPrograma);
        console.log(data.length);
        setProducoesPrograma(data);
      });
  }

  function getInfoProducoes() {
    console.log(labels);

    producoesPrograma.forEach((producao, index) => {
      try {
        if (labels[producao.ano] == undefined) {
          labels[producao.ano] = {
            A1: 0,
            A2: 0,
            A3: 0,
            A4: 0,
            B1: 0,
            B2: 0,
            B3: 0,
            B4: 0,
            C: 0,
          };
        } else {
          if (producao.qualis != null) {
            labels[producao.ano][producao.qualis]++;
          }
        }
      } catch (e) {
        console.log("erro nas infos producoes");
      }
    });

    let a1 = [];
    let a2 = [];
    let a3 = [];
    let a4 = [];
    let b1 = [];
    let b2 = [];
    let b3 = [];
    let b4 = [];
    let c = [];

    Object.keys(labels).map((ano, index) => {
      a1[index] = labels[ano]["A1"];
      a2[index] = labels[ano]["A2"];
      a4[index] = labels[ano]["A3"];
      a3[index] = labels[ano]["A4"];
      b1[index] = labels[ano]["B1"];
      b2[index] = labels[ano]["B2"];
      b4[index] = labels[ano]["B3"];
      b3[index] = labels[ano]["B4"];
      c[index] = labels[ano]["C"];
    });

    setQualis([a1, a2, a3, a4, b1, b2, b3, b4, c]);
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
      getInfoProducoes();
    }
  }, [selectedPrograma]);

  useEffect(() => {
    if (producoesPrograma) {
      getInfoProducoes();
    }
  }, [producoesPrograma]);

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
      <div className="flex flex-col mt-6 mb-12">
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

      <Bar data={dados} options={options} />

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
              {docenteAtual.qualis.map((qualis, index) => (
                <td key={index} className="text-left p-4">
                  {String(qualis).padStart(2, "0")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
