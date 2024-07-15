import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import * as stripe from "stripe";

type ConnectAccount = {
  account: string;
  message?: string;
};
type StripeAccountDto = {
  email: string;
  companyName: string;
  country: string;
};
type StripePriceDto = {
  currency: string;
  unit_amount: number;
  recurring: {
    interval: string;
    interval_count: number;
  };
};
type MembershipDTO = {
  name?: string;
  description?: string;
  default_price_data?: StripePriceDto;
};

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }
  async createSubscriptionIntent(params: {
    priceId: string;
    customerId: string;
    confirmationTokenId: string;
  }) {

    try {
      const subscription = await this.stripe.subscriptions.create(
        {
          customer: params.customerId,
          items: [{ price: params.priceId }],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
        },
      );
      // Confirm intent with collected payment method
      const {status, clientSecret} = await this.stripe.paymentIntents.confirm(
          subscription.latest_invoice.payment_intent.id,
          {
            confirmation_token: params.confirmationTokenId,
          }
      );
      return {
        priceId: subscription.items.data[0].price.id,
        subscriptionId: subscription.id,
        clientSecret: clientSecret,
        status: status,
      };
    } catch (error) {
      return {
        error: {message: error},
      };
    }
  }

  async getAllInvoices(customerId: string) {
    try {
      const invoices = await this.stripe.invoices.list();
      return invoices.data;
    } catch (error) {
      return {
        message: error,
      };
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    userId: number,
  ) {
    try {
      const deletedSubscription = await this.stripe.subscriptions.cancel(
        subscriptionId,
      );
      // Call the API to update the user role FINISH THIS LATER i didn't test it
      return deletedSubscription;
    } catch (error) {
      return {
        message: error,
      };
    }
  }
}
