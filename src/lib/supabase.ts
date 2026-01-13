import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validar se as variáveis estão configuradas
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');

if (!isConfigured) {
  console.warn('⚠️ Variáveis do Supabase não configuradas. Configure em Configurações do Projeto.');
}

// Criar cliente apenas se configurado, caso contrário usar valores dummy
const url = isConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const key = isConfigured ? supabaseAnonKey : 'placeholder-key';

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper para verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return isConfigured;
};

// Types
export interface User {
  id: string;
  email: string;
  nome: string;
  persona: string;
  is_premium: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  data: string;
  parcelado?: boolean;
  parcelas?: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  nome: string;
  cor: string;
  icone: string;
  orcamento: number;
  created_at: string;
}

export interface Meta {
  id: string;
  user_id: string;
  nome: string;
  valor_total: number;
  valor_atual: number;
  prazo: string;
  created_at: string;
}

export interface PossoComprar {
  id: string;
  user_id: string;
  valor: number;
  descricao?: string;
  resposta: 'sim' | 'nao';
  explicacao: string;
  created_at: string;
}
