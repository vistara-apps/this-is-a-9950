export const mockData = {
  transactions: [
    {
      id: '1',
      description: 'Coffee at Starbucks',
      amount: -5.99,
      merchant: 'Starbucks',
      date: '2024-01-15T10:30:00Z',
      category: 'Food & Dining',
      isAnomaly: false
    },
    {
      id: '2',
      description: 'Grocery Shopping',
      amount: -89.45,
      merchant: 'Whole Foods',
      date: '2024-01-14T16:45:00Z',
      category: 'Groceries',
      isAnomaly: false
    },
    {
      id: '3',
      description: 'Salary Deposit',
      amount: 3500.00,
      merchant: 'Employer Inc',
      date: '2024-01-13T09:00:00Z',
      category: 'Income',
      isAnomaly: false
    },
    {
      id: '4',
      description: 'Gas Station',
      amount: -45.20,
      merchant: 'Shell',
      date: '2024-01-12T18:20:00Z',
      category: 'Transportation',
      isAnomaly: false
    },
    {
      id: '5',
      description: 'Netflix Subscription',
      amount: -15.99,
      merchant: 'Netflix',
      date: '2024-01-11T12:00:00Z',
      category: 'Entertainment',
      isAnomaly: false
    },
    {
      id: '6',
      description: 'Electronics Store',
      amount: -245.99,
      merchant: 'Best Buy',
      date: '2024-01-10T14:30:00Z',
      category: 'Shopping',
      isAnomaly: true
    },
    {
      id: '7',
      description: 'Restaurant Dinner',
      amount: -67.80,
      merchant: 'Italian Bistro',
      date: '2024-01-09T19:45:00Z',
      category: 'Food & Dining',
      isAnomaly: false
    },
    {
      id: '8',
      description: 'Uber Ride',
      amount: -12.50,
      merchant: 'Uber',
      date: '2024-01-08T08:15:00Z',
      category: 'Transportation',
      isAnomaly: false
    },
    {
      id: '9',
      description: 'Gym Membership',
      amount: -29.99,
      merchant: 'FitLife Gym',
      date: '2024-01-07T06:00:00Z',
      category: 'Health & Fitness',
      isAnomaly: false
    },
    {
      id: '10',
      description: 'Amazon Purchase',
      amount: -34.99,
      merchant: 'Amazon',
      date: '2024-01-06T22:30:00Z',
      category: 'Shopping',
      isAnomaly: false
    }
  ],
  
  budgets: [
    {
      id: '1',
      category: 'Food & Dining',
      amount: 400,
      period: 'monthly'
    },
    {
      id: '2',
      category: 'Transportation',
      amount: 200,
      period: 'monthly'
    },
    {
      id: '3',
      category: 'Entertainment',
      amount: 100,
      period: 'monthly'
    },
    {
      id: '4',
      category: 'Shopping',
      amount: 300,
      period: 'monthly'
    },
    {
      id: '5',
      category: 'Groceries',
      amount: 350,
      period: 'monthly'
    }
  ],
  
  savingsGoals: [
    {
      id: '1',
      goalName: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2850,
      targetDate: '2024-12-31'
    },
    {
      id: '2',
      goalName: 'Vacation',
      targetAmount: 2000,
      currentAmount: 650,
      targetDate: '2024-06-30'
    },
    {
      id: '3',
      goalName: 'New Laptop',
      targetAmount: 1500,
      currentAmount: 400,
      targetDate: '2024-04-15'
    }
  ]
};