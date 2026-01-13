"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface PersonaData {
  name: string;
  headline: string;
  text: string;
  description: string;
}

const personasData: Record<string, PersonaData> = {
  equilibrista: {
    name: "Equilibrista Ansioso",
    headline: "Você não gasta demais.\nVocê decide sem clareza.",
    text: "Parcelamentos invisíveis, metas que nunca chegam e aquela dúvida antes de gastar.\nNão é falta de disciplina.\nÉ falta de visão.",
    description:
      "Você trabalha, ganha dinheiro e usa cartão parcelado. Mas vive com medo de errar. A ansiedade antes de gastar não é frescura — é falta de visão do impacto real.",
  },
  planejador: {
    name: "Planejador Frustrado",
    headline: "Você não falha.\nO método falha.",
    text: "Controle financeiro nunca deveria parecer um segundo emprego.",
    description:
      "Você já tentou planilha, app, anotação. Começa animado e abandona. Não é falta de disciplina — é cansaço mental. O Eixo não exige esforço. Ele centraliza.",
  },
  investidor: {
    name: "Investidor Inseguro",
    headline: "Investir sem clareza\né ansiedade disfarçada.",
    text: "Você já deu o primeiro passo. Mas investir sem saber se pode, se está indo bem ou se deveria fazer diferente é ansiedade disfarçada de planejamento.\n\nO Eixo centraliza tudo: quanto você tem, quanto está comprometido, quanto pode investir de verdade — sem culpa, sem comparação.",
    description:
      "Você já investe ou quer investir. Mas se compara muito e duvida constantemente. Falta clareza patrimonial. O Eixo mostra o todo, não só as partes.",
  },
  gastador: {
    name: "Gastador Consciente",
    headline: "Você quer fazer certo.\nSó precisa de apoio na hora H.",
    text: "Você não é impulsivo por natureza. Você só não tem clareza suficiente no momento da decisão.\n\nO Eixo te mostra o impacto antes do clique.",
    description:
      "Você quer fazer certo. Mas compra por impulso e se arrepende depois. Não é falta de vontade — é decisão no calor do momento. O Eixo te apoia na hora H.",
  },
  cansado: {
    name: "Cansado do Dinheiro",
    headline: "Dinheiro não precisa morar na sua cabeça.",
    text: "Você trabalha, ganha, paga contas — mas pensar em dinheiro virou peso. O Eixo centraliza tudo pra você parar de carregar isso sozinho.",
    description:
      "Você trabalha muito. Dinheiro virou peso emocional. Quer parar de pensar nisso. O Eixo assume a carga mental pra você respirar.",
  },
};

function ResultadoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [persona, setPersona] = useState<string>("equilibrista");

  useEffect(() => {
    const personaParam = searchParams.get("persona");
    if (personaParam) {
      setPersona(personaParam);
    }
  }, [searchParams]);

  const personaData = personasData[persona] || personasData.equilibrista;

  const handleCreateAccount = () => {
    // Redirecionar para página de login/cadastro com parâmetro from=quiz
    router.push("/login?from=quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Logo */}
        <div className="mb-12 sm:mb-16">
          <svg
            viewBox="0 0 120 40"
            className="h-10 w-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="10"
              y="30"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="32"
              fontWeight="700"
              fill="#8B5CF6"
              letterSpacing="-0.5"
            >
              EIXO
            </text>
          </svg>
        </div>

        {/* Result Content */}
        <div className="space-y-8 sm:space-y-12">
          {/* Persona Badge */}
          <div className="inline-block px-4 py-2 bg-purple-400/10 border border-purple-400/30 rounded-full">
            <p className="text-purple-400 text-sm sm:text-base font-medium">
              Seu perfil financeiro
            </p>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight whitespace-pre-line">
              {personaData.headline}
            </h2>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl whitespace-pre-line">
              {personaData.text}
            </p>
          </div>

          {/* Persona Description */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
              {personaData.name}
            </h3>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {personaData.description}
            </p>
          </div>

          {/* CTA */}
          <div className="pt-8">
            <button
              onClick={handleCreateAccount}
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold text-slate-950 bg-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
            >
              Criar minha conta e ver isso na prática
            </button>
          </div>

          {/* Additional info */}
          <div className="pt-8 sm:pt-12 text-center">
            <p className="text-sm text-slate-500">
              Controle não é culpa. É clareza.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-white text-xl">Carregando...</div>
        </div>
      }
    >
      <ResultadoContent />
    </Suspense>
  );
}
