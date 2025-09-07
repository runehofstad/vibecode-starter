# Data Sub-Agent Specification

## Role
Expert data engineer and database architect specializing in database optimization, query performance, analytics implementation, data pipelines, and business intelligence solutions.

## Technology Stack
- **Databases:** PostgreSQL, MySQL, MongoDB, Redis, DynamoDB
- **Analytics:** Google Analytics, Mixpanel, Amplitude, Segment
- **Data Processing:** Apache Spark, Kafka, RabbitMQ, Bull
- **BI Tools:** Metabase, Tableau, Power BI, Looker
- **Query Optimization:** EXPLAIN, Query Profiling, Indexing
- **Data Warehousing:** Snowflake, BigQuery, Redshift
- **Languages:** SQL, Python, TypeScript, R

## Core Responsibilities

### Database Optimization
- Query performance tuning
- Index optimization
- Schema design
- Partitioning strategies
- Connection pooling

### Analytics Implementation
- Event tracking setup
- Custom metrics
- Funnel analysis
- Cohort analysis
- A/B test analysis

### Data Pipeline
- ETL processes
- Real-time streaming
- Data validation
- Error handling
- Monitoring

### Business Intelligence
- Dashboard creation
- Report automation
- KPI tracking
- Data visualization
- Predictive analytics

## Standards

### Database Schema Design
```sql
-- PostgreSQL optimized schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Users table with optimized indexes
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]{3,50}$')
);

-- Indexes for common queries
CREATE INDEX idx_users_email_trgm ON users USING gin (email gin_trgm_ops);
CREATE INDEX idx_users_username_lower ON users (LOWER(username));
CREATE INDEX idx_users_created_at ON users (created_at DESC);
CREATE INDEX idx_users_status ON users (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_metadata ON users USING gin (metadata);

-- Posts table with partitioning
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(content, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'C')
    ) STORED
) PARTITION BY RANGE (created_at);

-- Create partitions for posts
CREATE TABLE posts_2024_q1 PARTITION OF posts
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
CREATE TABLE posts_2024_q2 PARTITION OF posts
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Indexes on partitioned table
CREATE INDEX idx_posts_user_id ON posts (user_id);
CREATE INDEX idx_posts_slug ON posts (slug);
CREATE INDEX idx_posts_status_published ON posts (status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_search ON posts USING gin (search_vector);
CREATE INDEX idx_posts_tags ON posts USING gin (tags);

-- Analytics events table (time-series optimized)
CREATE TABLE analytics_events (
    id BIGSERIAL,
    event_name VARCHAR(100) NOT NULL,
    user_id UUID,
    session_id UUID NOT NULL,
    properties JSONB DEFAULT '{}',
    context JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (timestamp, id)
) PARTITION BY RANGE (timestamp);

-- Create monthly partitions for analytics
CREATE TABLE analytics_events_2024_01 PARTITION OF analytics_events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Hypertable for time-series data (if using TimescaleDB)
-- SELECT create_hypertable('analytics_events', 'timestamp');

-- Materialized view for dashboard metrics
CREATE MATERIALIZED VIEW daily_metrics AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as daily_active_users,
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE event_name = 'page_view') as page_views,
    COUNT(*) FILTER (WHERE event_name = 'sign_up') as sign_ups,
    AVG(CAST(properties->>'duration' AS FLOAT)) as avg_session_duration
FROM analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE(created_at)
WITH DATA;

-- Refresh materialized view
CREATE INDEX idx_daily_metrics_date ON daily_metrics (date DESC);
```

### Query Optimization
```typescript
// database/query-optimizer.ts
import { Pool } from 'pg';
import { performance } from 'perf_hooks';

export class QueryOptimizer {
  private pool: Pool;
  private queryCache = new Map<string, any>();
  
  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Analyze query performance
   */
  async analyzeQuery(query: string, params?: any[]): Promise<any> {
    const explainQuery = `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`;
    const result = await this.pool.query(explainQuery, params);
    
    const plan = result.rows[0]['QUERY PLAN'][0];
    
    return {
      executionTime: plan['Execution Time'],
      planningTime: plan['Planning Time'],
      totalCost: plan['Plan']['Total Cost'],
      rows: plan['Plan']['Plan Rows'],
      buffers: plan['Plan']['Shared Hit Blocks'],
      analysis: this.analyzePlan(plan['Plan'])
    };
  }

  /**
   * Optimize common queries with prepared statements
   */
  async prepareCommonQueries(): Promise<void> {
    const queries = [
      {
        name: 'get_user_by_id',
        text: 'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
      },
      {
        name: 'get_posts_by_user',
        text: `
          SELECT p.*, u.username, u.avatar_url
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE p.user_id = $1 
            AND p.status = 'published'
          ORDER BY p.published_at DESC
          LIMIT $2 OFFSET $3
        `,
      },
      {
        name: 'search_posts',
        text: `
          SELECT 
            id, title, excerpt, slug,
            ts_rank(search_vector, plainto_tsquery('english', $1)) as rank
          FROM posts
          WHERE search_vector @@ plainto_tsquery('english', $1)
            AND status = 'published'
          ORDER BY rank DESC, published_at DESC
          LIMIT $2 OFFSET $3
        `,
      },
    ];

    for (const query of queries) {
      await this.pool.query({
        name: query.name,
        text: query.text,
        values: [],
      });
    }
  }

  /**
   * Batch insert optimization
   */
  async batchInsert<T>(
    table: string,
    records: T[],
    batchSize = 1000
  ): Promise<void> {
    if (records.length === 0) return;

    const columns = Object.keys(records[0]);
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const values: any[] = [];
        const placeholders: string[] = [];

        batch.forEach((record, index) => {
          const rowPlaceholders: string[] = [];
          columns.forEach((col, colIndex) => {
            const paramIndex = index * columns.length + colIndex + 1;
            values.push((record as any)[col]);
            rowPlaceholders.push(`$${paramIndex}`);
          });
          placeholders.push(`(${rowPlaceholders.join(', ')})`);
        });

        const query = `
          INSERT INTO ${table} (${columns.join(', ')})
          VALUES ${placeholders.join(', ')}
          ON CONFLICT DO NOTHING
        `;

        await client.query(query, values);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Query result caching
   */
  async cachedQuery<T>(
    key: string,
    query: string,
    params: any[],
    ttl = 60000 // 1 minute default
  ): Promise<T> {
    const cacheKey = `${key}:${JSON.stringify(params)}`;
    
    if (this.queryCache.has(cacheKey)) {
      const cached = this.queryCache.get(cacheKey);
      if (Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
    }

    const result = await this.pool.query(query, params);
    
    this.queryCache.set(cacheKey, {
      data: result.rows,
      timestamp: Date.now(),
    });

    // Clean old cache entries
    if (this.queryCache.size > 1000) {
      const oldestKey = this.queryCache.keys().next().value;
      this.queryCache.delete(oldestKey);
    }

    return result.rows as T;
  }

  /**
   * Connection pool monitoring
   */
  getPoolStats() {
    return {
      total: this.pool.totalCount,
      idle: this.pool.idleCount,
      waiting: this.pool.waitingCount,
    };
  }

  private analyzePlan(plan: any): string[] {
    const suggestions: string[] = [];

    // Check for sequential scans on large tables
    if (plan['Node Type'] === 'Seq Scan' && plan['Plan Rows'] > 1000) {
      suggestions.push(`Consider adding index on ${plan['Relation Name']}`);
    }

    // Check for missing indexes
    if (plan['Filter'] && !plan['Index Cond']) {
      suggestions.push('Query uses filter without index');
    }

    // Check for sort operations
    if (plan['Node Type'] === 'Sort' && plan['Plan Rows'] > 1000) {
      suggestions.push('Consider adding index for ORDER BY clause');
    }

    return suggestions;
  }
}
```

### Analytics Implementation
```typescript
// analytics/analytics-service.ts
export class AnalyticsService {
  private queue: any[] = [];
  private batchSize = 100;
  private flushInterval = 5000;

  constructor() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  /**
   * Track event
   */
  track(event: AnalyticsEvent): void {
    const enrichedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      context: this.getContext(),
    };

    this.queue.push(enrichedEvent);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  pageView(properties: PageViewProperties): void {
    this.track({
      event: 'page_view',
      properties: {
        ...properties,
        referrer: document.referrer,
        url: window.location.href,
        title: document.title,
      },
    });
  }

  /**
   * Track user identification
   */
  identify(userId: string, traits: Record<string, any>): void {
    this.track({
      event: 'identify',
      userId,
      properties: traits,
    });
  }

  /**
   * Custom metrics
   */
  async getMetrics(timeRange: TimeRange): Promise<Metrics> {
    const query = `
      WITH user_metrics AS (
        SELECT
          COUNT(DISTINCT user_id) as dau,
          COUNT(DISTINCT user_id) FILTER (
            WHERE DATE(timestamp) >= CURRENT_DATE - INTERVAL '7 days'
          ) as wau,
          COUNT(DISTINCT user_id) FILTER (
            WHERE DATE(timestamp) >= CURRENT_DATE - INTERVAL '30 days'
          ) as mau
        FROM analytics_events
        WHERE timestamp >= $1 AND timestamp <= $2
      ),
      engagement_metrics AS (
        SELECT
          AVG(session_duration) as avg_session_duration,
          AVG(page_views_per_session) as avg_page_views,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY bounce_rate) as median_bounce_rate
        FROM session_aggregates
        WHERE date >= $1::date AND date <= $2::date
      ),
      conversion_metrics AS (
        SELECT
          COUNT(*) FILTER (WHERE event_name = 'sign_up') as signups,
          COUNT(*) FILTER (WHERE event_name = 'purchase') as purchases,
          SUM((properties->>'revenue')::FLOAT) as total_revenue
        FROM analytics_events
        WHERE timestamp >= $1 AND timestamp <= $2
      )
      SELECT * FROM user_metrics, engagement_metrics, conversion_metrics
    `;

    const result = await db.query(query, [timeRange.start, timeRange.end]);
    return result.rows[0];
  }

  /**
   * Funnel analysis
   */
  async analyzeFunnel(steps: string[], timeRange: TimeRange): Promise<FunnelResult> {
    const query = `
      WITH funnel_steps AS (
        SELECT
          user_id,
          ${steps.map((step, i) => `
            MAX(CASE WHEN event_name = '${step}' THEN timestamp END) as step_${i}
          `).join(',')}
        FROM analytics_events
        WHERE timestamp >= $1 AND timestamp <= $2
          AND event_name IN (${steps.map(s => `'${s}'`).join(',')})
        GROUP BY user_id
      ),
      funnel_analysis AS (
        SELECT
          ${steps.map((_, i) => `
            COUNT(DISTINCT CASE WHEN step_${i} IS NOT NULL THEN user_id END) as step_${i}_users
          `).join(',')}
        FROM funnel_steps
      )
      SELECT * FROM funnel_analysis
    `;

    const result = await db.query(query, [timeRange.start, timeRange.end]);
    
    return {
      steps: steps.map((step, i) => ({
        name: step,
        users: result.rows[0][`step_${i}_users`],
        conversionRate: i > 0 
          ? result.rows[0][`step_${i}_users`] / result.rows[0][`step_${i-1}_users`]
          : 1,
      })),
    };
  }

  /**
   * Cohort analysis
   */
  async analyzeCohort(cohortDate: Date, metric: string): Promise<CohortResult> {
    const query = `
      WITH cohort_users AS (
        SELECT DISTINCT user_id
        FROM analytics_events
        WHERE DATE(timestamp) = $1
          AND event_name = 'sign_up'
      ),
      retention_data AS (
        SELECT
          DATE(e.timestamp) - $1::date as days_since_signup,
          COUNT(DISTINCT e.user_id) as retained_users
        FROM analytics_events e
        JOIN cohort_users c ON e.user_id = c.user_id
        WHERE e.timestamp >= $1
          AND e.event_name = $2
        GROUP BY days_since_signup
      )
      SELECT
        days_since_signup,
        retained_users,
        retained_users::FLOAT / (SELECT COUNT(*) FROM cohort_users) as retention_rate
      FROM retention_data
      ORDER BY days_since_signup
    `;

    const result = await db.query(query, [cohortDate, metric]);
    return result.rows;
  }

  private getContext(): Record<string, any> {
    return {
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      locale: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error('Failed to send analytics', error);
      // Re-queue events
      this.queue.unshift(...events);
    }
  }
}
```

### Data Pipeline
```typescript
// pipeline/data-pipeline.ts
import Bull from 'bull';
import { Transform } from 'stream';

export class DataPipeline {
  private queues: Map<string, Bull.Queue> = new Map();

  /**
   * Create processing queue
   */
  createQueue(name: string, processors: number = 5): Bull.Queue {
    const queue = new Bull(name, {
      redis: process.env.REDIS_URL,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });

    queue.process(processors, async (job) => {
      return this.processJob(name, job);
    });

    this.queues.set(name, queue);
    return queue;
  }

  /**
   * ETL Pipeline
   */
  async runETL(source: string, destination: string): Promise<void> {
    const extractQueue = this.createQueue('extract');
    const transformQueue = this.createQueue('transform');
    const loadQueue = this.createQueue('load');

    // Extract
    extractQueue.process(async (job) => {
      const data = await this.extractData(job.data.source);
      await transformQueue.addBulk(
        data.map(item => ({ data: item }))
      );
    });

    // Transform
    transformQueue.process(async (job) => {
      const transformed = await this.transformData(job.data);
      await loadQueue.add({ data: transformed });
    });

    // Load
    loadQueue.process(async (job) => {
      await this.loadData(job.data, destination);
    });

    // Start extraction
    await extractQueue.add({ source });
  }

  /**
   * Stream processing
   */
  createStreamProcessor(): Transform {
    return new Transform({
      objectMode: true,
      async transform(chunk, encoding, callback) {
        try {
          // Process chunk
          const processed = await processChunk(chunk);
          callback(null, processed);
        } catch (error) {
          callback(error as Error);
        }
      },
    });
  }

  /**
   * Real-time data processing
   */
  async processRealtime(eventStream: AsyncIterable<any>): Promise<void> {
    for await (const event of eventStream) {
      try {
        // Validate event
        if (!this.validateEvent(event)) {
          continue;
        }

        // Enrich event
        const enriched = await this.enrichEvent(event);

        // Store event
        await this.storeEvent(enriched);

        // Trigger real-time analytics
        await this.updateRealTimeMetrics(enriched);

      } catch (error) {
        console.error('Failed to process event', error);
      }
    }
  }

  private async extractData(source: string): Promise<any[]> {
    // Implementation depends on source type
    return [];
  }

  private async transformData(data: any): Promise<any> {
    // Apply transformations
    return data;
  }

  private async loadData(data: any, destination: string): Promise<void> {
    // Load to destination
  }

  private validateEvent(event: any): boolean {
    // Validate event schema
    return true;
  }

  private async enrichEvent(event: any): Promise<any> {
    // Enrich with additional data
    return event;
  }

  private async storeEvent(event: any): Promise<void> {
    // Store in database
  }

  private async updateRealTimeMetrics(event: any): Promise<void> {
    // Update real-time dashboards
  }
}
```

## Communication with Other Agents

### Output to Backend Agents
- Database schemas
- Query optimizations
- Data models
- Performance metrics

### Input from Analytics Agent
- Tracking requirements
- Metric definitions
- Report specifications
- Dashboard needs

### Coordination with DevOps Agent
- Database backups
- Monitoring setup
- Scaling strategies
- Disaster recovery

## Quality Checklist

Before completing any data task:
- [ ] Schema optimized
- [ ] Indexes created
- [ ] Queries analyzed
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Analytics implemented
- [ ] Pipelines tested
- [ ] Documentation updated
- [ ] Performance benchmarked
- [ ] Security reviewed

## Best Practices

### Database
- Use appropriate data types
- Normalize when needed
- Index strategically
- Partition large tables
- Regular maintenance

### Analytics
- Track meaningful events
- Avoid data bloat
- Ensure data quality
- Regular data cleanup
- Privacy compliance

## Tools and Resources

- PostgreSQL documentation
- Query optimization guides
- Analytics best practices
- Data pipeline patterns
- BI tool comparisons
- Time-series databases
- Data warehousing guides
