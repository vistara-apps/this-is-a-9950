import { useState } from 'react';

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate AI categorization
  const categorizeExpense = async (description, amount) => {
    setIsProcessing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const categories = {
      'coffee': 'Food & Dining',
      'starbucks': 'Food & Dining',
      'restaurant': 'Food & Dining',
      'uber': 'Transportation',
      'gas': 'Transportation',
      'netflix': 'Entertainment',
      'spotify': 'Entertainment',
      'grocery': 'Groceries',
      'amazon': 'Shopping',
      'target': 'Shopping',
      'gym': 'Health & Fitness',
      'pharmacy': 'Healthcare'
    };
    
    const lowerDesc = description.toLowerCase();
    for (const [keyword, category] of Object.entries(categories)) {
      if (lowerDesc.includes(keyword)) {
        setIsProcessing(false);
        return category;
      }
    }
    
    setIsProcessing(false);
    return 'Other';
  };

  // Simulate anomaly detection
  const detectAnomaly = async (amount, description) => {
    setIsProcessing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simple rules-based anomaly detection
    const isLargeAmount = Math.abs(amount) > 200;
    const isUnusualMerchant = description.toLowerCase().includes('unknown') || 
                             description.toLowerCase().includes('pending');
    
    setIsProcessing(false);
    return isLargeAmount || isUnusualMerchant;
  };

  // Generate savings recommendations
  const generateSavingsRecommendation = async (category) => {
    setIsProcessing(true);
    
    // Simulate AI recommendation generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recommendations = {
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
    
    setIsProcessing(false);
    return recommendations[category] || {
      category: 'General',
      recommendation: 'Track your spending more closely and set specific budget limits.',
      potentialSavings: 25,
      confidence: 0.65
    };
  };

  return {
    categorizeExpense,
    detectAnomaly,
    generateSavingsRecommendation,
    isProcessing
  };
};