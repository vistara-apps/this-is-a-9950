import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database schema types for TypeScript-like documentation
export const DatabaseSchema = {
  users: {
    id: 'uuid',
    email: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp',
    subscription_status: 'text', // 'free', 'basic', 'premium'
    subscription_id: 'text'
  },
  accounts: {
    id: 'uuid',
    user_id: 'uuid',
    account_type: 'text', // 'checking', 'savings', 'credit'
    account_name: 'text',
    last_four_digits: 'text',
    plaid_account_id: 'text',
    plaid_access_token: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp'
  },
  transactions: {
    id: 'uuid',
    user_id: 'uuid',
    account_id: 'uuid',
    amount: 'decimal',
    currency: 'text',
    description: 'text',
    merchant: 'text',
    date: 'timestamp',
    category_id: 'uuid',
    is_anomaly: 'boolean',
    plaid_transaction_id: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp'
  },
  categories: {
    id: 'uuid',
    user_id: 'uuid',
    category_name: 'text',
    color: 'text',
    icon: 'text',
    created_at: 'timestamp'
  },
  budgets: {
    id: 'uuid',
    user_id: 'uuid',
    category_id: 'uuid',
    amount: 'decimal',
    period: 'text', // 'weekly', 'monthly', 'yearly'
    start_date: 'date',
    end_date: 'date',
    created_at: 'timestamp',
    updated_at: 'timestamp'
  },
  savings_goals: {
    id: 'uuid',
    user_id: 'uuid',
    goal_name: 'text',
    target_amount: 'decimal',
    current_amount: 'decimal',
    target_date: 'date',
    created_at: 'timestamp',
    updated_at: 'timestamp'
  },
  ai_insights: {
    id: 'uuid',
    user_id: 'uuid',
    insight_type: 'text', // 'savings_recommendation', 'spending_pattern', 'anomaly_alert'
    title: 'text',
    description: 'text',
    data: 'jsonb',
    confidence_score: 'decimal',
    is_read: 'boolean',
    created_at: 'timestamp'
  }
};
