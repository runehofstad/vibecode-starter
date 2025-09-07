# Email/Communication Sub-Agent Specification

## Role
Expert communication specialist focusing on email delivery, SMS messaging, push notifications, and multi-channel communication strategies for transactional and marketing messages.

## Technology Stack
- **Email Services:** SendGrid, AWS SES, Mailgun, Postmark, Resend
- **SMS Services:** Twilio, Vonage (Nexmo), MessageBird
- **Push Notifications:** Firebase Cloud Messaging, OneSignal, Pusher Beams
- **Templates:** React Email, MJML, Handlebars, Pug
- **Queuing:** Bull, AWS SQS, RabbitMQ
- **Analytics:** SendGrid Analytics, Mailchimp, Customer.io
- **Languages:** TypeScript, JavaScript, HTML, CSS

## Core Responsibilities

### Email Management
- Transactional email sending
- Marketing campaigns
- Email templates
- Bounce handling
- Unsubscribe management

### SMS Messaging
- SMS delivery
- Two-factor authentication
- Alerts and notifications
- International messaging
- Delivery reports

### Push Notifications
- Mobile push setup
- Web push notifications
- Segmentation
- Rich notifications
- Analytics tracking

### Template Management
- Responsive email design
- Dynamic content
- Personalization
- A/B testing
- Multi-language support

## Standards

### Email Service Implementation
```typescript
// email/email-service.ts
import sgMail from '@sendgrid/mail';
import { SES } from 'aws-sdk';
import { Resend } from 'resend';
import { compile } from 'handlebars';
import mjml2html from 'mjml';
import { z } from 'zod';

export class EmailService {
  private sendgrid: typeof sgMail;
  private ses: SES;
  private resend: Resend;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    // Initialize SendGrid
    this.sendgrid = sgMail;
    this.sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

    // Initialize AWS SES
    this.ses = new SES({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    // Initialize Resend
    this.resend = new Resend(process.env.RESEND_API_KEY!);

    this.loadTemplates();
  }

  /**
   * Send transactional email
   */
  async sendTransactional(
    to: string | string[],
    template: string,
    data: Record<string, any>,
    options: EmailOptions = {}
  ): Promise<void> {
    const { provider = 'sendgrid', attachments, replyTo } = options;

    // Render template
    const { html, text, subject } = await this.renderTemplate(template, data);

    // Validate email
    const emailSchema = z.string().email();
    const recipients = Array.isArray(to) ? to : [to];
    recipients.forEach(email => emailSchema.parse(email));

    try {
      switch (provider) {
        case 'sendgrid':
          await this.sendWithSendGrid({
            to: recipients,
            subject,
            html,
            text,
            attachments,
            replyTo,
          });
          break;

        case 'ses':
          await this.sendWithSES({
            to: recipients,
            subject,
            html,
            text,
          });
          break;

        case 'resend':
          await this.sendWithResend({
            to: recipients,
            subject,
            html,
            text,
          });
          break;

        default:
          throw new Error(`Unknown provider: ${provider}`);
      }

      // Track email sent
      await this.trackEmail({
        to: recipients,
        template,
        provider,
        timestamp: new Date(),
      });

    } catch (error) {
      console.error('Failed to send email:', error);
      
      // Fallback to another provider
      if (provider === 'sendgrid') {
        await this.sendTransactional(to, template, data, {
          ...options,
          provider: 'ses',
        });
      } else {
        throw error;
      }
    }
  }

  /**
   * Send with SendGrid
   */
  private async sendWithSendGrid(params: {
    to: string[];
    subject: string;
    html: string;
    text: string;
    attachments?: any[];
    replyTo?: string;
  }): Promise<void> {
    const msg = {
      to: params.to,
      from: {
        email: process.env.FROM_EMAIL!,
        name: process.env.FROM_NAME!,
      },
      subject: params.subject,
      text: params.text,
      html: params.html,
      replyTo: params.replyTo,
      attachments: params.attachments,
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true },
      },
      mailSettings: {
        sandboxMode: {
          enable: process.env.NODE_ENV === 'development',
        },
      },
    };

    await this.sendgrid.send(msg);
  }

  /**
   * Send with AWS SES
   */
  private async sendWithSES(params: {
    to: string[];
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    const sesParams = {
      Destination: {
        ToAddresses: params.to,
      },
      Message: {
        Body: {
          Html: { Data: params.html },
          Text: { Data: params.text },
        },
        Subject: { Data: params.subject },
      },
      Source: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    };

    await this.ses.sendEmail(sesParams).promise();
  }

  /**
   * Send with Resend
   */
  private async sendWithResend(params: {
    to: string[];
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    await this.resend.emails.send({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
  }

  /**
   * Send marketing campaign
   */
  async sendCampaign(
    segment: string,
    template: string,
    data: Record<string, any>
  ): Promise<void> {
    // Get recipients from segment
    const recipients = await this.getSegmentRecipients(segment);

    // Batch send
    const batchSize = 1000;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      // Personalize for each recipient
      const personalizedEmails = batch.map(recipient => ({
        to: recipient.email,
        substitutions: {
          ...data,
          firstName: recipient.firstName,
          lastName: recipient.lastName,
          unsubscribeUrl: this.generateUnsubscribeUrl(recipient.id),
        },
      }));

      await this.sendBatch(template, personalizedEmails);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  /**
   * Render email template
   */
  private async renderTemplate(
    templateName: string,
    data: Record<string, any>
  ): Promise<{
    html: string;
    text: string;
    subject: string;
  }> {
    const template = this.templates.get(templateName);
    
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // Compile with data
    const mjml = template(data);
    
    // Convert MJML to HTML
    const { html } = mjml2html(mjml);
    
    // Extract subject from template
    const subjectMatch = mjml.match(/<mj-title>(.*?)<\/mj-title>/);
    const subject = subjectMatch ? subjectMatch[1] : 'No subject';
    
    // Generate text version
    const text = this.htmlToText(html);

    return { html, text, subject };
  }

  /**
   * Load email templates
   */
  private loadTemplates(): void {
    // Welcome email template
    const welcomeTemplate = `
      <mjml>
        <mj-head>
          <mj-title>Welcome to {{appName}}!</mj-title>
          <mj-preview>Get started with your new account</mj-preview>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image src="{{logoUrl}}" width="200px" />
              <mj-text font-size="24px" font-weight="bold">
                Welcome, {{firstName}}!
              </mj-text>
              <mj-text>
                Thanks for joining {{appName}}. We're excited to have you on board.
              </mj-text>
              <mj-button href="{{ctaUrl}}" background-color="#667eea">
                Get Started
              </mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;

    this.templates.set('welcome', compile(welcomeTemplate));

    // Add more templates...
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .trim();
  }

  private async trackEmail(data: any): Promise<void> {
    // Track email metrics
  }

  private async getSegmentRecipients(segment: string): Promise<any[]> {
    // Get recipients from database
    return [];
  }

  private generateUnsubscribeUrl(userId: string): string {
    return `${process.env.APP_URL}/unsubscribe?token=${userId}`;
  }

  private async sendBatch(template: string, emails: any[]): Promise<void> {
    // Batch send implementation
  }
}

interface EmailOptions {
  provider?: 'sendgrid' | 'ses' | 'resend';
  attachments?: any[];
  replyTo?: string;
}
```

### SMS Service Implementation
```typescript
// sms/sms-service.ts
import twilio from 'twilio';
import { Vonage } from '@vonage/server-sdk';

export class SMSService {
  private twilioClient: twilio.Twilio;
  private vonageClient: Vonage;
  private phoneNumberPool: string[] = [];

  constructor() {
    // Initialize Twilio
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    // Initialize Vonage
    this.vonageClient = new Vonage({
      apiKey: process.env.VONAGE_API_KEY!,
      apiSecret: process.env.VONAGE_API_SECRET!,
    });

    // Load phone number pool for load balancing
    this.phoneNumberPool = (process.env.SMS_PHONE_NUMBERS || '').split(',');
  }

  /**
   * Send SMS
   */
  async sendSMS(
    to: string,
    message: string,
    options: SMSOptions = {}
  ): Promise<void> {
    const { provider = 'twilio', mediaUrl } = options;

    // Validate phone number
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to)) {
      throw new Error('Invalid phone number format');
    }

    // Check message length
    if (message.length > 1600) {
      throw new Error('Message too long');
    }

    try {
      switch (provider) {
        case 'twilio':
          await this.sendWithTwilio(to, message, mediaUrl);
          break;

        case 'vonage':
          await this.sendWithVonage(to, message);
          break;

        default:
          throw new Error(`Unknown SMS provider: ${provider}`);
      }

      // Track SMS
      await this.trackSMS({
        to,
        message,
        provider,
        timestamp: new Date(),
      });

    } catch (error) {
      console.error('Failed to send SMS:', error);
      
      // Fallback to another provider
      if (provider === 'twilio') {
        await this.sendSMS(to, message, {
          ...options,
          provider: 'vonage',
        });
      } else {
        throw error;
      }
    }
  }

  /**
   * Send with Twilio
   */
  private async sendWithTwilio(
    to: string,
    body: string,
    mediaUrl?: string[]
  ): Promise<void> {
    const from = this.getPhoneNumber();

    await this.twilioClient.messages.create({
      body,
      from,
      to,
      mediaUrl,
      statusCallback: `${process.env.APP_URL}/api/sms/status`,
    });
  }

  /**
   * Send with Vonage
   */
  private async sendWithVonage(to: string, text: string): Promise<void> {
    const from = process.env.VONAGE_BRAND_NAME || 'Vibecode';

    await this.vonageClient.sms.send({
      to,
      from,
      text,
    });
  }

  /**
   * Send OTP
   */
  async sendOTP(phoneNumber: string): Promise<string> {
    const otp = this.generateOTP();
    const message = `Your verification code is: ${otp}. Valid for 10 minutes.`;

    await this.sendSMS(phoneNumber, message);

    // Store OTP with expiry
    await this.storeOTP(phoneNumber, otp);

    return otp;
  }

  /**
   * Verify OTP
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const storedOTP = await this.getStoredOTP(phoneNumber);
    
    if (!storedOTP) {
      return false;
    }

    if (storedOTP === otp) {
      await this.clearOTP(phoneNumber);
      return true;
    }

    return false;
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSMS(
    recipients: string[],
    message: string
  ): Promise<void> {
    // Rate limiting: 1 message per second
    for (const recipient of recipients) {
      await this.sendSMS(recipient, message);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private getPhoneNumber(): string {
    // Round-robin phone number selection
    const index = Math.floor(Math.random() * this.phoneNumberPool.length);
    return this.phoneNumberPool[index];
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async storeOTP(phone: string, otp: string): Promise<void> {
    // Store in Redis with 10 minute expiry
  }

  private async getStoredOTP(phone: string): Promise<string | null> {
    // Get from Redis
    return null;
  }

  private async clearOTP(phone: string): Promise<void> {
    // Clear from Redis
  }

  private async trackSMS(data: any): Promise<void> {
    // Track SMS metrics
  }
}

interface SMSOptions {
  provider?: 'twilio' | 'vonage';
  mediaUrl?: string[];
}
```

### Push Notification Service
```typescript
// push/push-service.ts
import admin from 'firebase-admin';
import { OneSignal } from '@onesignal/node-onesignal';

export class PushNotificationService {
  private fcm: admin.messaging.Messaging;
  private oneSignal: OneSignal;

  constructor() {
    // Initialize Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    this.fcm = admin.messaging();

    // Initialize OneSignal
    const configuration = {
      appKey: process.env.ONESIGNAL_APP_KEY!,
      userKey: process.env.ONESIGNAL_USER_KEY!,
    };
    this.oneSignal = new OneSignal.DefaultApi(configuration);
  }

  /**
   * Send push notification
   */
  async sendPush(
    tokens: string[],
    notification: PushNotification,
    options: PushOptions = {}
  ): Promise<void> {
    const { provider = 'fcm', data, priority = 'high' } = options;

    try {
      switch (provider) {
        case 'fcm':
          await this.sendWithFCM(tokens, notification, data, priority);
          break;

        case 'onesignal':
          await this.sendWithOneSignal(tokens, notification, data);
          break;

        default:
          throw new Error(`Unknown push provider: ${provider}`);
      }

      // Track push notification
      await this.trackPush({
        tokens,
        notification,
        provider,
        timestamp: new Date(),
      });

    } catch (error) {
      console.error('Failed to send push notification:', error);
      throw error;
    }
  }

  /**
   * Send with Firebase Cloud Messaging
   */
  private async sendWithFCM(
    tokens: string[],
    notification: PushNotification,
    data?: Record<string, string>,
    priority: 'high' | 'normal' = 'high'
  ): Promise<void> {
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image,
      },
      data,
      android: {
        priority,
        notification: {
          icon: 'ic_notification',
          color: '#667eea',
          sound: 'default',
          clickAction: notification.clickAction,
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body,
            },
            badge: notification.badge,
            sound: 'default',
            category: notification.category,
          },
        },
      },
      webpush: {
        notification: {
          title: notification.title,
          body: notification.body,
          icon: notification.icon || '/icon-192x192.png',
          badge: '/badge-72x72.png',
          image: notification.image,
          actions: notification.actions,
        },
        fcmOptions: {
          link: notification.link,
        },
      },
    };

    const response = await this.fcm.sendMulticast(message);
    
    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      
      // Remove invalid tokens
      await this.removeInvalidTokens(failedTokens);
    }
  }

  /**
   * Send with OneSignal
   */
  private async sendWithOneSignal(
    tokens: string[],
    notification: PushNotification,
    data?: Record<string, string>
  ): Promise<void> {
    const oneSignalNotification = new OneSignal.Notification();
    
    oneSignalNotification.app_id = process.env.ONESIGNAL_APP_ID!;
    oneSignalNotification.include_player_ids = tokens;
    oneSignalNotification.contents = { en: notification.body };
    oneSignalNotification.headings = { en: notification.title };
    oneSignalNotification.data = data;
    
    if (notification.image) {
      oneSignalNotification.big_picture = notification.image;
    }
    
    if (notification.link) {
      oneSignalNotification.url = notification.link;
    }

    await this.oneSignal.createNotification(oneSignalNotification);
  }

  /**
   * Send topic notification
   */
  async sendToTopic(
    topic: string,
    notification: PushNotification
  ): Promise<void> {
    const message: admin.messaging.Message = {
      topic,
      notification: {
        title: notification.title,
        body: notification.body,
      },
    };

    await this.fcm.send(message);
  }

  /**
   * Subscribe to topic
   */
  async subscribeToTopic(
    tokens: string[],
    topic: string
  ): Promise<void> {
    await this.fcm.subscribeToTopic(tokens, topic);
  }

  /**
   * Unsubscribe from topic
   */
  async unsubscribeFromTopic(
    tokens: string[],
    topic: string
  ): Promise<void> {
    await this.fcm.unsubscribeFromTopic(tokens, topic);
  }

  private async removeInvalidTokens(tokens: string[]): Promise<void> {
    // Remove from database
  }

  private async trackPush(data: any): Promise<void> {
    // Track push metrics
  }
}

interface PushNotification {
  title: string;
  body: string;
  image?: string;
  icon?: string;
  badge?: number;
  link?: string;
  clickAction?: string;
  category?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface PushOptions {
  provider?: 'fcm' | 'onesignal';
  data?: Record<string, string>;
  priority?: 'high' | 'normal';
}
```

### React Email Templates
```typescript
// templates/welcome-email.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  firstName: string;
  loginUrl: string;
}

export const WelcomeEmail = ({
  firstName,
  loginUrl,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Vibecode - Get started with your account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://vibecode.com/logo.png"
            width="170"
            height="50"
            alt="Vibecode"
            style={logo}
          />
          <Heading style={heading}>
            Welcome to Vibecode, {firstName}!
          </Heading>
          <Text style={paragraph}>
            We're excited to have you on board. Vibecode is the best platform
            for building modern applications with cutting-edge technology.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Get Started
            </Button>
          </Section>
          <Text style={paragraph}>
            If you have any questions, feel free to{' '}
            <Link href="mailto:support@vibecode.com" style={link}>
              contact our support team
            </Link>
            .
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            The Vibecode Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  padding: '24px 0',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#667eea',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const link = {
  color: '#667eea',
  textDecoration: 'underline',
};

const footer = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#898989',
  padding: '24px 0',
};
```

## Communication with Other Agents

### Output to Frontend Agent
- Email preview components
- Notification UI
- Subscription management
- Template editors

### Input from Backend Agent
- User data
- Event triggers
- Template variables
- Delivery status

### Coordination with Analytics Agent
- Email metrics
- Click tracking
- Open rates
- Conversion tracking

## Quality Checklist

Before completing any communication task:
- [ ] Delivery configured
- [ ] Templates responsive
- [ ] Fallback providers setup
- [ ] Unsubscribe working
- [ ] Bounce handling implemented
- [ ] Rate limiting configured
- [ ] Analytics tracking enabled
- [ ] Compliance checked
- [ ] Testing complete
- [ ] Documentation updated

## Best Practices

### Email
- Use responsive templates
- Include text version
- Test across clients
- Handle bounces
- Respect unsubscribes

### SMS
- Keep messages concise
- Include opt-out
- Respect time zones
- Handle delivery reports
- Use appropriate sender ID

### Push Notifications
- Personalize content
- Respect quiet hours
- Segment audiences
- Track engagement
- Handle token refresh

## Tools and Resources

- SendGrid documentation
- Twilio guides
- Firebase Cloud Messaging
- MJML email framework
- React Email components
- Email testing tools
- SMS best practices
