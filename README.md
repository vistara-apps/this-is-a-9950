# SavvySpend AI

Your AI-powered companion for effortless expense tracking and smart savings.

![SavvySpend AI Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=SavvySpend+AI+Dashboard)

## 🚀 Features

### Core Features
- **Automated Expense Categorization**: Connect bank accounts and credit cards to automatically import transactions and categorize them with high accuracy using AI
- **Spending Anomaly Detection**: Monitor spending patterns and get alerts for unusual or unexpected transactions
- **Personalized Savings Recommendations**: Get tailored, actionable advice on where to cut back and save money
- **Budget Performance Tracking**: Visualize spending against customizable budgets and financial goals

### AI-Powered Intelligence
- Real-time transaction categorization using OpenAI
- Anomaly detection for fraud prevention
- Personalized savings insights
- Spending pattern analysis
- Smart budget recommendations

### Subscription Tiers
- **Free**: Basic expense tracking, simple categorization, up to 2 connected accounts
- **Basic ($5/month)**: Advanced AI categorization, anomaly detection, up to 5 accounts
- **Premium ($10/month)**: All features, unlimited accounts, advanced insights, priority support

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-3.5 Turbo
- **Banking**: Plaid API (for bank connections)
- **Payments**: Stripe (for subscriptions)
- **UI Components**: Lucide React, Recharts, Headless UI
- **Forms**: React Hook Form
- **State Management**: Zustand
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-9950.git
cd this-is-a-9950
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the environment example file and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Plaid Configuration (Optional for demo)
VITE_PLAID_CLIENT_ID=your_plaid_client_id
VITE_PLAID_PUBLIC_KEY=your_plaid_public_key
VITE_PLAID_ENV=sandbox

# Stripe Configuration (Optional for demo)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Application Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api
```

### 4. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema from `database/schema.sql` in your Supabase SQL editor
3. Update your `.env` file with the Supabase URL and anon key

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🔐 Demo Account

For testing purposes, you can use the demo account:
- **Email**: demo@savvyspend.ai
- **Password**: demo123

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── ui/              # Reusable UI components
│   └── ...              # Feature-specific components
├── contexts/            # React contexts (Auth, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── services/            # API services (AI, Plaid, Stripe)
├── data/                # Mock data and constants
└── styles/              # CSS and styling files

database/
└── schema.sql           # Database schema and setup

public/                  # Static assets
```

## 🔧 Configuration

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Run the SQL schema from `database/schema.sql`
4. Enable Row Level Security (RLS) policies

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add it to your `.env` file as `VITE_OPENAI_API_KEY`

### Plaid Setup (Optional)

1. Create a developer account at [Plaid](https://plaid.com)
2. Get your client ID and public key
3. Add them to your `.env` file

### Stripe Setup (Optional)

1. Create an account at [Stripe](https://stripe.com)
2. Get your publishable key from the dashboard
3. Add it to your `.env` file

## 🚀 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify](https://netlify.com)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Features Overview

### Dashboard
- Real-time spending overview
- Budget progress tracking
- Recent transactions
- AI-generated insights

### Transactions
- Automatic categorization
- Manual transaction entry
- Search and filtering
- Anomaly detection alerts

### Budget Management
- Create custom budgets
- Track spending against limits
- Visual progress indicators
- Smart recommendations

### AI Insights
- Personalized savings recommendations
- Spending pattern analysis
- Anomaly alerts
- Financial health score

## 🔒 Security

- Row Level Security (RLS) with Supabase
- Secure authentication with JWT tokens
- API key protection
- Data encryption in transit and at rest

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@savvyspend.ai
- 💬 Discord: [Join our community](https://discord.gg/savvyspend)
- 📖 Documentation: [docs.savvyspend.ai](https://docs.savvyspend.ai)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Investment tracking
- [ ] Bill reminders and notifications
- [ ] Multi-currency support
- [ ] API for third-party integrations
- [ ] Advanced AI insights with GPT-4

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for AI capabilities
- [Supabase](https://supabase.com) for backend infrastructure
- [Plaid](https://plaid.com) for banking integrations
- [Stripe](https://stripe.com) for payment processing
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for icons

---

Made with ❤️ by the SavvySpend AI team
