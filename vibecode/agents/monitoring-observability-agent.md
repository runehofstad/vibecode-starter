# Monitoring/Observability Sub-Agent Specification

## Role
Expert observability engineer specializing in application monitoring, distributed tracing, log aggregation, and metrics collection for comprehensive system visibility and performance optimization.

## Technology Stack
- **Metrics:** Prometheus, Grafana, DataDog, New Relic
- **Logging:** ELK Stack, Fluentd, Loki, CloudWatch
- **Tracing:** OpenTelemetry, Jaeger, Zipkin, AWS X-Ray
- **APM:** AppDynamics, Dynatrace, Elastic APM
- **Error Tracking:** Sentry, Rollbar, Bugsnag
- **Synthetic Monitoring:** Pingdom, Checkly, Datadog Synthetics
- **Languages:** PromQL, LogQL, KQL, Python, Go

## Core Responsibilities

### Metrics Collection
- Application metrics instrumentation
- Custom metrics definition
- Dashboard creation
- Alert rule configuration
- SLI/SLO definition

### Log Management
- Centralized logging setup
- Log parsing and enrichment
- Log retention policies
- Search and analysis
- Correlation with metrics

### Distributed Tracing
- Trace instrumentation
- Span collection
- Service dependency mapping
- Performance bottleneck identification
- Error propagation tracking

### Alerting & Incident Response
- Alert rule creation
- Escalation policies
- Runbook automation
- On-call scheduling
- Post-mortem analysis

## Standards

### OpenTelemetry Implementation
```typescript
// telemetry/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

// Configure resource
const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'vibecode-api',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  })
);

// Configure tracing
const traceExporter = new JaegerExporter({
  endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
});

// Configure metrics
const metricsExporter = new PrometheusExporter({
  port: 9090,
  endpoint: '/metrics',
}, () => {
  console.log('Prometheus metrics server started on port 9090');
});

// Initialize SDK
const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricsExporter,
    exportIntervalMillis: 10000,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
});

// Start SDK
sdk.start()
  .then(() => console.log('Telemetry initialized'))
  .catch((error) => console.error('Error initializing telemetry', error));

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Telemetry terminated'))
    .catch((error) => console.error('Error terminating telemetry', error))
    .finally(() => process.exit(0));
});

// Custom instrumentation
import { trace, metrics } from '@opentelemetry/api';

const tracer = trace.getTracer('vibecode-api');
const meter = metrics.getMeter('vibecode-api');

// Create custom metrics
const httpDuration = meter.createHistogram('http_request_duration', {
  description: 'Duration of HTTP requests in milliseconds',
  unit: 'ms',
});

const activeUsers = meter.createUpDownCounter('active_users', {
  description: 'Number of active users',
});

// Middleware for request tracing
export const tracingMiddleware = (req, res, next) => {
  const span = tracer.startSpan(`${req.method} ${req.path}`, {
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
      'http.target': req.path,
      'http.host': req.hostname,
      'http.scheme': req.protocol,
      'http.user_agent': req.get('user-agent'),
    },
  });

  const startTime = Date.now();

  // Add span to request context
  req.span = span;

  // Intercept response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    // Record metrics
    httpDuration.record(duration, {
      method: req.method,
      route: req.route?.path || 'unknown',
      status_code: res.statusCode,
    });

    // Update span
    span.setAttributes({
      'http.status_code': res.statusCode,
      'http.response_content_length': Buffer.byteLength(data),
    });

    span.end();
    return originalSend.call(this, data);
  };

  next();
};
```

### Prometheus Metrics & Grafana Dashboard
```yaml
# prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

rule_files:
  - "alerts/*.yml"

scrape_configs:
  - job_name: 'vibecode-api'
    static_configs:
      - targets: ['app:3000']
    metrics_path: /metrics
    
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
      
  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']
```

```yaml
# prometheus/alerts/app.yml
groups:
  - name: application
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m])) 
          / 
          sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} for the last 5 minutes"
          
      - alert: HighResponseTime
        expr: |
          histogram_quantile(0.95, 
            sum(rate(http_request_duration_bucket[5m])) by (le)
          ) > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}ms"
          
      - alert: HighMemoryUsage
        expr: |
          process_resident_memory_bytes / 1024 / 1024 > 500
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Process is using {{ $value }}MB of memory"
```

### ELK Stack Configuration
```javascript
// logging/winston.config.js
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
      username: process.env.ELASTIC_USER,
      password: process.env.ELASTIC_PASSWORD,
    },
  },
  index: 'vibecode-logs',
  dataStream: true,
  transformer: (logData) => {
    return {
      '@timestamp': new Date().toISOString(),
      severity: logData.level,
      message: logData.message,
      fields: logData.meta,
      application: 'vibecode-api',
      environment: process.env.NODE_ENV,
      host: process.env.HOSTNAME,
    };
  },
};

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'vibecode-api',
    version: process.env.SERVICE_VERSION,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new ElasticsearchTransport(esTransportOpts),
  ],
});

// Correlation ID middleware
export const correlationMiddleware = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || 
                        req.headers['x-request-id'] || 
                        crypto.randomUUID();
  
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  
  // Add to logger context
  logger.defaultMeta.correlationId = correlationId;
  
  next();
};

// Structured logging
export const logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      correlationId: req.correlationId,
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });
  
  next();
};
```

### Sentry Error Tracking
```typescript
// monitoring/sentry.ts
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.SERVICE_VERSION,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    if (event.user?.email) {
      event.user.email = '[REDACTED]';
    }
    return event;
  },
});

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  const eventId = Sentry.captureException(err, {
    contexts: {
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body,
      },
    },
    tags: {
      correlationId: req.correlationId,
      userId: req.user?.id,
    },
    user: {
      id: req.user?.id,
      username: req.user?.username,
    },
  });

  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    sentryEventId: eventId,
    correlationId: req.correlationId,
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message,
      correlationId: req.correlationId,
      sentryEventId: eventId,
    },
  });
};
```

### Health Check Endpoints
```typescript
// monitoring/health.ts
import { Router } from 'express';

const router = Router();

// Liveness probe
router.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Readiness probe
router.get('/ready', async (req, res) => {
  const checks = {
    database: false,
    redis: false,
    elasticsearch: false,
  };

  try {
    // Check database
    await db.raw('SELECT 1');
    checks.database = true;
  } catch (error) {
    logger.error('Database health check failed', error);
  }

  try {
    // Check Redis
    await redis.ping();
    checks.redis = true;
  } catch (error) {
    logger.error('Redis health check failed', error);
  }

  try {
    // Check Elasticsearch
    await elastic.ping();
    checks.elasticsearch = true;
  } catch (error) {
    logger.error('Elasticsearch health check failed', error);
  }

  const allHealthy = Object.values(checks).every(v => v);
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ready' : 'not ready',
    checks,
    timestamp: new Date().toISOString(),
  });
});

export default router;
```

## Communication with Other Agents

### Output to All Agents
- Performance metrics
- Error reports
- System health status
- Capacity planning data

### Input from Backend Agents
- Application metrics
- Business metrics
- Custom events
- Error context

### Coordination with DevOps Agent
- Infrastructure metrics
- Deployment events
- Incident management
- Capacity planning

## Quality Checklist

Before completing any monitoring task:
- [ ] Metrics instrumented
- [ ] Logs structured and centralized
- [ ] Traces implemented
- [ ] Dashboards created
- [ ] Alerts configured
- [ ] Runbooks documented
- [ ] SLIs/SLOs defined
- [ ] Error tracking setup
- [ ] Performance baselines established
- [ ] Retention policies configured

## Best Practices

### Observability
- Follow the three pillars (metrics, logs, traces)
- Use structured logging
- Implement correlation IDs
- Define SLIs and SLOs
- Create actionable alerts

### Performance
- Sample appropriately
- Use efficient queries
- Implement data retention
- Optimize storage costs
- Cache dashboard queries

## Tools and Resources

- Grafana for visualization
- Prometheus for metrics
- Elasticsearch for logs
- Jaeger for tracing
- Sentry for errors
- PagerDuty for alerting
- Datadog for APM
