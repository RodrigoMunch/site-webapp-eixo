"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CriarContaPage() {
  const router = useRouter();
  const [persona, setPersona] = useState<string>("equilibrista");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  useEffect(() => {
    // Recuperar persona do localStorage
    const savedPersona = localStorage.getItem("eixo_persona");
    if (savedPersona) {
      setPersona(savedPersona);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salvar dados do usuário (localStorage para demo)
    localStorage.setItem("eixo_user", JSON.stringify({
      ...formData,
      persona,
      createdAt: new Date().toISOString(),
    }));

    // Redirecionar para app FREE
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Logo */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold">EIXO</h1>
          <p className="text-slate-400 mt-2">Decidir bem muda tudo.</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Crie sua conta
            </h2>
            <p className="text-slate-400">
              Comece a centralizar suas decisões financeiras.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <label htmlFor="nome" className="block text-sm font-medium text-slate-300">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                placeholder="Seu nome"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label htmlFor="senha" className="block text-sm font-medium text-slate-300">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                minLength={6}
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-8 py-4 text-lg font-semibold text-slate-950 bg-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 mt-6"
            >
              Criar conta gratuita
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-slate-500 text-center">
            Ao criar sua conta, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
