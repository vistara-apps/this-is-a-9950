import React, { useState, useEffect, useCallback } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';

const AIInsights = ({ transactions, budgets, generateSavingsRecommendation }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const generateInsights = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newInsights = [
        {
          id: 1,
          type: 'spending_pattern',
          title: 'Increased Coffee Spending',
          description: 'Your coffee purchases have increased by 23% this month compared to last month.',
          impact: 'medium',
          icon: TrendingUp,
          suggestion: 'Consider brewing coffee at home to save $45/month'
        },
        {
          id: 2,
          type: 'anomaly',
          title: 'Unusual Large Purchase',
          description: 'Detected a $245 purchase at Electronics Store - 3x your usual spending.',
          impact: 'high',
          icon: AlertTriangle,
          suggestion: 'Review this transaction for accuracy'
        },
        {
          id: 3,
          type: 'optimization',
          title: 'Subscription Overlap',
          description: 'You have multiple streaming subscriptions that could be consolidated.',
          impact: 'low',
          icon: Lightbulb,
          suggestion: 'Cancel Netflix and keep Disney+ to save $15.99/month'
        }
      ];
      
      setInsights(newInsights);
      
      // Generate savings recommendations
      const recs = await Promise.all([
        generateSavingsRecommendation('dining_out'),
        generateSavingsRecommendation('entertainment'),
        generateSavingsRecommendation('shopping')
      ]);
      
      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  }, [generateSavingsRecommendation]);

  useEffect(() => {
    generateInsights();
  }, [transactions, budgets, generateInsights]);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">AI Insights</h2>
        <button 
          onClick={generateInsights}
          disabled={loading}
          className="btn btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Insights</span>
        </button>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="card p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className="card p-6 animate-slide-up hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getImpactColor(insight.impact)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(insight.impact)}`}>
                        {insight.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-700">💡 {insight.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Savings Recommendations */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Personalized Savings Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{rec.category}</h4>
                <span className="text-green-600 font-semibold">${rec.potentialSavings}/mo</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{rec.recommendation}</p>
              <div className="text-xs text-gray-500">
                Based on your spending patterns over the last 3 months
              </div>
              <button className="w-full mt-3 px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
                Apply Recommendation
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Trends Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Patterns</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Weekday vs Weekend</p>
                <p className="text-sm text-gray-500">Weekend spending is 34% higher</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">+$127</p>
                <p className="text-sm text-gray-500">avg/weekend</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Peak Spending Time</p>
                <p className="text-sm text-gray-500">Most transactions occur 6-8 PM</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">43%</p>
                <p className="text-sm text-gray-500">of daily spend</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Impulse Purchases</p>
                <p className="text-sm text-gray-500">Small transactions under $20</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">$89</p>
                <p className="text-sm text-gray-500">this month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Health Score</h3>
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto relative">
                <svg className="w-24 h-24" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray="75, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">75</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Good financial health</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Budget adherence</span>
                <span className="text-sm font-medium text-green-600">Good</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Savings rate</span>
                <span className="text-sm font-medium text-yellow-600">Moderate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Spending consistency</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
