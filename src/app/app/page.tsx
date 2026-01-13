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
  Crown,
  Receipt,
  FolderOpen,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
  X
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserData {
  nome: string;
  email: string;
  persona: string;
}

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
  gasto: number;
  orcamento: number;
}

export default function AppPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPaywall, setShowPaywall] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Verificar se usuário está logado
    const user = localStorage.getItem("eixo_user");
    if (!user) {
      router.push("/");
      return;
    }
    setUserData(JSON.parse(user));

    // Carregar dados mockados
    loadMockData();
  }, [router]);

  const loadMockData = () => {
    // Transações mockadas
    const mockTransactions: Transaction[] = [
      { id: "1", descricao: "Salário", valor: 5000, tipo: "receita", categoria: "Salário", data: "2025-01-01" },
      { id: "2", descricao: "Aluguel", valor: 1500, tipo: "despesa", categoria: "Moradia", data: "2025-01-05" },
      { id: "3", descricao: "Supermercado", valor: 450, tipo: "despesa", categoria: "Alimentação", data: "2025-01-08" },
      { id: "4", descricao: "Restaurante", valor: 120, tipo: "despesa", categoria: "Alimentação", data: "2025-01-10" },
      { id: "5", descricao: "Uber", valor: 80, tipo: "despesa", categoria: "Transporte", data: "2025-01-12" },
      { id: "6", descricao: "Netflix", valor: 45, tipo: "despesa", categoria: "Lazer", data: "2025-01-15" },
      { id: "7", descricao: "Academia", valor: 150, tipo: "despesa", categoria: "Saúde", data: "2025-01-18" },
      { id: "8", descricao: "Freelance", valor: 800, tipo: "receita", categoria: "Renda Extra", data: "2025-01-20" },
    ];

    // Categorias mockadas
    const mockCategories: Category[] = [
      { id: "1", nome: "Alimentação", cor: "#8B5CF6", icone: "🍔", gasto: 1870, orcamento: 2000 },
      { id: "2", nome: "Transporte", cor: "#3B82F6", icone: "🚗", gasto: 450, orcamento: 600 },
      { id: "3", nome: "Moradia", cor: "#10B981", icone: "🏠", gasto: 1500, orcamento: 1500 },
      { id: "4", nome: "Lazer", cor: "#F59E0B", icone: "🎮", gasto: 320, orcamento: 500 },
      { id: "5", nome: "Saúde", cor: "#EF4444", icone: "💊", gasto: 280, orcamento: 400 },
    ];

    setTransactions(mockTransactions);
    setCategories(mockCategories);
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FinanceControl</h1>
              </div>
            </div>
            <button
              onClick={() => setShowPaywall(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all"
            >
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Upgrade Premium</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-2 border-b-2 transition-all ${
                activeTab === "dashboard"
                  ? "border-black text-black font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("extrato")}
              className={`py-4 px-2 border-b-2 transition-all ${
                activeTab === "extrato"
                  ? "border-black text-black font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Extrato
            </button>
            <button
              onClick={() => setActiveTab("categorias")}
              className={`py-4 px-2 border-b-2 transition-all ${
                activeTab === "categorias"
                  ? "border-black text-black font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Categorias
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`py-4 px-2 border-b-2 transition-all ${
                activeTab === "config"
                  ? "border-black text-black font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Configurações
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <DashboardPage 
            transactions={transactions} 
            categories={categories}
            onUpgrade={() => setShowPaywall(true)} 
          />
        )}
        {activeTab === "extrato" && (
          <ExtratoPage 
            transactions={transactions}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        )}
        {activeTab === "categorias" && (
          <CategoriasPage categories={categories} />
        )}
        {activeTab === "config" && <ConfigPage userData={userData} />}
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal persona={userData.persona} onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}

// Dashboard Page
function DashboardPage({ 
  transactions, 
  categories,
  onUpgrade 
}: { 
  transactions: Transaction[];
  categories: Category[];
  onUpgrade: () => void;
}) {
  // Calcular totais
  const totalReceitas = transactions
    .filter(t => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);
  
  const totalDespesas = transactions
    .filter(t => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);
  
  const saldoTotal = totalReceitas - totalDespesas;
  const taxaEconomia = totalReceitas > 0 ? ((saldoTotal / totalReceitas) * 100).toFixed(1) : "0";

  // Dados para gráfico de fluxo de caixa
  const fluxoCaixaData = [
    { mes: "Jan", receitas: 5800, despesas: 3200 },
    { mes: "Fev", receitas: 5000, despesas: 3800 },
    { mes: "Mar", receitas: 6200, despesas: 3500 },
    { mes: "Abr", receitas: 5500, despesas: 4000 },
    { mes: "Mai", receitas: 5800, despesas: 3600 },
    { mes: "Jun", receitas: 6000, despesas: 3400 },
  ];

  // Dados para gráfico de pizza
  const gastosPorCategoria = categories.map(cat => ({
    name: cat.nome,
    value: cat.gasto,
    color: cat.cor,
  }));

  const COLORS = categories.map(cat => cat.cor);

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Saldo Total</p>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            R$ {saldoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <ArrowUpCircle className="w-3 h-3" />
            +12.5% vs mês anterior
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Receitas</p>
            <ArrowUpCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            R$ {totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Este mês</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Despesas</p>
            <ArrowDownCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Este mês</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Taxa de Economia</p>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{taxaEconomia}%</p>
          <p className="text-xs text-gray-500 mt-1">Do total de receitas</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fluxo de Caixa Mensal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Fluxo de Caixa Mensal</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
              <option>Mês</option>
              <option>Ano</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fluxoCaixaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
              <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gastos por Categoria */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gastosPorCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.cor }} />
                  <span className="text-gray-700">{cat.nome}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  R$ {cat.gasto.toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orçamentos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Orçamentos por Categoria</h3>
        <div className="space-y-4">
          {categories.map((cat) => {
            const percentual = (cat.gasto / cat.orcamento) * 100;
            const restante = cat.orcamento - cat.gasto;
            return (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icone}</span>
                    <span className="font-medium text-gray-900">{cat.nome}</span>
                  </div>
                  <span className="text-sm text-gray-600">{percentual.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    Gasto: R$ {cat.gasto.toLocaleString("pt-BR")}
                  </span>
                  <span className="text-gray-600">
                    Orçamento: R$ {cat.orcamento.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all"
                    style={{ width: `${Math.min(percentual, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={restante >= 0 ? "text-green-600" : "text-red-600"}>
                    {restante >= 0 ? "Restante" : "Excedido"}: R$ {Math.abs(restante).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Extrato Page
function ExtratoPage({ 
  transactions,
  onAddTransaction,
  onDeleteTransaction
}: { 
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  onDeleteTransaction: (id: string) => void;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "receita" | "despesa">("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroPeriodo, setFiltroPeriodo] = useState("30");
  const [busca, setBusca] = useState("");

  // Filtrar transações
  const transacoesFiltradas = transactions.filter(t => {
    const matchTipo = filtroTipo === "todos" || t.tipo === filtroTipo;
    const matchCategoria = filtroCategoria === "todas" || t.categoria === filtroCategoria;
    const matchBusca = t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                       t.categoria.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchCategoria && matchBusca;
  });

  // Calcular resumo
  const totalReceitas = transacoesFiltradas
    .filter(t => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);
  
  const totalDespesas = transacoesFiltradas
    .filter(t => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);
  
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Extrato Completo</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Filtros Avançados */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Filtros Avançados</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descrição ou categoria"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroPeriodo("0")}
              className={`px-3 py-2 text-sm rounded-lg ${
                filtroPeriodo === "0" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setFiltroPeriodo("7")}
              className={`px-3 py-2 text-sm rounded-lg ${
                filtroPeriodo === "7" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setFiltroPeriodo("30")}
              className={`px-3 py-2 text-sm rounded-lg ${
                filtroPeriodo === "30" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              30 dias
            </button>
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="todos">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="todas">Todas as categorias</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Moradia">Moradia</option>
            <option value="Lazer">Lazer</option>
            <option value="Saúde">Saúde</option>
          </select>
        </div>
      </div>

      {/* Resumo de Transações */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Período</p>
            <p className="font-semibold text-gray-900">Últimos {filtroPeriodo} dias</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Transações</p>
            <p className="font-semibold text-gray-900">{transacoesFiltradas.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Receitas</p>
            <p className="font-semibold text-green-600">
              R$ {totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Despesas</p>
            <p className="font-semibold text-red-600">
              R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Saldo</p>
            <p className={`font-semibold ${saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
              R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {transacoesFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ajuste os filtros ou adicione uma nova transação
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
            >
              Adicionar Transação
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transacoesFiltradas.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.tipo === "receita" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {transaction.tipo === "receita" ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.descricao}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{transaction.categoria}</span>
                        <span>•</span>
                        <span>{format(new Date(transaction.data), "dd/MM/yyyy", { locale: ptBR })}</span>
                        {transaction.parcelado && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600">{transaction.parcelas}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`text-lg font-semibold ${
                      transaction.tipo === "receita" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.tipo === "receita" ? "+" : "-"}R$ {transaction.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar Transação */}
      {showAddModal && (
        <AddTransactionModal
          onClose={() => setShowAddModal(false)}
          onAdd={onAddTransaction}
        />
      )}
    </div>
  );
}

// Modal Adicionar Transação
function AddTransactionModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, "id">) => void;
}) {
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("Alimentação");
  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));
  const [parcelado, setParcelado] = useState(false);
  const [parcelas, setParcelas] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      descricao,
      valor: parseFloat(valor),
      tipo,
      categoria,
      data,
      parcelado,
      parcelas: parcelado ? parcelas : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Nova Transação</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTipo("receita")}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                tipo === "receita"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setTipo("despesa")}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                tipo === "despesa"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Despesa
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: Supermercado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option>Alimentação</option>
              <option>Transporte</option>
              <option>Moradia</option>
              <option>Lazer</option>
              <option>Saúde</option>
              <option>Salário</option>
              <option>Renda Extra</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="parcelado"
              checked={parcelado}
              onChange={(e) => setParcelado(e.target.checked)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="parcelado" className="text-sm font-medium text-gray-700">
              Compra parcelada
            </label>
          </div>

          {parcelado && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parcelas
              </label>
              <input
                type="text"
                value={parcelas}
                onChange={(e) => setParcelas(e.target.value)}
                placeholder="Ex: 3/12"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Categorias Page
function CategoriasPage({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const percentual = (cat.gasto / cat.orcamento) * 100;
          const restante = cat.orcamento - cat.gasto;
          return (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${cat.cor}20` }}
                  >
                    {cat.icone}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.nome}</h3>
                    <p className="text-sm text-gray-600">{percentual.toFixed(1)}% usado</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gasto</span>
                  <span className="font-semibold text-gray-900">
                    R$ {cat.gasto.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Orçamento</span>
                  <span className="font-semibold text-gray-900">
                    R$ {cat.orcamento.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(percentual, 100)}%`,
                      backgroundColor: cat.cor,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={restante >= 0 ? "text-green-600" : "text-red-600"}>
                    {restante >= 0 ? "Restante" : "Excedido"}
                  </span>
                  <span className={`font-semibold ${restante >= 0 ? "text-green-600" : "text-red-600"}`}>
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

// Configurações
function ConfigPage({ userData }: { userData: UserData }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("eixo_user");
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
          <p className="text-sm text-gray-600">Nome</p>
          <p className="font-semibold text-gray-900">{userData.nome}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-semibold text-gray-900">{userData.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Perfil Financeiro</p>
          <p className="font-semibold text-gray-900 capitalize">{userData.persona}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full px-6 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all"
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 space-y-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full mb-4">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Premium</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{content.headline}</h2>
        </div>

        <div className="space-y-3">
          {content.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900 mb-1">
            R$ 29,90<span className="text-lg text-gray-600">/mês</span>
          </p>
          <p className="text-sm text-gray-600">Cancele quando quiser</p>
        </div>

        <button className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg">
          Quero decidir com segurança
        </button>

        <p className="text-xs text-gray-500 text-center">
          7 dias de garantia. Se não gostar, devolvemos seu dinheiro.
        </p>
      </div>
    </div>
  );
}
