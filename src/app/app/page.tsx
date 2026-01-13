"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Home, 
  Target, 
  TrendingUp, 
  Settings, 
  Lock,
  AlertCircle,
  CheckCircle,
  DollarSign,
  CreditCard,
  Calendar,
  Crown
} from "lucide-react";

interface UserData {
  nome: string;
  email: string;
  persona: string;
}

export default function AppPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    // Verificar se usuário está logado
    const user = localStorage.getItem("eixo_user");
    if (!user) {
      router.push("/");
      return;
    }
    setUserData(JSON.parse(user));
  }, [router]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">EIXO</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Olá, {userData.nome.split(" ")[0]}
              </p>
            </div>
            <button
              onClick={() => setShowPaywall(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-sm font-semibold hover:scale-105 transition-all"
            >
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Upgrade Premium</span>
              <span className="sm:hidden">Premium</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "dashboard"
                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30"
                  : "text-slate-400 hover:bg-slate-800/50"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("metas")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "metas"
                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30"
                  : "text-slate-400 hover:bg-slate-800/50"
              }`}
            >
              <Target className="w-5 h-5" />
              <span>Metas</span>
            </button>

            <button
              onClick={() => setShowPaywall(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 transition-all relative"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Investimentos</span>
              <Lock className="w-4 h-4 ml-auto" />
            </button>

            <button
              onClick={() => setActiveTab("config")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "config"
                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30"
                  : "text-slate-400 hover:bg-slate-800/50"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </button>
          </nav>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "dashboard" && <DashboardFree onUpgrade={() => setShowPaywall(true)} />}
            {activeTab === "metas" && <MetasFree onUpgrade={() => setShowPaywall(true)} />}
            {activeTab === "config" && <ConfigPage userData={userData} />}
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal persona={userData.persona} onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}

// Dashboard FREE
function DashboardFree({ onUpgrade }: { onUpgrade: () => void }) {
  const [canBuyUsed, setCanBuyUsed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Saldo Resumo */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Visão Geral</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Saldo Disponível</p>
            <p className="text-2xl font-bold text-green-400">R$ 2.450,00</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Parcelamentos</p>
            <p className="text-2xl font-bold text-orange-400">R$ 890,00</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Próxima Fatura</p>
            <p className="text-2xl font-bold text-red-400">R$ 1.340,00</p>
          </div>
        </div>
      </div>

      {/* Posso Comprar? */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Posso Comprar?</h2>
            <p className="text-sm text-slate-400">
              {canBuyUsed ? "Você já usou hoje. Volte amanhã!" : "Pergunte antes de gastar."}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-cyan-400" />
        </div>

        {!canBuyUsed ? (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Quanto você quer gastar?"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={() => setCanBuyUsed(true)}
              className="w-full px-6 py-3 bg-cyan-400 text-slate-950 rounded-xl font-semibold hover:bg-cyan-300 transition-all"
            >
              Verificar agora
            </button>
            <p className="text-xs text-slate-500 text-center">
              1 consulta por dia no plano FREE
            </p>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <p className="font-semibold">Pode comprar!</p>
            </div>
            <p className="text-sm text-slate-300">
              Essa compra não vai comprometer suas contas do mês.
            </p>
            <button
              onClick={onUpgrade}
              className="text-sm text-cyan-400 hover:underline"
            >
              Quer consultas ilimitadas? Upgrade para Premium →
            </button>
          </div>
        )}
      </div>

      {/* Parcelamentos Teaser */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
        <div className="relative z-0 blur-sm">
          <h2 className="text-lg font-semibold mb-4">Parcelamentos Ativos</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div>
                <p className="font-medium">Notebook</p>
                <p className="text-sm text-slate-400">6/12 parcelas</p>
              </div>
              <p className="font-bold">R$ 250,00</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div>
                <p className="font-medium">Celular</p>
                <p className="text-sm text-slate-400">3/10 parcelas</p>
              </div>
              <p className="font-bold">R$ 180,00</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <button
            onClick={onUpgrade}
            className="px-6 py-3 bg-white text-slate-950 rounded-full font-semibold hover:scale-105 transition-all shadow-2xl"
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Desbloquear Projeção Completa
          </button>
        </div>
      </div>

      {/* Roast Mensal */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Roast do Mês</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Você gastou R$ 340 em delivery esse mês. Se tivesse cozinhado 3x por semana, 
              economizaria R$ 200. Mas relaxa, não é culpa. É hábito.
            </p>
            <button
              onClick={onUpgrade}
              className="mt-3 text-sm text-purple-400 hover:underline"
            >
              Quer roasts semanais? Upgrade para Premium →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metas FREE
function MetasFree({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Minhas Metas</h2>
        <button
          onClick={onUpgrade}
          className="text-sm text-cyan-400 hover:underline"
        >
          Criar metas ilimitadas →
        </button>
      </div>

      {/* Meta Ativa */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Reserva de Emergência</h3>
            <p className="text-sm text-slate-400">Meta: R$ 5.000,00</p>
          </div>
          <Target className="w-8 h-8 text-cyan-400" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Progresso</span>
            <span className="font-semibold">R$ 1.200,00 (24%)</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-1/4" />
          </div>
        </div>

        <p className="text-sm text-slate-400">
          Faltam R$ 3.800,00 para atingir sua meta.
        </p>
      </div>

      {/* Limite FREE */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 text-center space-y-3">
        <Lock className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="font-semibold text-slate-400">1 meta no plano FREE</h3>
        <p className="text-sm text-slate-500">
          Upgrade para Premium e crie metas ilimitadas
        </p>
        <button
          onClick={onUpgrade}
          className="px-6 py-2 bg-cyan-400 text-slate-950 rounded-full font-semibold hover:bg-cyan-300 transition-all"
        >
          Fazer Upgrade
        </button>
      </div>
    </div>
  );
}

// Configurações
function ConfigPage({ userData }: { userData: UserData }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("eixo_user");
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações</h2>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-sm text-slate-400">Nome</p>
          <p className="font-semibold">{userData.nome}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Email</p>
          <p className="font-semibold">{userData.email}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Perfil Financeiro</p>
          <p className="font-semibold capitalize">{userData.persona}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-semibold hover:bg-red-500/20 transition-all"
      >
        Sair da conta
      </button>
    </div>
  );
}

// Paywall Modal
function PaywallModal({ persona, onClose }: { persona: string; onClose: () => void }) {
  const paywallContent: Record<string, { headline: string; benefits: string[] }> = {
    equilibrista: {
      headline: "Chega de gastar com medo.",
      benefits: [
        "Projeção de parcelamentos (3, 6, 12 meses)",
        '"Posso Comprar?" ilimitado',
        "Roast semanal personalizado",
        "Alertas inteligentes antes de errar",
        "Metas ilimitadas",
      ],
    },
    planejador: {
      headline: "Controle sem esforço.",
      benefits: [
        "Projeção automática de parcelamentos",
        "Consultas ilimitadas",
        "Roast semanal motivacional",
        "Alertas que funcionam",
        "Metas sem limite",
      ],
    },
    investidor: {
      headline: "Clareza patrimonial completa.",
      benefits: [
        "Visão completa de investimentos",
        "Projeção de parcelamentos",
        "Consultas ilimitadas",
        "Roast semanal",
        "Metas ilimitadas",
      ],
    },
    gastador: {
      headline: "Apoio na hora H.",
      benefits: [
        '"Posso Comprar?" ilimitado',
        "Alertas antes de comprar",
        "Projeção de impacto",
        "Roast semanal",
        "Metas ilimitadas",
      ],
    },
    cansado: {
      headline: "Pare de carregar isso sozinho.",
      benefits: [
        "Automação completa",
        "Alertas inteligentes",
        "Projeção de parcelamentos",
        "Roast semanal",
        "Metas ilimitadas",
      ],
    },
  };

  const content = paywallContent[persona] || paywallContent.equilibrista;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Premium</span>
          </div>
          <h2 className="text-3xl font-bold">{content.headline}</h2>
        </div>

        <div className="space-y-3">
          {content.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold mb-1">R$ 29,90<span className="text-lg text-slate-400">/mês</span></p>
          <p className="text-sm text-slate-400">Cancele quando quiser</p>
        </div>

        <button className="w-full px-6 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-semibold text-lg hover:scale-105 transition-all shadow-2xl">
          Quero decidir com segurança
        </button>

        <p className="text-xs text-slate-500 text-center">
          7 dias de garantia. Se não gostar, devolvemos seu dinheiro.
        </p>
      </div>
    </div>
  );
}
