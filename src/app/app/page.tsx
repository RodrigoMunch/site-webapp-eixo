"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Target,
  TrendingDown,
  Plus,
  X,
  Calendar,
  Tag,
  FileText,
  Settings,
  LogOut,
  Crown,
  Lock,
  Sparkles,
  Filter,
  Trash2,
  Download,
  HelpCircle,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "@/lib/supabase";

// Types
interface Transaction {
  id: string;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  categoria: string;
  data: string;
  parcelado?: boolean;
  parcelas?: string;
}

interface Category {
  id: string;
  nome: string;
  cor: string;
  icone: string;
  orcamento: number;
  gasto: number;
}

interface Meta {
  id: string;
  nome: string;
  valor_total: number;
  valor_atual: number;
  prazo: string;
}

export default function AppPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [userName, setUserName] = useState("Usuário");

  // Estados para transações
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", nome: "Alimentação", cor: "#10B981", icone: "🍔", orcamento: 800, gasto: 0 },
    { id: "2", nome: "Transporte", cor: "#3B82F6", icone: "🚗", orcamento: 400, gasto: 0 },
    { id: "3", nome: "Lazer", cor: "#F59E0B", icone: "🎮", orcamento: 300, gasto: 0 },
    { id: "4", nome: "Saúde", cor: "#EF4444", icone: "💊", orcamento: 200, gasto: 0 },
  ]);
  const [metas, setMetas] = useState<Meta[]>([]);

  // Modal de transação
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    descricao: "",
    valor: "",
    tipo: "despesa" as "receita" | "despesa",
    categoria: "Alimentação",
    data: new Date().toISOString().split("T")[0],
    parcelado: false,
    parcelas: "",
  });

  // Modal de meta
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [newMeta, setNewMeta] = useState({
    nome: "",
    valor_total: "",
    prazo: "",
  });

  // Filtro de extrato
  const [filtroExtrato, setFiltroExtrato] = useState("30");

  // "Posso Comprar?"
  const [showPossoComprar, setShowPossoComprar] = useState(false);
  const [possoComprarValor, setPossoComprarValor] = useState("");
  const [possoComprarDescricao, setPossoComprarDescricao] = useState("");
  const [possoComprarResposta, setPossoComprarResposta] = useState<{
    resposta: "sim" | "nao";
    explicacao: string;
  } | null>(null);
  const [tentativasPossoComprar, setTentativasPossoComprar] = useState(0);
  const [historicoPossoComprar, setHistoricoPossoComprar] = useState<any[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    const savedCategories = localStorage.getItem("categories");
    const savedMetas = localStorage.getItem("metas");
    const savedPremium = localStorage.getItem("isPremium");
    const savedName = localStorage.getItem("userName");
    const savedTentativas = localStorage.getItem("tentativasPossoComprar");
    const savedHistorico = localStorage.getItem("historicoPossoComprar");

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedMetas) setMetas(JSON.parse(savedMetas));
    if (savedPremium) setIsPremium(JSON.parse(savedPremium));
    if (savedName) setUserName(savedName);
    if (savedTentativas) setTentativasPossoComprar(JSON.parse(savedTentativas));
    if (savedHistorico) setHistoricoPossoComprar(JSON.parse(savedHistorico));
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("metas", JSON.stringify(metas));
    localStorage.setItem("isPremium", JSON.stringify(isPremium));
    localStorage.setItem("tentativasPossoComprar", JSON.stringify(tentativasPossoComprar));
    localStorage.setItem("historicoPossoComprar", JSON.stringify(historicoPossoComprar));
  }, [transactions, categories, metas, isPremium, tentativasPossoComprar, historicoPossoComprar]);

  // Atualizar gastos das categorias
  useEffect(() => {
    const updatedCategories = categories.map((cat) => {
      const gasto = transactions
        .filter((t) => t.tipo === "despesa" && t.categoria === cat.nome)
        .reduce((acc, t) => acc + t.valor, 0);
      return { ...cat, gasto };
    });
    setCategories(updatedCategories);
  }, [transactions]);

  const handleAddTransaction = () => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      descricao: newTransaction.descricao,
      valor: parseFloat(newTransaction.valor),
      tipo: newTransaction.tipo,
      categoria: newTransaction.categoria,
      data: newTransaction.data,
      parcelado: newTransaction.parcelado,
      parcelas: newTransaction.parcelas,
    };

    setTransactions([...transactions, transaction]);
    setShowTransactionModal(false);
    setNewTransaction({
      descricao: "",
      valor: "",
      tipo: "despesa",
      categoria: "Alimentação",
      data: new Date().toISOString().split("T")[0],
      parcelado: false,
      parcelas: "",
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleAddMeta = () => {
    const meta: Meta = {
      id: Date.now().toString(),
      nome: newMeta.nome,
      valor_total: parseFloat(newMeta.valor_total),
      valor_atual: 0,
      prazo: newMeta.prazo,
    };

    setMetas([...metas, meta]);
    setShowMetaModal(false);
    setNewMeta({ nome: "", valor_total: "", prazo: "" });
  };

  const handleAdicionarValorMeta = (metaId: string, valor: number) => {
    setMetas(
      metas.map((m) =>
        m.id === metaId ? { ...m, valor_atual: m.valor_atual + valor } : m
      )
    );
  };

  const handleDeleteMeta = (id: string) => {
    setMetas(metas.filter((m) => m.id !== id));
  };

  const handlePossoComprar = () => {
    if (!isPremium && tentativasPossoComprar >= 1) {
      setShowPaywall(true);
      return;
    }

    const valor = parseFloat(possoComprarValor);
    const totalReceitas = transactions
      .filter((t) => t.tipo === "receita")
      .reduce((acc, t) => acc + t.valor, 0);
    const totalDespesas = transactions
      .filter((t) => t.tipo === "despesa")
      .reduce((acc, t) => acc + t.valor, 0);
    const saldo = totalReceitas - totalDespesas;

    const podeComprar = saldo >= valor && saldo - valor > totalReceitas * 0.1;

    const resposta = {
      resposta: podeComprar ? ("sim" as const) : ("nao" as const),
      explicacao: podeComprar
        ? `Sim! Você pode fazer essa compra. Após a compra, você ainda terá R$ ${(saldo - valor).toFixed(2)} disponível.`
        : `Não recomendamos. Essa compra comprometeria muito seu saldo atual de R$ ${saldo.toFixed(2)}.`,
    };

    setPossoComprarResposta(resposta);
    setTentativasPossoComprar(tentativasPossoComprar + 1);

    // Adicionar ao histórico
    const historico = {
      id: Date.now().toString(),
      valor,
      descricao: possoComprarDescricao,
      resposta: resposta.resposta,
      explicacao: resposta.explicacao,
      data: new Date().toISOString(),
    };
    setHistoricoPossoComprar([historico, ...historicoPossoComprar]);
  };

  const handleExportData = (format: "pdf" | "csv") => {
    if (!isPremium && format === "pdf") {
      setShowPaywall(true);
      return;
    }

    if (format === "csv") {
      const csv = [
        ["Data", "Descrição", "Tipo", "Categoria", "Valor"],
        ...transactions.map((t) => [
          t.data,
          t.descricao,
          t.tipo,
          t.categoria,
          t.valor.toString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transacoes.csv";
      a.click();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getFilteredTransactions = () => {
    const dias = parseInt(filtroExtrato);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    return transactions.filter((t) => new Date(t.data) >= dataLimite);
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">Olá, {userName}</span>
              {!isPremium && (
                <button
                  onClick={() => setShowPaywall(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all"
                >
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-semibold">Upgrade Premium</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/30 backdrop-blur-sm sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "extrato", label: "Extrato", icon: FileText },
              { id: "categorias", label: "Categorias", icon: Tag },
              { id: "metas", label: "Metas", icon: Target },
              { id: "posso-comprar", label: "Posso Comprar?", icon: HelpCircle },
              { id: "configuracoes", label: "Configurações", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-purple-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <DashboardPage
            transactions={filteredTransactions}
            categories={categories}
            onUpgrade={() => setShowPaywall(true)}
          />
        )}

        {activeTab === "extrato" && (
          <ExtratoPage
            transactions={transactions}
            filtro={filtroExtrato}
            setFiltro={setFiltroExtrato}
            onDelete={handleDeleteTransaction}
            onAdd={() => setShowTransactionModal(true)}
          />
        )}

        {activeTab === "categorias" && (
          <CategoriasPage categories={categories} />
        )}

        {activeTab === "metas" && (
          <MetasPage
            metas={metas}
            isPremium={isPremium}
            onAdd={() => setShowMetaModal(true)}
            onAddValor={handleAdicionarValorMeta}
            onDelete={handleDeleteMeta}
            onUpgrade={() => setShowPaywall(true)}
          />
        )}

        {activeTab === "posso-comprar" && (
          <PossoComprarPage
            valor={possoComprarValor}
            setValor={setPossoComprarValor}
            descricao={possoComprarDescricao}
            setDescricao={setPossoComprarDescricao}
            resposta={possoComprarResposta}
            onAnalisar={handlePossoComprar}
            tentativas={tentativasPossoComprar}
            isPremium={isPremium}
            historico={historicoPossoComprar}
            onUpgrade={() => setShowPaywall(true)}
          />
        )}

        {activeTab === "configuracoes" && (
          <ConfiguracoesPage
            userName={userName}
            setUserName={setUserName}
            isPremium={isPremium}
            onExport={handleExportData}
            onUpgrade={() => setShowPaywall(true)}
          />
        )}
      </main>

      {/* Modal de Transação */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Nova Transação</h2>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  value={newTransaction.descricao}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, descricao: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  placeholder="Ex: Almoço no restaurante"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Valor
                </label>
                <input
                  type="number"
                  value={newTransaction.valor}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, valor: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo
                </label>
                <select
                  value={newTransaction.tipo}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      tipo: e.target.value as "receita" | "despesa",
                    })
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                >
                  <option value="despesa">Despesa</option>
                  <option value="receita">Receita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Categoria
                </label>
                <select
                  value={newTransaction.categoria}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, categoria: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.nome}>
                      {cat.icone} {cat.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={newTransaction.data}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, data: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <button
                onClick={handleAddTransaction}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-lg transition-all"
              >
                Adicionar Transação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Meta */}
      {showMetaModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Nova Meta</h2>
              <button
                onClick={() => setShowMetaModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome da Meta
                </label>
                <input
                  type="text"
                  value={newMeta.nome}
                  onChange={(e) => setNewMeta({ ...newMeta, nome: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  placeholder="Ex: Viagem para Europa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Valor Total
                </label>
                <input
                  type="number"
                  value={newMeta.valor_total}
                  onChange={(e) =>
                    setNewMeta({ ...newMeta, valor_total: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Prazo
                </label>
                <input
                  type="date"
                  value={newMeta.prazo}
                  onChange={(e) => setNewMeta({ ...newMeta, prazo: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <button
                onClick={handleAddMeta}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-lg transition-all"
              >
                Criar Meta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Paywall */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-lg w-full border border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Upgrade para Premium
              </h2>
              <p className="text-slate-400 mb-6">
                Desbloqueie todos os recursos e tome decisões ainda melhores
              </p>

              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <span>Análises "Posso Comprar?" ilimitadas</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <span>Metas ilimitadas</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <span>Roast semanal personalizado</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <span>Exportação completa de dados</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <span>Histórico completo de análises</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaywall(false)}
                  className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
                >
                  Agora não
                </button>
                <button
                  onClick={() => {
                    setIsPremium(true);
                    setShowPaywall(false);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-lg transition-all"
                >
                  Assinar Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dashboard Page Component
function DashboardPage({
  transactions,
  categories,
  onUpgrade,
}: {
  transactions: Transaction[];
  categories: Category[];
  onUpgrade: () => void;
}) {
  const totalReceitas = transactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldoTotal = totalReceitas - totalDespesas;
  const taxaEconomia =
    totalReceitas > 0
      ? ((saldoTotal / totalReceitas) * 100).toFixed(1)
      : "0";

  const fluxoCaixaData = [
    { mes: "Jan", receitas: 5800, despesas: 3200 },
    { mes: "Fev", receitas: 5000, despesas: 3800 },
    { mes: "Mar", receitas: 6200, despesas: 3500 },
    { mes: "Abr", receitas: 5500, despesas: 4000 },
    { mes: "Mai", receitas: 5800, despesas: 3600 },
    { mes: "Jun", receitas: 6000, despesas: 3400 },
  ];

  const gastosPorCategoria = categories
    .filter((cat) => cat.gasto > 0)
    .map((cat) => ({
      name: cat.nome,
      value: cat.gasto,
      color: cat.cor,
    }));

  const gastosDelivery = transactions
    .filter(
      (t) =>
        t.tipo === "despesa" &&
        t.descricao.toLowerCase().includes("ifood")
    )
    .reduce((acc, t) => acc + t.valor, 0);

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Saldo Total</p>
            <DollarSign className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            R${" "}
            {saldoTotal.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
            <ArrowUpCircle className="w-3 h-3" />
            +12.5% vs mês anterior
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Receitas</p>
            <ArrowUpCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            R${" "}
            {totalReceitas.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-slate-500 mt-1">Este mês</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Despesas</p>
            <ArrowDownCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            R${" "}
            {totalDespesas.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-slate-500 mt-1">Este mês</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Taxa de Economia</p>
            <Target className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-white">{taxaEconomia}%</p>
          <p className="text-xs text-slate-500 mt-1">Do total de receitas</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Fluxo de Caixa Mensal
            </h3>
            <select className="text-sm border border-slate-600 rounded-lg px-3 py-1.5 bg-slate-700 text-white">
              <option>Mês</option>
              <option>Ano</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fluxoCaixaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Legend />
              <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
              <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-sm backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6">
            Gastos por Categoria
          </h3>
          {gastosPorCategoria.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gastosPorCategoria}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gastosPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categories
                  .filter((cat) => cat.gasto > 0)
                  .map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.cor }}
                        />
                        <span className="text-slate-300">{cat.nome}</span>
                      </div>
                      <span className="font-semibold text-white">
                        R$ {cat.gasto.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              <div className="text-center">
                <TrendingDown className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum gasto registrado ainda</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      {gastosDelivery > 0 && (
        <div className="bg-gradient-to-r from-purple-900/20 to-purple-700/20 border border-purple-500/30 rounded-xl p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                💡 Insight da Semana
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Você gastou{" "}
                <span className="font-bold text-purple-300">
                  R$ {gastosDelivery.toFixed(2)}
                </span>{" "}
                em delivery este mês. Se tivesse cozinhado 2x por semana,
                sobrariam cerca de{" "}
                <span className="font-bold text-green-400">
                  R$ {(gastosDelivery * 0.6).toFixed(2)}
                </span>
                .
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Pequenas mudanças fazem diferença no final do mês. 🍳
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resumo Semanal */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-purple-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              📊 Resumo da Sua Semana
            </h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              Você está indo bem! Suas despesas estão{" "}
              {totalDespesas < totalReceitas * 0.7
                ? "controladas"
                : "um pouco altas"}{" "}
              este mês.
              {saldoTotal > 0 &&
                ` Você conseguiu economizar R$ ${saldoTotal.toFixed(2)}.`}
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Lock className="w-4 h-4" />
              <span>Roast semanal personalizado disponível no Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orçamentos */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-sm backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-6">
          Orçamentos por Categoria
        </h3>
        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((cat) => {
              const percentual = (cat.gasto / cat.orcamento) * 100;
              const restante = cat.orcamento - cat.gasto;
              return (
                <div key={cat.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.icone}</span>
                      <span className="font-medium text-white">
                        {cat.nome}
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">
                      {percentual.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">
                      Gasto: R$ {cat.gasto.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-slate-400">
                      Orçamento: R$ {cat.orcamento.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(percentual, 100)}%`,
                        backgroundColor: cat.cor,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={
                        restante >= 0 ? "text-green-400" : "text-red-400"
                      }
                    >
                      {restante >= 0 ? "Restante" : "Excedido"}: R${" "}
                      {Math.abs(restante).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <p>Nenhuma categoria configurada ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Extrato Page Component
function ExtratoPage({
  transactions,
  filtro,
  setFiltro,
  onDelete,
  onAdd,
}: {
  transactions: Transaction[];
  filtro: string;
  setFiltro: (filtro: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  const getFilteredTransactions = () => {
    const dias = parseInt(filtro);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    return transactions.filter((t) => new Date(t.data) >= dataLimite);
  };

  const filteredTransactions = getFilteredTransactions();

  const totalReceitas = filteredTransactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = filteredTransactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Extrato</h2>
          <p className="text-slate-400 text-sm">
            Visualize todas as suas transações
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
            {["1", "7", "30"].map((dias) => (
              <button
                key={dias}
                onClick={() => setFiltro(dias)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filtro === dias
                    ? "bg-purple-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {dias === "1" ? "Hoje" : `${dias} dias`}
              </button>
            ))}
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-semibold">Nova Transação</span>
          </button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-1">Receitas</p>
          <p className="text-2xl font-bold text-green-400">
            R${" "}
            {totalReceitas.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-1">Despesas</p>
          <p className="text-2xl font-bold text-red-400">
            R${" "}
            {totalDespesas.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-1">Saldo</p>
          <p
            className={`text-2xl font-bold ${
              saldo >= 0 ? "text-white" : "text-red-400"
            }`}
          >
            R${" "}
            {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-slate-700">
            {filteredTransactions
              .sort(
                (a, b) =>
                  new Date(b.data).getTime() - new Date(a.data).getTime()
              )
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-medium">
                          {transaction.descricao}
                        </span>
                        <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                          {transaction.categoria}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {new Date(transaction.data).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-lg font-bold ${
                          transaction.tipo === "receita"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.tipo === "receita" ? "+" : "-"}R${" "}
                        {transaction.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma transação encontrada neste período</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Categorias Page Component
function CategoriasPage({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Categorias</h2>
        <p className="text-slate-400 text-sm">
          Acompanhe seus gastos por categoria
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const percentual = (cat.gasto / cat.orcamento) * 100;
          const restante = cat.orcamento - cat.gasto;

          return (
            <div
              key={cat.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${cat.cor}20` }}
                  >
                    {cat.icone}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {cat.nome}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {percentual.toFixed(1)}% usado
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Gasto</span>
                  <span className="font-semibold text-white">
                    R$ {cat.gasto.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Orçamento</span>
                  <span className="font-semibold text-white">
                    R$ {cat.orcamento.toLocaleString("pt-BR")}
                  </span>
                </div>

                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(percentual, 100)}%`,
                      backgroundColor: cat.cor,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      restante >= 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {restante >= 0 ? "Disponível" : "Excedido"}
                  </span>
                  <span
                    className={
                      restante >= 0
                        ? "font-semibold text-green-400"
                        : "font-semibold text-red-400"
                    }
                  >
                    R$ {Math.abs(restante).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Metas Page Component
function MetasPage({
  metas,
  isPremium,
  onAdd,
  onAddValor,
  onDelete,
  onUpgrade,
}: {
  metas: Meta[];
  isPremium: boolean;
  onAdd: () => void;
  onAddValor: (metaId: string, valor: number) => void;
  onDelete: (id: string) => void;
  onUpgrade: () => void;
}) {
  const [valorAdicionar, setValorAdicionar] = useState<{
    [key: string]: string;
  }>({});

  const handleAddValor = (metaId: string) => {
    const valor = parseFloat(valorAdicionar[metaId] || "0");
    if (valor > 0) {
      onAddValor(metaId, valor);
      setValorAdicionar({ ...valorAdicionar, [metaId]: "" });
    }
  };

  const canAddMeta = isPremium || metas.length < 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Metas</h2>
          <p className="text-slate-400 text-sm">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <button
          onClick={canAddMeta ? onAdd : onUpgrade}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all"
        >
          {canAddMeta ? (
            <>
              <Plus className="w-4 h-4" />
              <span className="text-sm font-semibold">Nova Meta</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Premium para mais metas
              </span>
            </>
          )}
        </button>
      </div>

      {!isPremium && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-purple-300">
                Plano FREE:
              </span>{" "}
              1 meta ativa •{" "}
              <span className="font-semibold text-purple-300">Premium:</span>{" "}
              Metas ilimitadas
            </p>
          </div>
        </div>
      )}

      {metas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metas.map((meta) => {
            const percentual = (meta.valor_atual / meta.valor_total) * 100;
            const restante = meta.valor_total - meta.valor_atual;
            const diasRestantes = Math.ceil(
              (new Date(meta.prazo).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={meta.id}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {meta.nome}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {diasRestantes > 0
                        ? `${diasRestantes} dias restantes`
                        : "Prazo vencido"}
                    </p>
                  </div>
                  <button
                    onClick={() => onDelete(meta.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Progresso</span>
                      <span className="text-sm font-semibold text-white">
                        {percentual.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-800 rounded-full transition-all"
                        style={{ width: `${Math.min(percentual, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-slate-400">Guardado</p>
                      <p className="text-lg font-bold text-white">
                        R${" "}
                        {meta.valor_atual.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400">Meta</p>
                      <p className="text-lg font-bold text-white">
                        R${" "}
                        {meta.valor_total.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700">
                    <p className="text-sm text-slate-400 mb-2">
                      Faltam R${" "}
                      {restante.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={valorAdicionar[meta.id] || ""}
                        onChange={(e) =>
                          setValorAdicionar({
                            ...valorAdicionar,
                            [meta.id]: e.target.value,
                          })
                        }
                        placeholder="Valor"
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"
                      />
                      <button
                        onClick={() => handleAddValor(meta.id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
          <Target className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-50" />
          <p className="text-slate-400 mb-4">Nenhuma meta criada ainda</p>
          <button
            onClick={onAdd}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all text-white font-semibold"
          >
            Criar Primeira Meta
          </button>
        </div>
      )}
    </div>
  );
}

// Posso Comprar Page Component
function PossoComprarPage({
  valor,
  setValor,
  descricao,
  setDescricao,
  resposta,
  onAnalisar,
  tentativas,
  isPremium,
  historico,
  onUpgrade,
}: {
  valor: string;
  setValor: (valor: string) => void;
  descricao: string;
  setDescricao: (descricao: string) => void;
  resposta: { resposta: "sim" | "nao"; explicacao: string } | null;
  onAnalisar: () => void;
  tentativas: number;
  isPremium: boolean;
  historico: any[];
  onUpgrade: () => void;
}) {
  const podeAnalisar = isPremium || tentativas < 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Posso Comprar?</h2>
        <p className="text-slate-400 text-sm">
          Analise se você pode fazer uma compra sem comprometer suas finanças
        </p>
      </div>

      {!isPremium && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-purple-300">
                Plano FREE:
              </span>{" "}
              1 análise por dia ({tentativas}/1 usada) •{" "}
              <span className="font-semibold text-purple-300">Premium:</span>{" "}
              Análises ilimitadas
            </p>
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Valor da compra
            </label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="R$ 0,00"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Descrição (opcional)
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Notebook novo"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
            />
          </div>

          <button
            onClick={podeAnalisar ? onAnalisar : onUpgrade}
            disabled={!valor || parseFloat(valor) <= 0}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {podeAnalisar ? "Analisar" : "Upgrade para mais análises"}
          </button>
        </div>
      </div>

      {resposta && (
        <div
          className={`rounded-xl border p-6 ${
            resposta.resposta === "sim"
              ? "bg-green-900/20 border-green-500/30"
              : "bg-red-900/20 border-red-500/30"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                resposta.resposta === "sim" ? "bg-green-900" : "bg-red-900"
              }`}
            >
              <span className="text-2xl">
                {resposta.resposta === "sim" ? "✓" : "✗"}
              </span>
            </div>
            <div className="flex-1">
              <h3
                className={`text-xl font-bold mb-2 ${
                  resposta.resposta === "sim"
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {resposta.resposta === "sim"
                  ? "Sim, você pode!"
                  : "Não recomendamos"}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {resposta.explicacao}
              </p>
            </div>
          </div>
        </div>
      )}

      {isPremium && historico.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Histórico de Análises
          </h3>
          <div className="space-y-3">
            {historico.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">
                    R${" "}
                    {item.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  {item.descricao && (
                    <p className="text-sm text-slate-400">{item.descricao}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    {new Date(item.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.resposta === "sim"
                      ? "bg-green-900/30 text-green-300"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  {item.resposta === "sim" ? "Sim" : "Não"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isPremium && historico.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Histórico Completo
              </h3>
              <p className="text-sm text-slate-400">
                Veja todas as suas análises anteriores
              </p>
            </div>
            <button
              onClick={onUpgrade}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span className="text-sm font-semibold">Premium</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Configurações Page Component
function ConfiguracoesPage({
  userName,
  setUserName,
  isPremium,
  onExport,
  onUpgrade,
}: {
  userName: string;
  setUserName: (name: string) => void;
  isPremium: boolean;
  onExport: (format: "pdf" | "csv") => void;
  onUpgrade: () => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSaveName = () => {
    setUserName(tempName);
    localStorage.setItem("userName", tempName);
    setEditingName(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Configurações</h2>
        <p className="text-slate-400 text-sm">
          Gerencie suas preferências e dados
        </p>
      </div>

      {/* Perfil */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Perfil</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nome
            </label>
            {editingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-semibold"
                >
                  Salvar
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-white">{userName}</span>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Editar
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Plano
            </label>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-2">
                {isPremium && <Crown className="w-5 h-5 text-purple-400" />}
                <span className="text-white">
                  {isPremium ? "Premium" : "Free"}
                </span>
              </div>
              {!isPremium && (
                <button
                  onClick={onUpgrade}
                  className="text-sm text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Fazer upgrade
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exportar Dados */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Exportar Dados
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Baixe suas transações e relatórios
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onExport("csv")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-semibold">Exportar CSV</span>
          </button>
          <button
            onClick={() => onExport("pdf")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Exportar PDF {!isPremium && "🔒"}
            </span>
          </button>
        </div>
        {!isPremium && (
          <p className="text-xs text-slate-500 mt-2">
            Exportação em PDF disponível apenas no Premium
          </p>
        )}
      </div>
    </div>
  );
}
