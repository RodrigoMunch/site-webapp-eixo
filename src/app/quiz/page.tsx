"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Answer = "A" | "B" | "C" | "D" | "E";

interface Question {
  id: number;
  question: string;
  options: {
    value: Answer;
    text: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Quando você pensa em dinheiro hoje, o que sente primeiro?",
    options: [
      { value: "A", text: "Ansiedade" },
      { value: "B", text: "Cansaço" },
      { value: "C", text: "Confusão" },
      { value: "D", text: "Vontade de fazer certo, mas medo" },
      { value: "E", text: "Tranquilidade… até a fatura chegar" },
    ],
  },
  {
    id: 2,
    question: "Seu cartão de crédito hoje é mais:",
    options: [
      { value: "A", text: "Um aliado até virar susto" },
      { value: "B", text: "Algo que evito olhar" },
      { value: "C", text: "Uma ferramenta que uso, mas não domino" },
      { value: "D", text: "Algo que uso sem pensar muito" },
      { value: "E", text: "Algo que me dá dor de cabeça" },
    ],
  },
  {
    id: 3,
    question: "Quando você parcela uma compra:",
    options: [
      { value: "A", text: "Nem lembro que vai cair depois" },
      { value: "B", text: "Sei que vai cair, mas não sei o impacto" },
      { value: "C", text: "Tento calcular, mas nunca fica claro" },
      { value: "D", text: "Só penso no valor da parcela" },
      { value: "E", text: "Evito parcelar, mas às vezes não dá" },
    ],
  },
  {
    id: 4,
    question: "Qual frase mais parece com você?",
    options: [
      { value: "A", text: "Já tentei me organizar várias vezes" },
      { value: "B", text: "Começo animado e abandono" },
      { value: "C", text: "Tenho planilha/app, mas quase não uso" },
      { value: "D", text: "Nunca organizei de verdade" },
      { value: "E", text: "Pensar em dinheiro me esgota" },
    ],
  },
  {
    id: 5,
    question: "Sobre investir:",
    options: [
      { value: "A", text: "Já invisto, mas não sei se estou indo bem" },
      { value: "B", text: "Quero investir, mas me sinto atrasado" },
      { value: "C", text: "Invisto, mas não acompanho" },
      { value: "D", text: "Ainda não invisto" },
      { value: "E", text: "Invisto e isso me deixa ansioso" },
    ],
  },
  {
    id: 6,
    question: "Ao pensar numa compra média (R$300–800):",
    options: [
      { value: "A", text: "Compro e penso depois" },
      { value: "B", text: "Penso muito e mesmo assim não sei" },
      { value: "C", text: "Compro com culpa" },
      { value: "D", text: "Evito por medo" },
      { value: "E", text: "Compro e torço pra dar certo" },
    ],
  },
  {
    id: 7,
    question: "Você tem metas financeiras hoje?",
    options: [
      { value: "A", text: "Tenho, mas atraso" },
      { value: "B", text: "Tenho, mas não acompanho" },
      { value: "C", text: "Tenho ideias soltas" },
      { value: "D", text: "Não tenho" },
      { value: "E", text: "Tenho, mas me sinto longe" },
    ],
  },
  {
    id: 8,
    question: "O que você mais gostaria de ouvir de um app financeiro?",
    options: [
      { value: "A", text: '"Pode gastar, isso não vai te prejudicar"' },
      { value: "B", text: '"Não gasta agora, você vai se agradecer depois"' },
      { value: "C", text: '"Você está indo melhor do que imagina"' },
      { value: "D", text: '"Vamos organizar isso sem complicação"' },
      { value: "E", text: '"Relaxa, tá tudo sob controle"' },
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);

  const handleAnswer = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completo - calcular persona e redirecionar
      const persona = calculatePersona(newAnswers);
      router.push(`/resultado?persona=${persona}`);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">EIXO</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Pergunta {currentQuestion + 1} de {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            {questions[currentQuestion].question}
          </h2>

          {/* Options */}
          <div className="space-y-3 sm:space-y-4">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedAnswer(option.value)}
                className={`w-full text-left px-6 py-4 sm:px-8 sm:py-5 rounded-2xl border-2 transition-all duration-200 ${
                  selectedAnswer === option.value
                    ? "border-cyan-400 bg-cyan-400/10 text-white"
                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                }`}
              >
                <span className="text-base sm:text-lg">{option.text}</span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <div className="pt-6 sm:pt-8">
            <button
              onClick={handleAnswer}
              disabled={!selectedAnswer}
              className={`w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full transition-all duration-300 ${
                selectedAnswer
                  ? "bg-white text-slate-950 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
            >
              {currentQuestion < questions.length - 1 ? "Próxima" : "Ver resultado"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lógica de cálculo de persona
function calculatePersona(answers: Answer[]): string {
  const scoring: Record<string, number> = {
    equilibrista: 0,
    planejador: 0,
    investidor: 0,
    gastador: 0,
    cansado: 0,
  };

  // Q1
  if (answers[0] === "A" || answers[0] === "E") scoring.equilibrista++;
  if (answers[0] === "B") scoring.cansado++;
  if (answers[0] === "C") scoring.investidor++;
  if (answers[0] === "D") scoring.gastador++;

  // Q2
  if (answers[1] === "A") scoring.equilibrista++;
  if (answers[1] === "B" || answers[1] === "E") scoring.cansado++;
  if (answers[1] === "C") scoring.planejador++;
  if (answers[1] === "D") scoring.gastador++;

  // Q3
  if (answers[2] === "A" || answers[2] === "B") scoring.equilibrista++;
  if (answers[2] === "C") scoring.planejador++;
  if (answers[2] === "D") scoring.gastador++;
  if (answers[2] === "E") scoring.cansado++;

  // Q4
  if (answers[3] === "A" || answers[3] === "B") scoring.planejador++;
  if (answers[3] === "C") scoring.investidor++;
  if (answers[3] === "D") scoring.gastador++;
  if (answers[3] === "E") scoring.cansado++;

  // Q5
  if (answers[4] === "A" || answers[4] === "B") scoring.investidor++;
  if (answers[4] === "C") scoring.planejador++;
  if (answers[4] === "D") scoring.gastador++;
  if (answers[4] === "E") scoring.equilibrista++;

  // Q6
  if (answers[5] === "A") scoring.gastador++;
  if (answers[5] === "B" || answers[5] === "C") scoring.equilibrista++;
  if (answers[5] === "D") scoring.cansado++;
  if (answers[5] === "E") scoring.planejador++;

  // Q7
  if (answers[6] === "A" || answers[6] === "B") scoring.planejador++;
  if (answers[6] === "C") scoring.investidor++;
  if (answers[6] === "D") scoring.gastador++;
  if (answers[6] === "E") scoring.equilibrista++;

  // Q8
  if (answers[7] === "A") scoring.equilibrista++;
  if (answers[7] === "B") scoring.gastador++;
  if (answers[7] === "C") scoring.investidor++;
  if (answers[7] === "D") scoring.planejador++;
  if (answers[7] === "E") scoring.cansado++;

  // Encontrar maior pontuação
  const maxScore = Math.max(...Object.values(scoring));
  const winners = Object.entries(scoring)
    .filter(([_, score]) => score === maxScore)
    .map(([persona]) => persona);

  // Regra de desempate
  const priority = ["equilibrista", "planejador", "investidor", "gastador", "cansado"];
  for (const persona of priority) {
    if (winners.includes(persona)) {
      return persona;
    }
  }

  return "equilibrista"; // fallback
}
