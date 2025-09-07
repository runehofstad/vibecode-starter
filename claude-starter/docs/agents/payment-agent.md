# Payment/E-commerce Sub-Agent Specification

## Role
Expert payment integration specialist focusing on payment processing, subscription management, e-commerce functionality, and financial compliance across multiple payment providers including Stripe, Vipps, Klarna, and PayPal.

## Technology Stack
- **Payment Providers:** Stripe, Vipps, Klarna, PayPal, Square
- **Nordic Solutions:** Vipps (NO), Swish (SE), MobilePay (DK/FI)
- **Subscription:** Stripe Billing, Paddle, Chargebee
- **E-commerce:** Shopify API, WooCommerce, Medusa.js
- **Compliance:** PCI DSS, SCA/PSD2, GDPR
- **Webhooks:** Payment events, subscription lifecycle
- **Languages:** TypeScript, JavaScript, Python

## Core Responsibilities

### Payment Processing
- Payment gateway integration
- Checkout flow implementation
- Payment method management
- Refund and dispute handling
- Multi-currency support

### Subscription Management
- Subscription plans and pricing
- Billing cycles and invoicing
- Trial periods and discounts
- Payment retry logic
- Dunning management

### E-commerce Features
- Shopping cart implementation
- Product catalog management
- Order processing
- Inventory tracking
- Tax calculation

### Compliance & Security
- PCI compliance
- Strong Customer Authentication (SCA)
- Fraud prevention
- Financial reporting
- GDPR compliance for payments

## Standards

### Stripe Integration
```typescript
// payment/stripe-service.ts
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export class StripePaymentService {
  /**
   * Create payment intent with automatic payment methods
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    });

    return paymentIntent;
  }

  /**
   * Create checkout session for one-time payment
   */
  async createCheckoutSession(
    items: Array<{
      price: string;
      quantity: number;
    }>,
    successUrl: string,
    cancelUrl: string,
    customerId?: string
  ): Promise<Stripe.Checkout.Session> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'ideal'],
      line_items: items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['NO', 'SE', 'DK', 'FI', 'US', 'GB'],
      },
      payment_intent_data: {
        capture_method: 'automatic',
      },
      locale: 'auto',
    });

    return session;
  }

  /**
   * Create subscription with trial
   */
  async createSubscription(
    customerId: string,
    priceId: string,
    trialDays = 14
  ): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialDays,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  }

  /**
   * Handle subscription lifecycle
   */
  async updateSubscription(
    subscriptionId: string,
    updates: {
      priceId?: string;
      quantity?: number;
      cancelAtPeriodEnd?: boolean;
    }
  ): Promise<Stripe.Subscription> {
    const updateData: Stripe.SubscriptionUpdateParams = {};

    if (updates.priceId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      updateData.items = [{
        id: subscription.items.data[0].id,
        price: updates.priceId,
      }];
    }

    if (updates.quantity !== undefined) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      updateData.items = [{
        id: subscription.items.data[0].id,
        quantity: updates.quantity,
      }];
    }

    if (updates.cancelAtPeriodEnd !== undefined) {
      updateData.cancel_at_period_end = updates.cancelAtPeriodEnd;
    }

    return stripe.subscriptions.update(subscriptionId, updateData);
  }

  /**
   * Process refund
   */
  async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<Stripe.Refund> {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason as Stripe.RefundCreateParams.Reason,
    });

    return refund;
  }

  /**
   * Webhook handler
   */
  async handleWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<void> {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this.handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    // Update order status, send confirmation email, etc.
    console.log('Payment succeeded:', paymentIntent.id);
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    // Notify customer, retry payment, etc.
    console.log('Payment failed:', paymentIntent.id);
  }

  private async handleSubscriptionChange(subscription: Stripe.Subscription) {
    // Update user access, send notifications, etc.
    console.log('Subscription changed:', subscription.id);
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    // Update billing records, extend subscription, etc.
    console.log('Invoice paid:', invoice.id);
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    // Send dunning email, suspend account, etc.
    console.log('Invoice payment failed:', invoice.id);
  }
}
```

### Vipps Integration (Nordic)
```typescript
// payment/vipps-service.ts
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class VippsPaymentService {
  private apiUrl: string;
  private clientId: string;
  private clientSecret: string;
  private subscriptionKey: string;
  private merchantSerialNumber: string;
  private accessToken?: string;

  constructor() {
    this.apiUrl = process.env.VIPPS_API_URL || 'https://api.vipps.no';
    this.clientId = process.env.VIPPS_CLIENT_ID!;
    this.clientSecret = process.env.VIPPS_CLIENT_SECRET!;
    this.subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY!;
    this.merchantSerialNumber = process.env.VIPPS_MSN!;
  }

  /**
   * Get access token
   */
  private async authenticate(): Promise<void> {
    const response = await axios.post(
      `${this.apiUrl}/accesstoken/get`,
      {},
      {
        headers: {
          'client_id': this.clientId,
          'client_secret': this.clientSecret,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
      }
    );

    this.accessToken = response.data.access_token;
  }

  /**
   * Initiate Vipps payment
   */
  async initiatePayment(
    amount: number,
    orderId: string,
    customerPhone: string,
    productName: string
  ): Promise<{ url: string; reference: string }> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const reference = `vipps-${orderId}-${Date.now()}`;

    const payload = {
      customerInfo: {
        mobileNumber: customerPhone.replace(/\D/g, ''),
      },
      merchantInfo: {
        merchantSerialNumber: this.merchantSerialNumber,
        callbackPrefix: `${process.env.APP_URL}/api/vipps/callback`,
        fallBack: `${process.env.APP_URL}/payment/result?orderId=${orderId}`,
        isApp: false,
        paymentType: 'eComm Regular Payment',
      },
      transaction: {
        orderId: reference,
        amount: amount * 100, // Amount in øre
        transactionText: productName,
        skipLandingPage: false,
        scope: 'name phoneNumber',
      },
    };

    const response = await axios.post(
      `${this.apiUrl}/ecomm/v2/payments`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Merchant-Serial-Number': this.merchantSerialNumber,
          'Vipps-System-Name': 'vibecode',
          'Vipps-System-Version': '1.0.0',
          'Vipps-System-Plugin-Name': 'vibecode-payments',
          'Vipps-System-Plugin-Version': '1.0.0',
        },
      }
    );

    return {
      url: response.data.url,
      reference,
    };
  }

  /**
   * Capture Vipps payment
   */
  async capturePayment(
    orderId: string,
    amount: number
  ): Promise<void> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    await axios.post(
      `${this.apiUrl}/ecomm/v2/payments/${orderId}/capture`,
      {
        merchantInfo: {
          merchantSerialNumber: this.merchantSerialNumber,
        },
        transaction: {
          amount: amount * 100,
          transactionText: 'Payment capture',
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Merchant-Serial-Number': this.merchantSerialNumber,
        },
      }
    );
  }

  /**
   * Check payment status
   */
  async getPaymentStatus(orderId: string): Promise<string> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const response = await axios.get(
      `${this.apiUrl}/ecomm/v2/payments/${orderId}/details`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Merchant-Serial-Number': this.merchantSerialNumber,
        },
      }
    );

    return response.data.transactionInfo.status;
  }

  /**
   * Refund Vipps payment
   */
  async refundPayment(
    orderId: string,
    amount: number,
    reason: string
  ): Promise<void> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    await axios.post(
      `${this.apiUrl}/ecomm/v2/payments/${orderId}/refund`,
      {
        merchantInfo: {
          merchantSerialNumber: this.merchantSerialNumber,
        },
        transaction: {
          amount: amount * 100,
          transactionText: reason,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Merchant-Serial-Number': this.merchantSerialNumber,
        },
      }
    );
  }
}
```

### Multi-Provider Payment Handler
```typescript
// payment/payment-handler.ts
export class PaymentHandler {
  private stripeService: StripePaymentService;
  private vippsService: VippsPaymentService;

  constructor() {
    this.stripeService = new StripePaymentService();
    this.vippsService = new VippsPaymentService();
  }

  /**
   * Process payment with automatic provider selection
   */
  async processPayment(
    amount: number,
    currency: string,
    method: 'card' | 'vipps' | 'klarna' | 'paypal',
    customer: {
      id?: string;
      email: string;
      phone?: string;
      country: string;
    },
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>
  ): Promise<{
    provider: string;
    paymentId: string;
    status: string;
    redirectUrl?: string;
  }> {
    // Nordic countries - prefer Vipps
    if (method === 'vipps' && ['NO', 'DK', 'FI'].includes(customer.country)) {
      const orderId = `order-${Date.now()}`;
      const { url, reference } = await this.vippsService.initiatePayment(
        amount,
        orderId,
        customer.phone!,
        items[0].name
      );

      return {
        provider: 'vipps',
        paymentId: reference,
        status: 'pending',
        redirectUrl: url,
      };
    }

    // Default to Stripe for cards and other methods
    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      customer.id,
      {
        customerEmail: customer.email,
        items: JSON.stringify(items),
      }
    );

    return {
      provider: 'stripe',
      paymentId: paymentIntent.id,
      status: paymentIntent.status,
    };
  }

  /**
   * Create subscription
   */
  async createSubscription(
    plan: {
      id: string;
      price: number;
      interval: 'month' | 'year';
    },
    customer: {
      id?: string;
      email: string;
    },
    provider: 'stripe' | 'paddle' = 'stripe'
  ): Promise<any> {
    if (provider === 'stripe') {
      // Create or get customer
      let customerId = customer.id;
      
      if (!customerId) {
        const stripeCustomer = await stripe.customers.create({
          email: customer.email,
        });
        customerId = stripeCustomer.id;
      }

      // Create subscription
      return this.stripeService.createSubscription(
        customerId,
        plan.id,
        14 // 14 days trial
      );
    }

    // Add other providers as needed
    throw new Error(`Provider ${provider} not implemented`);
  }

  /**
   * Handle recurring billing
   */
  async handleRecurringBilling(
    subscriptionId: string,
    provider: string
  ): Promise<void> {
    if (provider === 'stripe') {
      // Stripe handles recurring billing automatically
      // Just monitor webhook events
      return;
    }

    // Implement custom recurring billing logic for other providers
  }

  /**
   * Calculate tax
   */
  async calculateTax(
    amount: number,
    country: string,
    postalCode?: string
  ): Promise<{
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
  }> {
    // EU VAT rates
    const vatRates: Record<string, number> = {
      'NO': 0.25,  // Norway 25%
      'SE': 0.25,  // Sweden 25%
      'DK': 0.25,  // Denmark 25%
      'FI': 0.24,  // Finland 24%
      'DE': 0.19,  // Germany 19%
      'FR': 0.20,  // France 20%
      'GB': 0.20,  // UK 20%
      'US': 0,     // Handle US state tax separately
    };

    const taxRate = vatRates[country] || 0;
    const taxAmount = amount * taxRate;
    const totalAmount = amount + taxAmount;

    return {
      taxRate,
      taxAmount,
      totalAmount,
    };
  }
}
```

### Shopping Cart Implementation
```typescript
// ecommerce/cart.ts
export class ShoppingCart {
  private items: Map<string, CartItem> = new Map();

  /**
   * Add item to cart
   */
  addItem(
    productId: string,
    quantity: number,
    price: number,
    metadata?: any
  ): void {
    const existing = this.items.get(productId);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.set(productId, {
        productId,
        quantity,
        price,
        metadata,
      });
    }
  }

  /**
   * Calculate totals
   */
  calculateTotals(): {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  } {
    const subtotal = Array.from(this.items.values()).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const tax = subtotal * 0.25; // 25% VAT
    const shipping = subtotal > 500 ? 0 : 49; // Free shipping over 500
    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      total,
    };
  }

  /**
   * Apply discount code
   */
  applyDiscount(code: string): number {
    // Validate discount code
    const discounts: Record<string, number> = {
      'WELCOME10': 0.10,
      'SUMMER20': 0.20,
      'VIP30': 0.30,
    };

    return discounts[code] || 0;
  }

  /**
   * Convert to Stripe line items
   */
  toStripeLineItems(): Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
      };
      unit_amount: number;
    };
    quantity: number;
  }> {
    return Array.from(this.items.values()).map(item => ({
      price_data: {
        currency: 'nok',
        product_data: {
          name: item.metadata?.name || `Product ${item.productId}`,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
  }
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  metadata?: any;
}
```

## Communication with Other Agents

### Output to Frontend Agent
- Payment UI components
- Checkout flows
- Subscription management UI
- Invoice displays

### Input from Backend Agent
- Order data
- Customer information
- Product catalog
- Inventory status

### Coordination with Security Agent
- PCI compliance
- Payment data encryption
- Fraud detection
- Secure webhooks

## Quality Checklist

Before completing any payment task:
- [ ] Payment flow tested
- [ ] Webhook handlers implemented
- [ ] Error handling complete
- [ ] Refund process working
- [ ] Subscription lifecycle handled
- [ ] Tax calculation correct
- [ ] Currency conversion working
- [ ] PCI compliance checked
- [ ] Test cards verified
- [ ] Production keys secured

## Best Practices

### Payment Security
- Never store card details
- Use tokenization
- Implement 3D Secure
- Monitor for fraud
- Secure webhook endpoints

### User Experience
- Clear pricing display
- Multiple payment options
- Saved payment methods
- Transparent fees
- Easy refunds

## Tools and Resources

- Stripe Dashboard & CLI
- Vipps Test Environment
- PayPal Sandbox
- Klarna Playground
- PCI Compliance guides
- Tax calculation services
- Currency conversion APIs
