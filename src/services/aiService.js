import OpenAI from 'openai';

class AIService {
  constructor() {
    this.openai = null;
    this.initializeOpenAI();
  }

  initializeOpenAI() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
      });
    } else {
      console.warn('OpenAI API key not found. Using mock AI responses.');
    }
  }

  async categorizeExpense(description, amount, merchant = '') {
    try {
      if (!this.openai) {
        return this.mockCategorizeExpense(description, amount);
      }

      const prompt = `
        Categorize this financial transaction into one of these categories:
        - Food & Dining
        - Transportation
        - Shopping
        - Entertainment
        - Groceries
        - Healthcare
        - Utilities
        - Income
        - Other

        Transaction details:
        Description: ${description}
        Amount: $${Math.abs(amount)}
        Merchant: ${merchant || 'Unknown'}

        Respond with only the category name.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
        temperature: 0.1
      });

      const category = response.choices[0]?.message?.content?.trim();
      return this.validateCategory(category) || 'Other';
    } catch (error) {
      console.error('Error categorizing expense:', error);
      return this.mockCategorizeExpense(description, amount);
    }
  }

  async detectAnomaly(amount, description, userSpendingHistory = []) {
    try {
      if (!this.openai) {
        return this.mockDetectAnomaly(amount, description);
      }

      // Calculate user's average spending patterns
      const avgSpending = userSpendingHistory.length > 0 
        ? userSpendingHistory.reduce((sum, t) => sum + Math.abs(t.amount), 0) / userSpendingHistory.length
        : 50;

      const recentTransactions = userSpendingHistory
        .slice(-10)
        .map(t => `${t.description}: $${Math.abs(t.amount)}`)
        .join('\n');

      const prompt = `
        Analyze this transaction for anomalies based on the user's spending patterns:

        Current Transaction:
        Description: ${description}
        Amount: $${Math.abs(amount)}

        User's Average Transaction: $${avgSpending.toFixed(2)}
        Recent Transactions:
        ${recentTransactions || 'No recent transaction history'}

        Consider these factors:
        1. Is the amount significantly higher than usual?
        2. Is the merchant/description unusual or suspicious?
        3. Does the timing or pattern seem odd?

        Respond with a JSON object:
        {
          "isAnomaly": true/false,
          "confidence": 0.0-1.0,
          "reason": "brief explanation"
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.2
      });

      const result = JSON.parse(response.choices[0]?.message?.content?.trim() || '{}');
      return {
        isAnomaly: result.isAnomaly || false,
        confidence: result.confidence || 0.5,
        reason: result.reason || 'Standard transaction'
      };
    } catch (error) {
      console.error('Error detecting anomaly:', error);
      return this.mockDetectAnomaly(amount, description);
    }
  }

  async generateSavingsRecommendations(transactions, budgets, userProfile) {
    try {
      if (!this.openai) {
        return this.mockGenerateSavingsRecommendations(transactions);
      }

      // Analyze spending patterns
      const categorySpending = this.analyzeCategorySpending(transactions);
      const monthlySpending = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const spendingAnalysis = Object.entries(categorySpending)
        .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
        .join('\n');

      const prompt = `
        Generate personalized savings recommendations based on this spending analysis:

        Monthly Spending: $${monthlySpending.toFixed(2)}
        Category Breakdown:
        ${spendingAnalysis}

        User Subscription: ${userProfile?.subscription_status || 'free'}

        Provide 3-5 actionable savings recommendations. For each recommendation, include:
        1. Category to focus on
        2. Specific actionable advice
        3. Estimated monthly savings potential
        4. Confidence level (0.0-1.0)

        Respond with a JSON array of recommendations:
        [
          {
            "category": "category name",
            "title": "brief title",
            "description": "detailed actionable advice",
            "potentialSavings": 50.00,
            "confidence": 0.85,
            "difficulty": "easy/medium/hard"
          }
        ]
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3
      });

      const recommendations = JSON.parse(response.choices[0]?.message?.content?.trim() || '[]');
      return recommendations.slice(0, 5); // Limit to 5 recommendations
    } catch (error) {
      console.error('Error generating savings recommendations:', error);
      return this.mockGenerateSavingsRecommendations(transactions);
    }
  }

  async generateSpendingInsights(transactions, timeframe = 'month') {
    try {
      if (!this.openai) {
        return this.mockGenerateSpendingInsights(transactions);
      }

      const insights = this.analyzeSpendingTrends(transactions, timeframe);
      
      const prompt = `
        Analyze these spending patterns and provide insights:

        ${JSON.stringify(insights, null, 2)}

        Provide insights about:
        1. Spending trends and patterns
        2. Notable changes or spikes
        3. Recommendations for improvement
        4. Positive spending behaviors to maintain

        Respond with a JSON object:
        {
          "summary": "brief overview",
          "trends": ["trend 1", "trend 2"],
          "alerts": ["alert 1", "alert 2"],
          "positives": ["positive 1", "positive 2"],
          "recommendations": ["rec 1", "rec 2"]
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.4
      });

      return JSON.parse(response.choices[0]?.message?.content?.trim() || '{}');
    } catch (error) {
      console.error('Error generating spending insights:', error);
      return this.mockGenerateSpendingInsights(transactions);
    }
  }

  // Helper methods
  validateCategory(category) {
    const validCategories = [
      'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
      'Groceries', 'Healthcare', 'Utilities', 'Income', 'Other'
    ];
    return validCategories.find(cat => 
      cat.toLowerCase() === category?.toLowerCase()
    );
  }

  analyzeCategorySpending(transactions) {
    const categorySpending = {};
    transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const category = t.category || 'Other';
        categorySpending[category] = (categorySpending[category] || 0) + Math.abs(t.amount);
      });
    return categorySpending;
  }

  analyzeSpendingTrends(transactions, timeframe) {
    // Simple trend analysis - can be enhanced
    const now = new Date();
    const timeframeMs = timeframe === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    const cutoffDate = new Date(now.getTime() - timeframeMs);

    const recentTransactions = transactions.filter(t => new Date(t.date) >= cutoffDate);
    const totalSpent = recentTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      timeframe,
      totalTransactions: recentTransactions.length,
      totalSpent,
      averageTransaction: totalSpent / recentTransactions.length || 0,
      categoryBreakdown: this.analyzeCategorySpending(recentTransactions)
    };
  }

  // Mock methods for fallback when OpenAI is not available
  mockCategorizeExpense(description) {
    const categories = {
      'coffee': 'Food & Dining',
      'starbucks': 'Food & Dining',
      'restaurant': 'Food & Dining',
      'uber': 'Transportation',
      'lyft': 'Transportation',
      'gas': 'Transportation',
      'netflix': 'Entertainment',
      'spotify': 'Entertainment',
      'grocery': 'Groceries',
      'amazon': 'Shopping',
      'target': 'Shopping',
      'gym': 'Healthcare',
      'pharmacy': 'Healthcare',
      'electric': 'Utilities',
      'water': 'Utilities',
      'salary': 'Income',
      'paycheck': 'Income'
    };

    const lowerDesc = description.toLowerCase();
    for (const [keyword, category] of Object.entries(categories)) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
    return 'Other';
  }

  mockDetectAnomaly(amount, description) {
    const isLargeAmount = Math.abs(amount) > 200;
    const isUnusualMerchant = description.toLowerCase().includes('unknown') || 
                             description.toLowerCase().includes('pending');
    
    return {
      isAnomaly: isLargeAmount || isUnusualMerchant,
      confidence: isLargeAmount ? 0.8 : 0.3,
      reason: isLargeAmount ? 'Unusually large transaction amount' : 'Standard transaction'
    };
  }

  mockGenerateSavingsRecommendations() {
    return [
      {
        category: 'Food & Dining',
        title: 'Reduce dining out frequency',
        description: 'Cook at home 2 more days per week and use meal planning apps to save on food costs.',
        potentialSavings: 85,
        confidence: 0.87,
        difficulty: 'easy'
      },
      {
        category: 'Entertainment',
        title: 'Bundle streaming services',
        description: 'Consolidate streaming subscriptions and look for family plans or annual discounts.',
        potentialSavings: 32,
        confidence: 0.74,
        difficulty: 'easy'
      },
      {
        category: 'Shopping',
        title: 'Use price comparison tools',
        description: 'Wait 24 hours before non-essential purchases and use price comparison apps.',
        potentialSavings: 56,
        confidence: 0.82,
        difficulty: 'medium'
      }
    ];
  }

  mockGenerateSpendingInsights() {
    return {
      summary: 'Your spending has been relatively consistent this month with some opportunities for optimization.',
      trends: [
        'Food & dining expenses increased by 15% compared to last month',
        'Transportation costs remained stable'
      ],
      alerts: [
        'Unusual spike in shopping expenses detected',
        'Entertainment spending approaching budget limit'
      ],
      positives: [
        'Grocery spending stayed within budget',
        'No anomalous transactions detected'
      ],
      recommendations: [
        'Consider meal planning to reduce food costs',
        'Review subscription services for potential savings'
      ]
    };
  }
}

export const aiService = new AIService();
