"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Persona = 
  | "Equilibrista Ansioso"
  | "Planejador Frustrado"
  | "Investidor Inseguro"
  | "Gastador Consciente"
  | "Cansado do Dinheiro";

const perguntas = [
  {
    id: 1,
    pergunta: "Quando você pensa em dinheiro hoje, o que sente primeiro?",
    opcoes: [
      { texto: "Ansiedade", persona: "Equilibrista Ansioso" as Persona },
      { texto: "Cansaço", persona: "Cansado do Dinheiro" as Persona },
      { texto: "Confusão", persona: "Investidor Inseguro" as Persona },
      { texto: "Vontade de fazer certo, mas medo", persona: "Gastador Consciente" as Persona },
      { texto: "Tranquilidade… até a fatura chegar", persona: "Equilibrista Ansioso" as Persona },
    ],
  },
  {
    id: 2,
    pergunta: "Seu cartão de crédito hoje é mais:",
    opcoes: [
      { texto: "Um aliado até virar susto", persona: "Equilibrista Ansioso" as Persona },
      { texto: "Algo que evito olhar", persona: "Cansado do Dinheiro" as Persona },
      { texto: "Uma ferramenta que uso, mas não domino", persona: "Planejador Frustrado" as Persona },
      { texto: "Algo que uso sem pensar muito", persona: "Gastador Consciente" as Persona },
      { texto: "Algo que me dá dor de cabeça", persona: "Cansado do Dinheiro" as Persona },
    ],
  },
  {
    id: 3,
    pergunta: "Quando você parcela uma compra:",
    opcoes: [
      { texto: "Nem lembro que vai cair depois", persona: "Equilibrista Ansioso" as Persona },
      { texto: "Sei que vai cair, mas não sei o impacto", persona: "Equilibrista Ansioso" as Persona },
      { texto: "Tento calcular, mas nunca fica claro", persona: "Planejador Frustrado" as Persona },
      { texto: "Só penso no valor da parcela", persona: "Gastador Consciente" as Persona },
      { texto: "Evito parcelar, mas às vezes não dá", persona: "Cansado do Dinheiro" as Persona },
    ],
  },
  {
    id: 4,
    pergunta: "Qual frase mais parece com você?",
    opcoes: [
      { texto: "Já tentei me organizar várias vezes", persona: "Planejador Frustrado" as Persona },
      { texto: "Começo animado e abandono", persona: "Planejador Frustrado" as Persona },
      { texto: "Tenho planilha/app, mas quase não uso", persona: "Investidor Inseguro" as Persona },
      { texto: "Nunca organizei de verdade", persona: "Gastador Consciente" as Persona },
      { texto: "Pensar em dinheiro me esgota", persona: "Cansado do Dinheiro" as Persona },
    ],
  },
  {
    id: 5,
    pergunta: "Sobre investir:",
    opcoes: [
      { texto: "Já invisto, mas não sei se estou indo bem", persona: "Investidor Inseguro" as Persona },
      { texto: "Quero investir, mas me sinto atrasado", persona: "Investidor Inseguro" as Persona },
      { texto: "Invisto, mas não acompanho", persona: "Planejador Frustrado" as Persona },
      { texto: "Ainda não invisto", persona: "Gastador Consciente" as Persona },
      { texto: "Invisto e isso me deixa ansioso", persona: "Equilibrista Ansioso" as Persona },
    ],
  },
  {
    id: 6,
    pergunta: "Ao pensar numa compra média (R$300–800):",
    opcoes: [
      { texto: "Compro e penso depois", persona: "Gastador Consciente" as Persona },
      { texto: "Penso muito e mesmo assim não sei", persona: "Equilibrista Ansioso" as Persona },
      { texto: "Compro com culpa", persona: "Equilibrista Ansioso" as Persona },
      { texto: "Evito por medo", persona: "Cansado do Dinheiro" as Persona },
      { texto: "Compro e torço pra dar certo", persona: "Planejador Frustrado" as Persona },
    ],
  },
  {
    id: 7,
    pergunta: "Você tem metas financeiras hoje?",
    opcoes: [
      { texto: "Tenho, mas atraso", persona: "Planejador Frustrado" as Persona },
      { texto: "Tenho, mas não acompanho", persona: "Planejador Frustrado" as Persona },
      { texto: "Tenho ideias soltas", persona: "Investidor Inseguro" as Persona },
      { texto: "Não tenho", persona: "Gastador Consciente" as Persona },
      { texto: "Tenho, mas me sinto longe", persona: "Equilibrista Ansioso" as Persona },
    ],
  },
  {
    id: 8,
    pergunta: "O que você mais gostaria de ouvir de um app financeiro?",
    opcoes: [
      { texto: "\"Pode gastar, isso não vai te prejudicar\"", persona: "Equilibrista Ansioso" as Persona },
      { texto: "\"Não gasta agora, você vai se agradecer depois\"", persona: "Gastador Consciente" as Persona },
      { texto: "\"Você está indo melhor do que imagina\"", persona: "Investidor Inseguro" as Persona },
      { texto: "\"Vamos organizar isso sem complicação\"", persona: "Planejador Frustrado" as Persona },
      { texto: "\"Relaxa, tá tudo sob controle\"", persona: "Cansado do Dinheiro" as Persona },
    ],
  },
];

// Mapeamento de personas para URLs
const personaToUrl: Record<Persona, string> = {
  "Equilibrista Ansioso": "equilibrista",
  "Planejador Frustrado": "planejador",
  "Investidor Inseguro": "investidor",
  "Gastador Consciente": "gastador",
  "Cansado do Dinheiro": "cansado",
};

export default function QuizPage() {
  const router = useRouter();
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Persona[]>([]);

  const handleResposta = (persona: Persona) => {
    const novasRespostas = [...respostas, persona];
    setRespostas(novasRespostas);

    if (etapaAtual < perguntas.length - 1) {
      setEtapaAtual(etapaAtual + 1);
    } else {
      // Calcular persona final com lógica de pontuação
      const contagem: Record<Persona, number> = {
        "Equilibrista Ansioso": 0,
        "Planejador Frustrado": 0,
        "Investidor Inseguro": 0,
        "Gastador Consciente": 0,
        "Cansado do Dinheiro": 0,
      };

      novasRespostas.forEach((p) => {
        contagem[p]++;
      });

      // Encontrar a persona com maior pontuação
      let personaFinal: Persona = "Equilibrista Ansioso";
      let maxPontos = 0;

      // Ordem de prioridade para desempate
      const prioridade: Persona[] = [
        "Equilibrista Ansioso",
        "Planejador Frustrado",
        "Investidor Inseguro",
        "Gastador Consciente",
        "Cansado do Dinheiro",
      ];

      prioridade.forEach((p) => {
        if (contagem[p] > maxPontos) {
          maxPontos = contagem[p];
          personaFinal = p;
        }
      });

      // Salvar no localStorage para usar depois no cadastro
      localStorage.setItem("userPersona", personaFinal);
      
      // Redirecionar para página de resultado com a persona
      const personaUrl = personaToUrl[personaFinal];
      router.push(`/resultado?persona=${personaUrl}`);
    }
  };

  const handleVoltar = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1);
      setRespostas(respostas.slice(0, -1));
    } else {
      router.push("/");
    }
  };

  const perguntaAtual = perguntas[etapaAtual];
  const progresso = ((etapaAtual + 1) / perguntas.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Botão Voltar */}
        <button
          onClick={handleVoltar}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {etapaAtual > 0 ? "Pergunta anterior" : "Voltar"}
        </button>

        {/* Card do Quiz */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Progresso */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">
                Pergunta {etapaAtual + 1} de {perguntas.length}
              </span>
              <span className="text-sm text-slate-400">{progresso.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-800 transition-all duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

          {/* Pergunta */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {perguntaAtual.pergunta}
            </h2>
            <p className="text-slate-400 text-sm">
              Escolha a opção que mais se aproxima da sua realidade
            </p>
          </div>

          {/* Opções */}
          <div className="space-y-3">
            {perguntaAtual.opcoes.map((opcao, index) => (
              <button
                key={index}
                onClick={() => handleResposta(opcao.persona)}
                className="w-full p-5 bg-slate-900/50 border border-slate-600 rounded-xl text-left hover:bg-slate-700/50 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium group-hover:text-purple-300 transition-colors">
                    {opcao.texto}
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Informação adicional */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Suas respostas nos ajudam a personalizar sua experiência
        </p>
      </div>
    </div>
  );
}
