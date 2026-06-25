import Stripe from 'stripe';
import { config } from '../config/env.js';

export class StripeService {
  private isMock = !config.stripe?.secretKey;
  private stripe: Stripe | null = null;

  constructor() {
    if (!this.isMock && config.stripe?.secretKey) {
      this.stripe = new Stripe(config.stripe.secretKey, {
        apiVersion: '2025-02-24.acacia',
      });
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'rwf', metadata: Record<string, string> = {}) {
    if (this.isMock || !this.stripe) {
      console.log(`[MOCK STRIPE] Created PaymentIntent for ${amount} ${currency}`);
      return {
        client_secret: 'pi_mock_secret_' + Math.random().toString(36).substring(7),
        id: 'pi_mock_' + Math.random().toString(36).substring(7),
        amount,
        currency,
        status: 'requires_payment_method',
      };
    }
    
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
  }

  async createConnectAccount(email: string) {
    if (this.isMock || !this.stripe) {
      console.log(`[MOCK STRIPE] Created Connect Account for ${email}`);
      return {
        id: 'acct_mock_' + Math.random().toString(36).substring(7),
        object: 'account',
      };
    }
    
    return this.stripe.accounts.create({
      type: 'express',
      email,
    });
  }
}

export const stripeService = new StripeService();
