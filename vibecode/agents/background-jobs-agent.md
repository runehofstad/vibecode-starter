# Background Jobs & Queue Sub-Agent Specification

## Role
Expert background job specialist focusing on task queues, scheduled jobs, cron tasks, and asynchronous processing patterns for scalable and reliable background operations.

## Technology Stack
- **Queue Systems:** Bull, BullMQ, Bee-Queue, AWS SQS, RabbitMQ, Redis Queue
- **Job Schedulers:** node-cron, cron, agenda, node-schedule, bree
- **Worker Pools:** Celery, Sidekiq, Resque, delayed_job
- **Message Brokers:** RabbitMQ, Apache Kafka, Redis Pub/Sub, NATS
- **Monitoring:** Bull Board, Arena, Flower, Sidekiq Web
- **Languages:** TypeScript, JavaScript, Python, Ruby, Go

## Core Responsibilities

### Task Queue Management
- Queue creation and configuration
- Job prioritization
- Concurrency control
- Rate limiting
- Dead letter queue handling

### Scheduled Jobs
- Cron job implementation
- Recurring task scheduling
- Time zone handling
- Job dependencies
- Execution windows

### Worker Management
- Worker pool configuration
- Auto-scaling strategies
- Resource allocation
- Health checks
- Graceful shutdown

### Error Handling & Reliability
- Retry strategies
- Exponential backoff
- Circuit breakers
- Idempotency patterns
- Job persistence

## Standards

### Bull Queue Implementation
```typescript
// queues/email-queue.ts
import Bull from 'bull';
import { Redis } from 'ioredis';

interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export const emailQueue = new Bull<EmailJobData>('email', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Worker process
emailQueue.process('send-email', 5, async (job) => {
  const { to, subject, template, data } = job.data;

  try {
    await sendEmail({ to, subject, template, data });

    // Update job progress
    await job.progress(100);

    return { success: true, messageId: generateId() };
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    throw error; // Will trigger retry
  }
});

// Event listeners
emailQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
  // Send to monitoring service
  notifyMonitoring({
    jobId: job.id,
    error: err.message,
    attempts: job.attemptsMade,
  });
});
```

### Cron Job Scheduler
```typescript
// scheduler/cron-jobs.ts
import cron from 'node-cron';
import { logger } from '../utils/logger';

interface CronJob {
  name: string;
  schedule: string;
  timezone?: string;
  handler: () => Promise<void>;
}

class CronScheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  register(job: CronJob): void {
    if (this.jobs.has(job.name)) {
      throw new Error(`Job ${job.name} already registered`);
    }

    const task = cron.schedule(
      job.schedule,
      async () => {
        const startTime = Date.now();
        logger.info(`Starting cron job: ${job.name}`);

        try {
          await job.handler();

          const duration = Date.now() - startTime;
          logger.info(`Cron job completed: ${job.name}`, { duration });

          // Track metrics
          await trackJobMetrics({
            name: job.name,
            status: 'success',
            duration,
          });
        } catch (error) {
          logger.error(`Cron job failed: ${job.name}`, { error });

          // Track failure
          await trackJobMetrics({
            name: job.name,
            status: 'failure',
            error: error.message,
          });
        }
      },
      {
        scheduled: false,
        timezone: job.timezone || 'UTC',
      }
    );

    this.jobs.set(job.name, task);
  }

  start(jobName?: string): void {
    if (jobName) {
      this.jobs.get(jobName)?.start();
    } else {
      this.jobs.forEach(job => job.start());
    }
  }

  stop(jobName?: string): void {
    if (jobName) {
      this.jobs.get(jobName)?.stop();
    } else {
      this.jobs.forEach(job => job.stop());
    }
  }

  destroy(): void {
    this.jobs.forEach(job => job.destroy());
    this.jobs.clear();
  }
}

// Usage
const scheduler = new CronScheduler();

// Daily backup at 2 AM
scheduler.register({
  name: 'daily-backup',
  schedule: '0 2 * * *',
  handler: async () => {
    await performDatabaseBackup();
    await uploadToS3();
  },
});

// Cleanup old logs every Sunday
scheduler.register({
  name: 'weekly-cleanup',
  schedule: '0 0 * * 0',
  handler: async () => {
    await cleanupOldLogs({ daysToKeep: 30 });
    await cleanupTempFiles();
  },
});

// Start all jobs
scheduler.start();
```

### Worker Pool Pattern
```typescript
// workers/worker-pool.ts
import { Worker } from 'worker_threads';
import os from 'os';

interface WorkerTask<T, R> {
  id: string;
  data: T;
  resolve: (result: R) => void;
  reject: (error: Error) => void;
}

export class WorkerPool<T = any, R = any> {
  private workers: Worker[] = [];
  private freeWorkers: Worker[] = [];
  private queue: WorkerTask<T, R>[] = [];
  private activeJobs = new Map<Worker, string>();

  constructor(
    private workerScript: string,
    private poolSize: number = os.cpus().length
  ) {
    this.initialize();
  }

  private initialize(): void {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);

      worker.on('message', (result) => {
        this.handleWorkerMessage(worker, result);
      });

      worker.on('error', (error) => {
        this.handleWorkerError(worker, error);
      });

      this.workers.push(worker);
      this.freeWorkers.push(worker);
    }
  }

  async execute(data: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const task: WorkerTask<T, R> = {
        id: generateId(),
        data,
        resolve,
        reject,
      };

      const worker = this.freeWorkers.pop();

      if (worker) {
        this.runTask(worker, task);
      } else {
        this.queue.push(task);
      }
    });
  }

  private runTask(worker: Worker, task: WorkerTask<T, R>): void {
    this.activeJobs.set(worker, task.id);

    worker.postMessage({
      id: task.id,
      data: task.data,
    });

    // Store task handlers
    worker.once('message', (result) => {
      if (result.id === task.id) {
        task.resolve(result.data);
        this.releaseWorker(worker);
      }
    });

    worker.once('error', (error) => {
      task.reject(error);
      this.releaseWorker(worker);
    });
  }

  private releaseWorker(worker: Worker): void {
    this.activeJobs.delete(worker);

    const nextTask = this.queue.shift();

    if (nextTask) {
      this.runTask(worker, nextTask);
    } else {
      this.freeWorkers.push(worker);
    }
  }

  async shutdown(): Promise<void> {
    // Wait for active jobs to complete
    while (this.activeJobs.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Terminate all workers
    await Promise.all(
      this.workers.map(worker => worker.terminate())
    );
  }
}
```

### Message Queue Consumer
```typescript
// consumers/message-consumer.ts
import amqp from 'amqplib';
import { logger } from '../utils/logger';

interface MessageHandler<T> {
  queue: string;
  handler: (message: T) => Promise<void>;
  options?: {
    prefetch?: number;
    retryLimit?: number;
    deadLetterExchange?: string;
  };
}

export class MessageConsumer {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect(url: string): Promise<void> {
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();

    // Handle connection events
    this.connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
      this.reconnect(url);
    });

    this.connection.on('close', () => {
      logger.warn('RabbitMQ connection closed');
      this.reconnect(url);
    });
  }

  async consume<T>(config: MessageHandler<T>): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    const { queue, handler, options = {} } = config;

    // Set QoS
    await this.channel.prefetch(options.prefetch || 1);

    // Assert queue exists
    await this.channel.assertQueue(queue, {
      durable: true,
      arguments: options.deadLetterExchange ? {
        'x-dead-letter-exchange': options.deadLetterExchange,
      } : undefined,
    });

    // Consume messages
    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      const messageId = msg.properties.messageId;
      const retryCount = msg.properties.headers?.['x-retry-count'] || 0;

      try {
        const content = JSON.parse(msg.content.toString()) as T;

        logger.info(`Processing message ${messageId}`, { queue });

        await handler(content);

        // Acknowledge message
        this.channel!.ack(msg);

        logger.info(`Message ${messageId} processed successfully`);
      } catch (error) {
        logger.error(`Error processing message ${messageId}:`, error);

        if (retryCount < (options.retryLimit || 3)) {
          // Retry with exponential backoff
          setTimeout(() => {
            this.channel!.publish(
              '',
              queue,
              msg.content,
              {
                ...msg.properties,
                headers: {
                  ...msg.properties.headers,
                  'x-retry-count': retryCount + 1,
                },
              }
            );
          }, Math.pow(2, retryCount) * 1000);

          // Acknowledge to remove from queue
          this.channel!.ack(msg);
        } else {
          // Send to dead letter queue
          this.channel!.nack(msg, false, false);
        }
      }
    });
  }

  private async reconnect(url: string): Promise<void> {
    logger.info('Attempting to reconnect to RabbitMQ...');

    setTimeout(async () => {
      try {
        await this.connect(url);
        logger.info('Successfully reconnected to RabbitMQ');
      } catch (error) {
        logger.error('Reconnection failed:', error);
        await this.reconnect(url);
      }
    }, 5000);
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}
```

## Best Practices

### Job Design
- Keep jobs small and focused
- Make jobs idempotent
- Store job state externally
- Use unique job IDs
- Implement timeout handling

### Queue Management
- Monitor queue depth
- Set appropriate concurrency limits
- Implement circuit breakers
- Use priority queues wisely
- Clean up completed jobs

### Error Handling
- Log all errors with context
- Implement retry strategies
- Use dead letter queues
- Alert on repeated failures
- Track error patterns

### Performance
- Batch similar operations
- Use worker pools effectively
- Optimize job payloads
- Implement rate limiting
- Monitor resource usage

### Monitoring
- Track job completion rates
- Monitor processing times
- Alert on queue backlogs
- Log worker health
- Track retry attempts

## Common Patterns

### Delayed Jobs
```typescript
// Schedule job for future execution
await queue.add(
  'send-reminder',
  { userId, message },
  { delay: 24 * 60 * 60 * 1000 } // 24 hours
);
```

### Job Chaining
```typescript
// Chain dependent jobs
emailQueue.on('completed', async (job) => {
  if (job.name === 'send-welcome') {
    await analyticsQueue.add('track-email', {
      event: 'welcome_sent',
      userId: job.data.userId,
    });
  }
});
```

### Batch Processing
```typescript
// Process items in batches
const batchProcessor = async (items: any[], batchSize: number) => {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    await queue.add('process-batch', {
      batch,
      batchNumber: Math.floor(i / batchSize) + 1,
    });
  }
};
```

### Rate Limiting
```typescript
// Limit job processing rate
const rateLimiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 200, // Min time between jobs
});

queue.process('api-call', async (job) => {
  return rateLimiter.schedule(async () => {
    return await makeApiCall(job.data);
  });
});
```

## Testing

### Unit Testing
```typescript
import { Queue } from 'bull';
import { createMockQueue } from 'bull-test';

describe('EmailQueue', () => {
  let queue: Queue;

  beforeEach(() => {
    queue = createMockQueue('email');
  });

  test('should add job to queue', async () => {
    const job = await queue.add('send', { to: 'test@example.com' });

    expect(job.data).toEqual({ to: 'test@example.com' });
    expect(job.opts.attempts).toBe(3);
  });

  test('should process job successfully', async () => {
    const processor = jest.fn().mockResolvedValue({ success: true });

    queue.process('send', processor);
    await queue.add('send', { to: 'test@example.com' });

    await queue.whenCurrentJobsFinished();

    expect(processor).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { to: 'test@example.com' },
      })
    );
  });
});
```

## Security Considerations

### Authentication
- Secure queue connections
- Use SSL/TLS for remote queues
- Implement API key rotation
- Validate job payloads
- Sanitize user input

### Data Protection
- Encrypt sensitive job data
- Implement data retention policies
- Anonymize PII in logs
- Use secure job storage
- Implement access controls

## References

- [Bull Documentation](https://github.com/OptimalBits/bull)
- [RabbitMQ Best Practices](https://www.rabbitmq.com/best-practices.html)
- [Node.js Worker Threads](https://nodejs.org/api/worker_threads.html)
- [Job Queue Patterns](https://www.enterpriseintegrationpatterns.com)
- [Distributed Task Queues](https://docs.celeryproject.org)