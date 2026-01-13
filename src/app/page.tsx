"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
                  fill="#2E004F"
                  letterSpacing="-0.5"
                >
                  EIXO
                </text>
              </svg>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              EIXO
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 font-light">
              Decidir bem muda tudo.
            </p>
          </div>

          {/* Headline */}
          <div className="space-y-6 pt-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Seu dinheiro some.
              <br />
              E você só percebe depois.
            </h2>

            {/* Subheadline */}
            <div className="space-y-4 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
              <p>
                Você trabalha, recebe, paga contas —<br />
                mas nunca sabe se pode gastar de verdade.
              </p>
              <p className="font-medium text-white">
                Não é falta de controle.
                <br />
                É falta de clareza.
              </p>
            </div>

            {/* Body Text */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto pt-4">
              Ninguém te ensinou a lidar com cartão parcelado, metas, futuro e vida real ao mesmo tempo.
            </p>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
              O Eixo existe pra centralizar suas decisões antes do erro acontecer.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => router.push("/quiz")}
              className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold text-slate-950 bg-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
            >
              <span className="relative z-10">
                Descubra seu perfil financeiro
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Subtle tagline */}
          <p className="text-sm text-slate-500 pt-8">
            Controle não é culpa. Antes de gastar, centraliza.
          </p>
        </div>
      </div>
    </div>
  );
}