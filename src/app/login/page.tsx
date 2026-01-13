"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQuiz = searchParams.get("from") === "quiz";
  
  const [isLogin, setIsLogin] = useState(!fromQuiz); // Se vem do quiz, mostra cadastro
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome: "",
  });

  useEffect(() => {
    // Verificar se Supabase está configurado
    const configured = isSupabaseConfigured();
    setSupabaseConfigured(configured);
    
    if (!configured) {
      setError("Configure as variáveis do Supabase para usar autenticação. Clique no banner laranja acima para configurar.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured()) {
      setError("Configure as variáveis do Supabase para usar autenticação. Clique no banner laranja acima para configurar.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          console.error("Erro de autenticação:", authError);
          
          // Traduzir erros comuns
          if (authError.message.includes("Invalid login credentials")) {
            throw new Error("E-mail ou senha incorretos");
          }
          if (authError.message.includes("Email not confirmed")) {
            throw new Error("Confirme seu e-mail antes de fazer login");
          }
          if (authError.message.includes("fetch")) {
            throw new Error("Erro de conexão. Verifique suas credenciais do Supabase.");
          }
          
          throw new Error(authError.message || "Erro ao fazer login");
        }

        if (data?.user) {
          // Redirecionar para o app
          router.push("/app");
        }
      } else {
        // Cadastro
        // Validações
        if (!formData.nome.trim()) {
          throw new Error("Por favor, preencha seu nome");
        }
        if (formData.password.length < 6) {
          throw new Error("A senha deve ter no mínimo 6 caracteres");
        }

        const { data, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nome: formData.nome,
            },
          },
        });

        if (authError) {
          console.error("Erro ao criar conta:", authError);
          
          // Traduzir erros comuns
          if (authError.message.includes("already registered")) {
            throw new Error("Este e-mail já está cadastrado");
          }
          if (authError.message.includes("Invalid email")) {
            throw new Error("E-mail inválido");
          }
          if (authError.message.includes("Password should be")) {
            throw new Error("A senha deve ter no mínimo 6 caracteres");
          }
          if (authError.message.includes("fetch")) {
            throw new Error("Erro de conexão. Verifique suas credenciais do Supabase.");
          }
          
          throw new Error(authError.message || "Erro ao criar conta");
        }

        if (data?.user) {
          // Buscar persona do localStorage
          const persona = localStorage.getItem("userPersona") || "Equilibrista Ansioso";

          // Criar perfil do usuário
          try {
            const { error: profileError } = await supabase
              .from("users")
              .insert([
                {
                  id: data.user.id,
                  email: formData.email,
                  nome: formData.nome,
                  persona: persona,
                  is_premium: false,
                },
              ]);

            if (profileError) {
              console.error("Erro ao criar perfil:", profileError);
              // Não bloquear o fluxo se der erro no perfil
            }
          } catch (profileErr) {
            console.error("Erro ao criar perfil:", profileErr);
            // Não bloquear o fluxo
          }

          // Limpar localStorage
          localStorage.removeItem("userPersona");

          // Redirecionar para o app
          router.push("/app");
        }
      }
    } catch (err: any) {
      console.error("Erro no processo:", err);
      
      // Melhorar mensagens de erro
      let errorMessage = "Ocorreu um erro. Tente novamente.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.name === "AuthRetryableFetchError") {
        errorMessage = "Erro de conexão com o Supabase. Verifique suas credenciais nas configurações.";
      } else if (err.name === "TypeError" && err.message.includes("fetch")) {
        errorMessage = "Erro de conexão. Verifique se o Supabase está configurado corretamente.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Botão Voltar */}
        <button
          onClick={() => router.push(fromQuiz ? "/resultado" : "/")}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        {/* Alerta se Supabase não configurado */}
        {!supabaseConfigured && (
          <div className="mb-6 bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 text-sm text-orange-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Configuração necessária</p>
              <p className="text-orange-300/80">
                Configure suas credenciais do Supabase clicando no banner laranja acima ou em Configurações do Projeto → Integrações → Conectar Supabase.
              </p>
            </div>
          </div>
        )}

        {/* Card de Login */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <svg
              viewBox="0 0 120 40"
              className="h-10 w-auto mx-auto mb-4"
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
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Bem-vindo de volta" : fromQuiz ? "Quase lá!" : "Crie sua conta"}
            </h1>
            <p className="text-slate-400 text-sm">
              {isLogin
                ? "Entre para continuar gerenciando suas finanças"
                : fromQuiz
                ? "Agora crie sua conta para começar"
                : "Comece a tomar decisões financeiras melhores"}
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-slate-500 mt-1">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !supabaseConfigured}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta e começar"}
            </button>
          </form>

          {/* Toggle Login/Cadastro - Oculto se vem do quiz */}
          {!fromQuiz && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {isLogin ? (
                  <>
                    Não tem uma conta?{" "}
                    <span className="text-purple-400 font-semibold">
                      Cadastre-se
                    </span>
                  </>
                ) : (
                  <>
                    Já tem uma conta?{" "}
                    <span className="text-purple-400 font-semibold">
                      Faça login
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
