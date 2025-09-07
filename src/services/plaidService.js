import { supabase } from '../lib/supabase';
import { aiService } from './aiService';
import toast from 'react-hot-toast';

class PlaidService {
  constructor() {
    this.clientId = import.meta.env.VITE_PLAID_CLIENT_ID;
    this.publicKey = import.meta.env.VITE_PLAID_PUBLIC_KEY;
    this.environment = import.meta.env.VITE_PLAID_ENV || 'sandbox';
  }

  // Initialize Plaid Link configuration
  getPlaidConfig(userId, onSuccess, onExit) {
    return {
      clientName: 'SavvySpend AI',
      env: this.environment,
      product: ['transactions'],
      publicKey: this.publicKey,
      onSuccess: async (publicToken, metadata) => {
        try {
          await this.exchangePublicToken(userId, publicToken, metadata);
          onSuccess(publicToken, metadata);
        } catch (error) {
          console.error('Error exchanging public token:', error);
          toast.error('Failed to connect account. Please try again.');
        }
      },
      onExit: (error, metadata) => {
        if (error) {
          console.error('Plaid Link error:', error);
          toast.error('Account connection was cancelled or failed.');
        }
        onExit(error, metadata);
      }
    };
  }

  // Exchange public token for access token (this should be done on the backend in production)
  async exchangePublicToken(userId, publicToken, metadata) {
    try {
      // In a real application, this would be a backend API call
      // For demo purposes, we'll simulate the exchange and store mock data
      
      const accessToken = `access-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store account information
      for (const account of metadata.accounts) {
        const { data, error } = await supabase
          .from('accounts')
          .insert({
            user_id: userId,
            account_type: this.mapPlaidAccountType(account.subtype),
            account_name: account.name,
            last_four_digits: account.mask,
            plaid_account_id: account.id,
            plaid_access_token: accessToken,
            institution_name: metadata.institution.name
          });

        if (error) {
          throw error;
        }
      }

      // Fetch initial transactions
      await this.fetchTransactions(userId, accessToken, metadata.accounts);
      
      toast.success(`Successfully connected ${metadata.institution.name}!`);
      return accessToken;
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  }

  // Fetch transactions from Plaid (mock implementation)
  async fetchTransactions(userId, accessToken, accounts) {
    try {
      // In production, this would call Plaid's /transactions/get endpoint
      // For demo purposes, we'll generate mock transactions
      
      const mockTransactions = await this.generateMockTransactions(userId, accounts);
      
      // Process and categorize transactions with AI
      for (const transaction of mockTransactions) {
        const category = await aiService.categorizeExpense(
          transaction.description,
          transaction.amount,
          transaction.merchant
        );

        const anomalyResult = await aiService.detectAnomaly(
          transaction.amount,
          transaction.description
        );

        // Get category ID
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('user_id', userId)
          .eq('category_name', category)
          .single();

        // Insert transaction
        const { error } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            account_id: transaction.account_id,
            amount: transaction.amount,
            description: transaction.description,
            merchant: transaction.merchant,
            date: transaction.date,
            category_id: categoryData?.id,
            is_anomaly: anomalyResult.isAnomaly,
            anomaly_score: anomalyResult.confidence,
            plaid_transaction_id: transaction.plaid_transaction_id
          });

        if (error) {
          console.error('Error inserting transaction:', error);
        }
      }

      return mockTransactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Sync transactions (called periodically)
  async syncTransactions(userId) {
    try {
      // Get all user accounts
      const { data: accounts, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      let totalNewTransactions = 0;

      for (const account of accounts) {
        if (account.plaid_access_token) {
          // In production, this would call Plaid's API with the access token
          // For demo, we'll add a few new mock transactions
          const newTransactions = await this.generateMockTransactions(
            userId, 
            [account], 
            3 // Generate 3 new transactions
          );

          totalNewTransactions += newTransactions.length;

          // Process new transactions
          for (const transaction of newTransactions) {
            const category = await aiService.categorizeExpense(
              transaction.description,
              transaction.amount,
              transaction.merchant
            );

            const anomalyResult = await aiService.detectAnomaly(
              transaction.amount,
              transaction.description
            );

            const { data: categoryData } = await supabase
              .from('categories')
              .select('id')
              .eq('user_id', userId)
              .eq('category_name', category)
              .single();

            await supabase
              .from('transactions')
              .insert({
                user_id: userId,
                account_id: account.id,
                amount: transaction.amount,
                description: transaction.description,
                merchant: transaction.merchant,
                date: transaction.date,
                category_id: categoryData?.id,
                is_anomaly: anomalyResult.isAnomaly,
                anomaly_score: anomalyResult.confidence,
                plaid_transaction_id: transaction.plaid_transaction_id
              });
          }
        }
      }

      if (totalNewTransactions > 0) {
        toast.success(`Synced ${totalNewTransactions} new transactions!`);
      }

      return totalNewTransactions;
    } catch (error) {
      console.error('Error syncing transactions:', error);
      toast.error('Failed to sync transactions. Please try again.');
      throw error;
    }
  }

  // Get account balances (mock implementation)
  async getAccountBalances(userId) {
    try {
      const { data: accounts, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      // In production, this would call Plaid's /accounts/balance/get endpoint
      // For demo, we'll return mock balances
      return accounts.map(account => ({
        account_id: account.id,
        account_name: account.account_name,
        account_type: account.account_type,
        balance: {
          available: Math.random() * 5000 + 1000,
          current: Math.random() * 5000 + 1000,
          currency: 'USD'
        }
      }));
    } catch (error) {
      console.error('Error getting account balances:', error);
      throw error;
    }
  }

  // Remove account connection
  async removeAccount(userId, accountId) {
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ is_active: false })
        .eq('id', accountId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Account disconnected successfully!');
    } catch (error) {
      console.error('Error removing account:', error);
      toast.error('Failed to disconnect account. Please try again.');
      throw error;
    }
  }

  // Helper methods
  mapPlaidAccountType(plaidSubtype) {
    const typeMapping = {
      'checking': 'checking',
      'savings': 'savings',
      'credit card': 'credit',
      'credit': 'credit',
      'investment': 'investment',
      'brokerage': 'investment',
      'ira': 'investment',
      '401k': 'investment'
    };

    return typeMapping[plaidSubtype?.toLowerCase()] || 'checking';
  }

  // Generate mock transactions for demo purposes
  async generateMockTransactions(userId, accounts, count = 20) {
    const merchants = [
      'Starbucks', 'McDonald\'s', 'Whole Foods', 'Target', 'Amazon',
      'Shell Gas Station', 'Uber', 'Netflix', 'Spotify', 'Gym Plus',
      'CVS Pharmacy', 'Best Buy', 'Home Depot', 'Walmart', 'Chipotle',
      'Apple Store', 'Google Play', 'Steam', 'PayPal', 'Venmo'
    ];

    const descriptions = [
      'Coffee purchase', 'Grocery shopping', 'Gas fill-up', 'Online purchase',
      'Restaurant meal', 'Subscription payment', 'Ride share', 'Pharmacy',
      'Electronics', 'Home improvement', 'Entertainment', 'Health & fitness',
      'Mobile payment', 'Digital purchase', 'Food delivery', 'Clothing',
      'Books & media', 'Travel expense', 'Utility payment', 'Insurance'
    ];

    const transactions = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const account = accounts[Math.floor(Math.random() * accounts.length)];
      const isExpense = Math.random() > 0.1; // 90% expenses, 10% income
      const amount = isExpense 
        ? -(Math.random() * 200 + 5) // Expenses: $5-$205
        : (Math.random() * 1000 + 100); // Income: $100-$1100

      const daysAgo = Math.floor(Math.random() * 30);
      const transactionDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

      transactions.push({
        account_id: account.id || account.account_id,
        amount: Math.round(amount * 100) / 100,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        date: transactionDate.toISOString(),
        plaid_transaction_id: `mock_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`
      });
    }

    return transactions;
  }
}

export const plaidService = new PlaidService();
