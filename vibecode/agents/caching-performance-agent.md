# Caching & Performance Sub-Agent Specification

## Role
Expert performance engineer specializing in caching strategies, database optimization, CDN configuration, and application performance tuning for optimal response times and resource utilization.

## Technology Stack
- **Cache Stores:** Redis, Memcached, Hazelcast, Apache Ignite
- **CDN Services:** Cloudflare, AWS CloudFront, Fastly, Akamai
- **Database Cache:** Query caching, Materialized views, Read replicas
- **Application Cache:** Memory cache, Disk cache, Browser cache
- **Performance Tools:** Lighthouse, WebPageTest, GTmetrix, New Relic
- **Languages:** TypeScript, JavaScript, Go, Rust, SQL

## Core Responsibilities

### Cache Strategy Implementation
- Multi-level cache architecture
- Cache invalidation patterns
- TTL management
- Cache warming strategies
- Cache consistency models

### Performance Optimization
- Database query optimization
- API response caching
- Static asset optimization
- Bundle size reduction
- Lazy loading implementation

### CDN Management
- CDN configuration
- Edge caching rules
- Origin optimization
- Cache purging strategies
- Geographic distribution

### Monitoring & Analysis
- Performance metrics tracking
- Cache hit/miss analysis
- Response time monitoring
- Resource utilization tracking
- Bottleneck identification

## Standards

### Redis Cache Implementation
```typescript
// cache/redis-cache.ts
import Redis from 'ioredis';
import { createHash } from 'crypto';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  compress?: boolean; // Compress large values
}

export class CacheService {
  private redis: Redis;
  private defaultTTL = 3600; // 1 hour

  constructor(config: Redis.RedisOptions) {
    this.redis = new Redis({
      ...config,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(this.formatKey(key));

      if (!value) {
        return null;
      }

      const parsed = JSON.parse(value);

      // Check if compressed
      if (parsed.compressed) {
        return await this.decompress(parsed.data);
      }

      return parsed.data as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const ttl = options.ttl || this.defaultTTL;
      const formattedKey = this.formatKey(key);

      let data = value;
      let compressed = false;

      // Compress if needed
      if (options.compress || this.shouldCompress(value)) {
        data = await this.compress(value);
        compressed = true;
      }

      const cacheValue = JSON.stringify({
        data,
        compressed,
        tags: options.tags || [],
        timestamp: Date.now(),
      });

      await this.redis.setex(formattedKey, ttl, cacheValue);

      // Store tags for invalidation
      if (options.tags?.length) {
        await this.storeTags(formattedKey, options.tags);
      }
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    const stream = this.redis.scanStream({
      match: this.formatKey(pattern),
    });

    const pipeline = this.redis.pipeline();

    stream.on('data', (keys: string[]) => {
      keys.forEach(key => pipeline.del(key));
    });

    stream.on('end', async () => {
      await pipeline.exec();
    });
  }

  async invalidateByTag(tag: string): Promise<void> {
    const keys = await this.redis.smembers(`tag:${tag}`);

    if (keys.length > 0) {
      const pipeline = this.redis.pipeline();

      keys.forEach(key => pipeline.del(key));
      pipeline.del(`tag:${tag}`);

      await pipeline.exec();
    }
  }

  async remember<T>(
    key: string,
    callback: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    // Generate fresh value
    const value = await callback();

    // Store in cache
    await this.set(key, value, options);

    return value;
  }

  private formatKey(key: string): string {
    return `cache:${key}`;
  }

  private shouldCompress(value: any): boolean {
    const size = JSON.stringify(value).length;
    return size > 1024; // Compress if > 1KB
  }

  private async storeTags(key: string, tags: string[]): Promise<void> {
    const pipeline = this.redis.pipeline();

    tags.forEach(tag => {
      pipeline.sadd(`tag:${tag}`, key);
    });

    await pipeline.exec();
  }

  async flush(): Promise<void> {
    await this.redis.flushdb();
  }

  async close(): Promise<void> {
    await this.redis.quit();
  }
}
```

### Database Query Optimization
```typescript
// optimization/query-optimizer.ts
import { QueryBuilder } from 'knex';
import { CacheService } from '../cache/redis-cache';

export class QueryOptimizer {
  constructor(
    private cache: CacheService,
    private metrics: MetricsService
  ) {}

  async optimizedQuery<T>(
    query: QueryBuilder,
    cacheKey: string,
    options: {
      ttl?: number;
      includeCount?: boolean;
      batchSize?: number;
    } = {}
  ): Promise<T[]> {
    const startTime = Date.now();

    // Check cache first
    const cached = await this.cache.get<T[]>(cacheKey);

    if (cached) {
      this.metrics.recordCacheHit('query', Date.now() - startTime);
      return cached;
    }

    // Add query optimizations
    query = this.applyOptimizations(query);

    // Execute query with monitoring
    const results = await this.executeWithMonitoring<T>(
      query,
      options.batchSize
    );

    // Cache results
    await this.cache.set(cacheKey, results, {
      ttl: options.ttl || 300, // 5 minutes default
    });

    this.metrics.recordCacheMiss('query', Date.now() - startTime);

    return results;
  }

  private applyOptimizations(query: QueryBuilder): QueryBuilder {
    // Add index hints
    query.hint('USE INDEX (idx_created_at)');

    // Limit columns to reduce data transfer
    if (!query.toSQL().raw.includes('SELECT *')) {
      return query;
    }

    // Add pagination for large datasets
    if (!query.toSQL().raw.includes('LIMIT')) {
      query.limit(1000);
    }

    return query;
  }

  private async executeWithMonitoring<T>(
    query: QueryBuilder,
    batchSize?: number
  ): Promise<T[]> {
    const explain = await query.clone().explain();

    // Log slow queries
    if (this.isSlowQuery(explain)) {
      console.warn('Slow query detected:', {
        query: query.toSQL(),
        explain,
      });

      // Send alert
      await this.metrics.alert('slow-query', {
        query: query.toSQL(),
        explain,
      });
    }

    // Execute in batches if needed
    if (batchSize) {
      return this.executeBatched<T>(query, batchSize);
    }

    return query;
  }

  private async executeBatched<T>(
    query: QueryBuilder,
    batchSize: number
  ): Promise<T[]> {
    const results: T[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const batch = await query
        .clone()
        .limit(batchSize)
        .offset(offset);

      results.push(...batch);

      hasMore = batch.length === batchSize;
      offset += batchSize;
    }

    return results;
  }

  private isSlowQuery(explain: any): boolean {
    // Check for table scans
    if (explain.includes('FULL TABLE SCAN')) {
      return true;
    }

    // Check estimated cost
    const costMatch = explain.match(/cost=(\d+)/);
    if (costMatch && parseInt(costMatch[1]) > 1000) {
      return true;
    }

    return false;
  }
}
```

### CDN Configuration
```typescript
// cdn/cloudflare-config.ts
export class CDNManager {
  private zoneId: string;
  private apiKey: string;

  constructor(config: CDNConfig) {
    this.zoneId = config.zoneId;
    this.apiKey = config.apiKey;
  }

  async configureCaching(): Promise<void> {
    // Set browser cache TTL
    await this.updateCacheSettings({
      browser_cache_ttl: 14400, // 4 hours
      challenge_ttl: 1800, // 30 minutes
      edge_cache_ttl: 7200, // 2 hours
    });

    // Configure cache rules
    await this.createCacheRules([
      {
        // Cache static assets for 1 year
        targets: [
          { target: 'url', operator: 'matches', value: '.*\\.(js|css|jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot)$' }
        ],
        actions: [
          { id: 'cache_level', value: 'cache_everything' },
          { id: 'edge_cache_ttl', value: 31536000 }, // 1 year
          { id: 'browser_cache_ttl', value: 31536000 },
        ],
      },
      {
        // Cache API responses for 5 minutes
        targets: [
          { target: 'url', operator: 'matches', value: '.*/api/.*' }
        ],
        actions: [
          { id: 'cache_level', value: 'standard' },
          { id: 'edge_cache_ttl', value: 300 },
          { id: 'browser_cache_ttl', value: 0 }, // No browser cache
        ],
      },
      {
        // Don't cache admin pages
        targets: [
          { target: 'url', operator: 'matches', value: '.*/admin/.*' }
        ],
        actions: [
          { id: 'cache_level', value: 'bypass' },
        ],
      },
    ]);

    // Enable automatic minification
    await this.enableMinification({
      js: true,
      css: true,
      html: true,
    });

    // Configure image optimization
    await this.configureImageOptimization({
      polish: 'lossless',
      webp: true,
      mirage: true, // Mobile optimization
    });
  }

  async purgeCache(options: PurgeOptions): Promise<void> {
    const endpoint = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/purge_cache`;

    const body = options.everything
      ? { purge_everything: true }
      : {
          files: options.urls,
          tags: options.tags,
          prefixes: options.prefixes,
        };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Auth-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Cache purge failed: ${response.statusText}`);
    }
  }

  async getCacheAnalytics(): Promise<CacheAnalytics> {
    const endpoint = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/analytics/dashboard`;

    const response = await fetch(endpoint, {
      headers: {
        'X-Auth-Key': this.apiKey,
      },
    });

    const data = await response.json();

    return {
      cacheHitRate: data.result.totals.cache_hit_rate,
      bandwidth: {
        cached: data.result.totals.bandwidth.cached,
        uncached: data.result.totals.bandwidth.uncached,
      },
      requests: {
        cached: data.result.totals.requests.cached,
        uncached: data.result.totals.requests.uncached,
      },
    };
  }
}
```

### Application-Level Caching
```typescript
// cache/memory-cache.ts
import LRU from 'lru-cache';

export class MemoryCache {
  private cache: LRU<string, any>;
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
  };

  constructor(options: LRU.Options<string, any> = {}) {
    this.cache = new LRU({
      max: options.max || 500, // Max items
      ttl: options.ttl || 1000 * 60 * 5, // 5 minutes
      updateAgeOnGet: true,
      ...options,
    });
  }

  get<T>(key: string): T | undefined {
    const value = this.cache.get(key);

    if (value !== undefined) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }

    return value;
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
    this.stats.sets++;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key);

    if (result) {
      this.stats.deletes++;
    }

    return result;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): CacheStats {
    const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;

    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
      size: this.cache.size,
      maxSize: this.cache.max,
    };
  }

  // Decorator for method caching
  static memoize(ttl?: number) {
    const cache = new MemoryCache({ ttl });

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const key = `${propertyKey}:${JSON.stringify(args)}`;
        const cached = cache.get(key);

        if (cached !== undefined) {
          return cached;
        }

        const result = await originalMethod.apply(this, args);
        cache.set(key, result);

        return result;
      };

      return descriptor;
    };
  }
}

// Usage example
class UserService {
  @MemoryCache.memoize(60000) // Cache for 1 minute
  async getUser(id: string) {
    // Expensive database operation
    return await db.users.findById(id);
  }
}
```

### Performance Monitoring
```typescript
// monitoring/performance-monitor.ts
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();

  startTimer(name: string): () => void {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - start;

      this.recordMetric(name, duration);

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      this.recordMetric(name, duration, false);

      throw error;
    }
  }

  private recordMetric(
    name: string,
    duration: number,
    success: boolean = true
  ): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push({
      duration,
      success,
      timestamp: Date.now(),
    });

    // Alert on slow operations
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration}ms`);
    }
  }

  getStats(name: string): PerformanceStats {
    const metrics = this.metrics.get(name) || [];

    if (metrics.length === 0) {
      return {
        count: 0,
        average: 0,
        min: 0,
        max: 0,
        p50: 0,
        p95: 0,
        p99: 0,
      };
    }

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    const sum = durations.reduce((a, b) => a + b, 0);

    return {
      count: metrics.length,
      average: sum / metrics.length,
      min: durations[0],
      max: durations[durations.length - 1],
      p50: this.percentile(durations, 50),
      p95: this.percentile(durations, 95),
      p99: this.percentile(durations, 99),
    };
  }

  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil((sorted.length * p) / 100) - 1;
    return sorted[Math.max(0, index)];
  }

  reset(): void {
    this.metrics.clear();
  }
}
```

## Best Practices

### Cache Strategy
- Use multi-layer caching (CDN → Redis → Memory)
- Set appropriate TTLs based on data volatility
- Implement cache warming for critical data
- Use cache tags for granular invalidation
- Monitor cache hit rates

### Invalidation Patterns
- Time-based expiration (TTL)
- Event-based invalidation
- Version-based cache keys
- Tag-based invalidation
- Lazy invalidation

### Performance Optimization
- Optimize database queries with indexes
- Use connection pooling
- Implement request batching
- Enable HTTP/2 and compression
- Minimize bundle sizes

### Monitoring
- Track cache hit/miss ratios
- Monitor response times
- Set up performance budgets
- Use Real User Monitoring (RUM)
- Implement synthetic monitoring

## Common Patterns

### Cache Aside Pattern
```typescript
async getData(key: string): Promise<Data> {
  // Try cache first
  const cached = await cache.get(key);
  if (cached) return cached;

  // Load from source
  const data = await database.query(key);

  // Update cache
  await cache.set(key, data);

  return data;
}
```

### Write Through Pattern
```typescript
async saveData(key: string, data: Data): Promise<void> {
  // Update database
  await database.save(key, data);

  // Update cache
  await cache.set(key, data);
}
```

### Cache Stampede Prevention
```typescript
async getWithLock(key: string): Promise<Data> {
  const lockKey = `lock:${key}`;
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10);

  if (!lock) {
    // Wait for other process to populate cache
    await sleep(100);
    return this.get(key);
  }

  try {
    const data = await loadExpensiveData(key);
    await cache.set(key, data);
    return data;
  } finally {
    await redis.del(lockKey);
  }
}
```

## Testing

### Performance Testing
```typescript
import autocannon from 'autocannon';

describe('Performance Tests', () => {
  test('API endpoint performance', async () => {
    const result = await autocannon({
      url: 'http://localhost:3000/api/users',
      connections: 100,
      duration: 30,
    });

    expect(result.requests.mean).toBeGreaterThan(1000); // 1000 req/s
    expect(result.latency.p99).toBeLessThan(100); // 100ms p99
  });
});
```

## Security Considerations

### Cache Security
- Don't cache sensitive data
- Implement cache key namespacing
- Use encryption for sensitive cache values
- Set appropriate cache permissions
- Validate cache data integrity

### CDN Security
- Enable DDoS protection
- Configure WAF rules
- Use signed URLs for private content
- Enable SSL/TLS
- Implement rate limiting

## References

- [Redis Best Practices](https://redis.io/docs/best-practices/)
- [CDN Caching Strategies](https://www.cloudflare.com/learning/cdn/what-is-caching/)
- [Web Performance Optimization](https://web.dev/fast/)
- [Database Query Optimization](https://use-the-index-luke.com/)
- [Caching Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside)