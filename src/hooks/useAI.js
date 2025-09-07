import { useState } from 'react';
import { aiService } from '../services/aiService';
import { useAuth } from '../contexts/AuthContext';

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, profile } = useAuth();

  // Enhanced AI categorization with real OpenAI integration
  const categorizeExpense = async (description, amount, merchant = '') => {
    setIsProcessing(true);
    try {
      const category = await aiService.categorizeExpense(description, amount, merchant);
      return category;
    } catch (error) {
      console.error('Error categorizing expense:', error);
      return 'Other';
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhanced anomaly detection with user history
  const detectAnomaly = async (amount, description, userSpendingHistory = []) => {
    setIsProcessing(true);
    try {
      const result = await aiService.detectAnomaly(amount, description, userSpendingHistory);
      return result.isAnomaly;
    } catch (error) {
      console.error('Error detecting anomaly:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate comprehensive savings recommendations
  const generateSavingsRecommendations = async (transactions, budgets) => {
    setIsProcessing(true);
    try {
      const recommendations = await aiService.generateSavingsRecommendations(
        transactions, 
        budgets, 
        profile
      );
      return recommendations;
    } catch (error) {
      console.error('Error generating savings recommendations:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate spending insights
  const generateSpendingInsights = async (transactions, timeframe = 'month') => {
    setIsProcessing(true);
    try {
      const insights = await aiService.generateSpendingInsights(transactions, timeframe);
      return insights;
    } catch (error) {
      console.error('Error generating spending insights:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Legacy method for backward compatibility
  const generateSavingsRecommendation = async (category) => {
    const mockRecommendations = {
      'dining_out': {
        category: 'Dining Out',
        recommendation: 'Cook at home 2 more days per week and use meal planning apps.',
        potentialSavings: 85,
        confidence: 0.87
      },
      'entertainment': {
        category: 'Entertainment',
        recommendation: 'Bundle streaming services and attend free local events.',
        potentialSavings: 32,
        confidence: 0.74
      },
      'shopping': {
        category: 'Shopping',
        recommendation: 'Use price comparison tools and wait 24h before non-essential purchases.',
        potentialSavings: 56,
        confidence: 0.82
      }
    };
    
    return mockRecommendations[category] || {
      category: 'General',
      recommendation: 'Track your spending more closely and set specific budget limits.',
      potentialSavings: 25,
      confidence: 0.65
    };
  };

  return {
    categorizeExpense,
    detectAnomaly,
    generateSavingsRecommendation, // Legacy
    generateSavingsRecommendations, // New enhanced version
    generateSpendingInsights,
    isProcessing
  };
};
