import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

class StripeService {
  constructor() {
    this.stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    this.prices = {
      basic: 'price_basic_monthly', // Replace with actual Stripe price IDs
      premium: 'price_premium_monthly'
    };
  }

  async getStripe() {
    return await this.stripePromise;
  }

  // Create checkout session for subscription
  async createCheckoutSession(userId, priceId) {
    try {
      // In production, this would be a backend API call to create a Stripe checkout session
      // For demo purposes, we'll simulate the process
      
      const { error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Simulate Stripe checkout session creation
      const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In a real app, you would call your backend API here:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, priceId, successUrl, cancelUrl })
      // });
      // const { sessionId } = await response.json();

      // For demo, we'll redirect to a mock success page
      const mockCheckoutUrl = `${window.location.origin}/subscription/success?session_id=${sessionId}&price_id=${priceId}`;
      
      window.location.href = mockCheckoutUrl;
      
      return { sessionId };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process. Please try again.');
      throw error;
    }
  }

  // Handle successful subscription
  async handleSubscriptionSuccess(sessionId, priceId) {
    try {
      // In production, this would verify the session with Stripe and update the user's subscription
      // For demo purposes, we'll simulate the subscription activation
      
      const subscriptionTier = priceId.includes('basic') ? 'basic' : 'premium';
      const mockSubscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update user subscription status
      const { error } = await supabase
        .from('users')
        .update({
          subscription_status: subscriptionTier,
          subscription_id: mockSubscriptionId
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(`Successfully subscribed to ${subscriptionTier} plan!`);
      return { subscriptionTier, subscriptionId: mockSubscriptionId };
    } catch (error) {
      console.error('Error handling subscription success:', error);
      toast.error('Failed to activate subscription. Please contact support.');
      throw error;
    }
  }

  // Create customer portal session
  async createPortalSession(userId, returnUrl) {
    try {
      // In production, this would create a Stripe customer portal session
      // For demo purposes, we'll redirect to a mock portal
      
      const mockPortalUrl = `${window.location.origin}/subscription/manage?return_url=${encodeURIComponent(returnUrl)}`;
      
      window.location.href = mockPortalUrl;
      
      return { url: mockPortalUrl };
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error('Failed to open billing portal. Please try again.');
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      if (!user.subscription_id) {
        throw new Error('No active subscription found');
      }

      // In production, this would call Stripe to cancel the subscription
      // For demo purposes, we'll simulate the cancellation
      
      const { error } = await supabase
        .from('users')
        .update({
          subscription_status: 'free',
          subscription_id: null
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Subscription cancelled successfully');
      return { success: true };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription. Please try again.');
      throw error;
    }
  }

  // Get subscription details
  async getSubscriptionDetails(userId) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // In production, this would fetch subscription details from Stripe
      // For demo purposes, we'll return mock data based on user's subscription status
      
      if (user.subscription_status === 'free') {
        return {
          status: 'free',
          plan: 'Free',
          features: [
            'Basic expense tracking',
            'Simple categorization',
            'Monthly reports',
            'Up to 2 connected accounts'
          ],
          limits: {
            accounts: 2,
            transactions: 100,
            insights: 1
          }
        };
      }

      const isBasic = user.subscription_status === 'basic';
      
      return {
        status: user.subscription_status,
        plan: isBasic ? 'Basic' : 'Premium',
        subscriptionId: user.subscription_id,
        price: isBasic ? 5.00 : 10.00,
        interval: 'month',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Mock: 30 days from now
        features: isBasic ? [
          'Advanced AI categorization',
          'Anomaly detection',
          'Budget tracking',
          'Basic savings recommendations',
          'Up to 5 connected accounts',
          'Email support'
        ] : [
          'All Basic features',
          'Advanced AI insights',
          'Personalized savings recommendations',
          'Spending pattern analysis',
          'Unlimited connected accounts',
          'Priority support',
          'Custom categories',
          'Export data'
        ],
        limits: isBasic ? {
          accounts: 5,
          transactions: 1000,
          insights: 10
        } : {
          accounts: -1, // Unlimited
          transactions: -1,
          insights: -1
        }
      };
    } catch (error) {
      console.error('Error getting subscription details:', error);
      throw error;
    }
  }

  // Check if user has access to feature
  hasFeatureAccess(userSubscription, feature) {
    const featureMap = {
      'advanced_ai': ['basic', 'premium'],
      'anomaly_detection': ['basic', 'premium'],
      'unlimited_accounts': ['premium'],
      'custom_categories': ['premium'],
      'export_data': ['premium'],
      'priority_support': ['premium'],
      'advanced_insights': ['premium']
    };

    const requiredTiers = featureMap[feature];
    if (!requiredTiers) return true; // Feature not restricted

    return requiredTiers.includes(userSubscription?.status || 'free');
  }

  // Get pricing information
  getPricingPlans() {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        description: 'Perfect for getting started with expense tracking',
        features: [
          'Basic expense tracking',
          'Simple categorization',
          'Monthly reports',
          'Up to 2 connected accounts',
          'Community support'
        ],
        limits: {
          accounts: 2,
          transactions: 100,
          insights: 1
        },
        popular: false
      },
      {
        id: 'basic',
        name: 'Basic',
        price: 5,
        interval: 'month',
        priceId: this.prices.basic,
        description: 'Enhanced features for better financial management',
        features: [
          'Advanced AI categorization',
          'Anomaly detection',
          'Budget tracking',
          'Basic savings recommendations',
          'Up to 5 connected accounts',
          'Email support'
        ],
        limits: {
          accounts: 5,
          transactions: 1000,
          insights: 10
        },
        popular: true
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 10,
        interval: 'month',
        priceId: this.prices.premium,
        description: 'Complete financial intelligence and insights',
        features: [
          'All Basic features',
          'Advanced AI insights',
          'Personalized savings recommendations',
          'Spending pattern analysis',
          'Unlimited connected accounts',
          'Priority support',
          'Custom categories',
          'Export data'
        ],
        limits: {
          accounts: -1, // Unlimited
          transactions: -1,
          insights: -1
        },
        popular: false
      }
    ];
  }

  // Handle webhook events (would be implemented on the backend)
  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }

  async handleSubscriptionUpdate() {
    // Update user subscription status in database
    // This would be implemented on the backend
  }

  async handleSubscriptionCancellation() {
    // Handle subscription cancellation
    // This would be implemented on the backend
  }

  async handlePaymentSuccess() {
    // Handle successful payment
    // This would be implemented on the backend
  }

  async handlePaymentFailure() {
    // Handle failed payment
    // This would be implemented on the backend
  }
}

export const stripeService = new StripeService();
