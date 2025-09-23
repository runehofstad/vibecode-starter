# Search & Indexing Sub-Agent Specification

## Role
Expert search engineer specializing in full-text search, faceted search, search relevance tuning, and distributed search systems for building powerful and scalable search experiences.

## Technology Stack
- **Search Engines:** Elasticsearch, OpenSearch, Algolia, MeiliSearch, Typesense
- **Database Search:** PostgreSQL Full Text, MySQL FULLTEXT, MongoDB Atlas Search
- **Vector Search:** Pinecone, Weaviate, Qdrant, Chroma
- **Search Libraries:** Lunr.js, FlexSearch, Fuse.js
- **Query Languages:** Lucene Query, KQL, SQL Full Text
- **Languages:** TypeScript, JavaScript, Python, Java

## Core Responsibilities

### Search Implementation
- Full-text search setup
- Faceted search configuration
- Autocomplete/suggestions
- Search relevance tuning
- Multi-language search

### Index Management
- Index schema design
- Mapping configuration
- Index lifecycle management
- Reindexing strategies
- Index optimization

### Query Optimization
- Query DSL construction
- Search scoring algorithms
- Boosting strategies
- Synonym management
- Stop word configuration

### Analytics & Monitoring
- Search analytics tracking
- Query performance monitoring
- Relevance metrics
- User behavior analysis
- A/B testing search results

## Standards

### Elasticsearch Implementation
```typescript
// search/elasticsearch-client.ts
import { Client } from '@elastic/elasticsearch';

interface SearchOptions {
  from?: number;
  size?: number;
  filters?: Record<string, any>;
  sort?: string[];
  highlight?: boolean;
  facets?: string[];
}

export class ElasticsearchService {
  private client: Client;
  private indexName: string;

  constructor(config: ElasticsearchConfig) {
    this.client = new Client({
      node: config.node,
      auth: {
        apiKey: config.apiKey,
      },
      maxRetries: 3,
      requestTimeout: 30000,
    });

    this.indexName = config.indexName;
  }

  async createIndex(): Promise<void> {
    const indexExists = await this.client.indices.exists({
      index: this.indexName,
    });

    if (indexExists) {
      return;
    }

    await this.client.indices.create({
      index: this.indexName,
      body: {
        settings: {
          number_of_shards: 2,
          number_of_replicas: 1,
          analysis: {
            analyzer: {
              custom_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: [
                  'lowercase',
                  'stop',
                  'snowball',
                  'synonym_filter',
                ],
              },
              autocomplete: {
                type: 'custom',
                tokenizer: 'edge_ngram_tokenizer',
                filter: ['lowercase'],
              },
            },
            tokenizer: {
              edge_ngram_tokenizer: {
                type: 'edge_ngram',
                min_gram: 2,
                max_gram: 10,
                token_chars: ['letter', 'digit'],
              },
            },
            filter: {
              synonym_filter: {
                type: 'synonym',
                synonyms: [
                  'laptop,notebook',
                  'phone,mobile,cellphone',
                  'tv,television',
                ],
              },
            },
          },
        },
        mappings: {
          properties: {
            id: { type: 'keyword' },
            title: {
              type: 'text',
              analyzer: 'custom_analyzer',
              fields: {
                keyword: { type: 'keyword' },
                autocomplete: {
                  type: 'text',
                  analyzer: 'autocomplete',
                },
              },
            },
            description: {
              type: 'text',
              analyzer: 'custom_analyzer',
            },
            category: {
              type: 'keyword',
              fields: {
                text: { type: 'text' },
              },
            },
            tags: { type: 'keyword' },
            price: { type: 'float' },
            rating: { type: 'float' },
            created_at: { type: 'date' },
            updated_at: { type: 'date' },
            in_stock: { type: 'boolean' },
            location: { type: 'geo_point' },
            suggest: {
              type: 'completion',
              contexts: [
                {
                  name: 'category',
                  type: 'category',
                },
              ],
            },
          },
        },
      },
    });
  }

  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult> {
    const { from = 0, size = 20, filters = {}, sort = [], highlight = true, facets = [] } = options;

    const must: any[] = [];
    const filter: any[] = [];

    // Main search query
    if (query) {
      must.push({
        multi_match: {
          query,
          fields: [
            'title^3', // Boost title matches
            'title.autocomplete^2',
            'description',
            'category.text',
            'tags',
          ],
          type: 'best_fields',
          tie_breaker: 0.3,
          fuzziness: 'AUTO',
        },
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (Array.isArray(value)) {
        filter.push({ terms: { [field]: value } });
      } else if (typeof value === 'object' && value.min !== undefined) {
        // Range filter
        filter.push({
          range: {
            [field]: {
              gte: value.min,
              lte: value.max,
            },
          },
        });
      } else {
        filter.push({ term: { [field]: value } });
      }
    });

    // Build aggregations for facets
    const aggs: Record<string, any> = {};
    facets.forEach(facet => {
      aggs[facet] = {
        terms: {
          field: facet,
          size: 50,
        },
      };
    });

    // Price range aggregation
    if (facets.includes('price')) {
      aggs.price_range = {
        stats: {
          field: 'price',
        },
      };
    }

    const body: any = {
      query: {
        bool: {
          must,
          filter,
        },
      },
      from,
      size,
      aggs,
    };

    // Add sorting
    if (sort.length > 0) {
      body.sort = sort.map(s => {
        const [field, order] = s.split(':');
        return { [field]: { order: order || 'asc' } };
      });
    } else {
      // Default: sort by relevance and rating
      body.sort = [
        '_score',
        { rating: { order: 'desc' } },
      ];
    }

    // Add highlighting
    if (highlight) {
      body.highlight = {
        fields: {
          title: {},
          description: {
            fragment_size: 150,
            number_of_fragments: 3,
          },
        },
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
      };
    }

    const response = await this.client.search({
      index: this.indexName,
      body,
    });

    return this.formatSearchResults(response);
  }

  async autocomplete(
    query: string,
    category?: string
  ): Promise<string[]> {
    const body: any = {
      suggest: {
        suggestions: {
          prefix: query,
          completion: {
            field: 'suggest',
            size: 10,
            skip_duplicates: true,
          },
        },
      },
    };

    if (category) {
      body.suggest.suggestions.completion.contexts = {
        category: [category],
      };
    }

    const response = await this.client.search({
      index: this.indexName,
      body,
    });

    return response.suggest.suggestions[0].options.map(
      (option: any) => option.text
    );
  }

  async indexDocument(document: any): Promise<void> {
    await this.client.index({
      index: this.indexName,
      id: document.id,
      body: {
        ...document,
        suggest: {
          input: [document.title, ...document.tags],
          contexts: {
            category: document.category,
          },
        },
      },
      refresh: 'wait_for',
    });
  }

  async bulkIndex(documents: any[]): Promise<void> {
    const body = documents.flatMap(doc => [
      { index: { _index: this.indexName, _id: doc.id } },
      {
        ...doc,
        suggest: {
          input: [doc.title, ...doc.tags],
          contexts: {
            category: doc.category,
          },
        },
      },
    ]);

    const response = await this.client.bulk({
      body,
      refresh: 'wait_for',
    });

    if (response.errors) {
      const errors = response.items
        .filter((item: any) => item.index?.error)
        .map((item: any) => item.index.error);

      throw new Error(`Bulk indexing failed: ${JSON.stringify(errors)}`);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    await this.client.delete({
      index: this.indexName,
      id,
      refresh: 'wait_for',
    });
  }

  async reindex(
    sourceIndex: string,
    script?: string
  ): Promise<void> {
    const body: any = {
      source: {
        index: sourceIndex,
      },
      dest: {
        index: this.indexName,
      },
    };

    if (script) {
      body.script = {
        source: script,
        lang: 'painless',
      };
    }

    await this.client.reindex({
      body,
      wait_for_completion: false,
    });
  }

  private formatSearchResults(response: any): SearchResult {
    return {
      total: response.hits.total.value,
      items: response.hits.hits.map((hit: any) => ({
        ...hit._source,
        _score: hit._score,
        _highlights: hit.highlight,
      })),
      facets: this.formatAggregations(response.aggregations),
      took: response.took,
    };
  }

  private formatAggregations(aggs: any): Record<string, any> {
    if (!aggs) return {};

    const facets: Record<string, any> = {};

    Object.entries(aggs).forEach(([key, value]: [string, any]) => {
      if (value.buckets) {
        facets[key] = value.buckets.map((bucket: any) => ({
          value: bucket.key,
          count: bucket.doc_count,
        }));
      } else if (value.min !== undefined) {
        facets[key] = {
          min: value.min,
          max: value.max,
          avg: value.avg,
        };
      }
    });

    return facets;
  }
}
```

### Algolia Implementation
```typescript
// search/algolia-service.ts
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';

export class AlgoliaService {
  private client: SearchClient;
  private index: SearchIndex;

  constructor(config: AlgoliaConfig) {
    this.client = algoliasearch(config.appId, config.apiKey);
    this.index = this.client.initIndex(config.indexName);

    // Configure index settings
    this.configureIndex();
  }

  private async configureIndex(): Promise<void> {
    await this.index.setSettings({
      searchableAttributes: [
        'title,description',
        'category',
        'tags',
      ],
      attributesForFaceting: [
        'filterOnly(category)',
        'filterOnly(price)',
        'filterOnly(rating)',
        'searchable(tags)',
      ],
      customRanking: [
        'desc(rating)',
        'desc(popularity)',
      ],
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom',
      ],
      synonyms: [
        {
          type: 'synonym',
          synonyms: ['phone', 'mobile', 'cellphone'],
        },
      ],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 4,
          twoTypos: 8,
        },
      },
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      hitsPerPage: 20,
    });

    // Configure replica indices for different sort orders
    await this.index.setSettings({
      replicas: [
        'products_price_asc',
        'products_price_desc',
        'products_rating_desc',
      ],
    });
  }

  async search(
    query: string,
    options: AlgoliaSearchOptions = {}
  ): Promise<SearchResult> {
    const {
      page = 0,
      hitsPerPage = 20,
      filters,
      facets = [],
      facetFilters = [],
    } = options;

    const searchParams: any = {
      query,
      page,
      hitsPerPage,
      facets,
      facetFilters,
      getRankingInfo: true,
      analytics: true,
      clickAnalytics: true,
    };

    // Build filter string
    if (filters) {
      const filterStrings: string[] = [];

      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          filterStrings.push(
            value.map(v => `${key}:${v}`).join(' OR ')
          );
        } else if (typeof value === 'object' && value.min !== undefined) {
          filterStrings.push(`${key} >= ${value.min} AND ${key} <= ${value.max}`);
        } else {
          filterStrings.push(`${key}:${value}`);
        }
      });

      searchParams.filters = filterStrings.join(' AND ');
    }

    const response = await this.index.search(query, searchParams);

    return {
      total: response.nbHits,
      items: response.hits,
      facets: response.facets,
      took: response.processingTimeMS,
      page: response.page,
      totalPages: response.nbPages,
    };
  }

  async searchForFacetValues(
    facetName: string,
    facetQuery: string,
    maxFacetHits: number = 10
  ): Promise<FacetHit[]> {
    const response = await this.index.searchForFacetValues(
      facetName,
      facetQuery,
      {
        maxFacetHits,
      }
    );

    return response.facetHits;
  }

  async saveObjects(objects: any[]): Promise<void> {
    // Add objectID if not present
    const objectsWithId = objects.map(obj => ({
      ...obj,
      objectID: obj.id || obj.objectID,
    }));

    await this.index.saveObjects(objectsWithId, {
      autoGenerateObjectIDIfNotExist: true,
    });
  }

  async partialUpdateObject(
    objectID: string,
    attributes: any
  ): Promise<void> {
    await this.index.partialUpdateObject({
      objectID,
      ...attributes,
    });
  }

  async deleteObject(objectID: string): Promise<void> {
    await this.index.deleteObject(objectID);
  }

  async clearIndex(): Promise<void> {
    await this.index.clearObjects();
  }
}
```

### Vector Search Implementation
```typescript
// search/vector-search.ts
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

export class VectorSearchService {
  private pinecone: PineconeClient;
  private openai: OpenAI;
  private index: any;

  constructor(config: VectorSearchConfig) {
    this.pinecone = new PineconeClient();
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });

    this.initialize(config);
  }

  private async initialize(config: VectorSearchConfig): Promise<void> {
    await this.pinecone.init({
      apiKey: config.pineconeApiKey,
      environment: config.pineconeEnvironment,
    });

    this.index = this.pinecone.Index(config.indexName);
  }

  async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  }

  async indexDocument(document: {
    id: string;
    text: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const embedding = await this.createEmbedding(document.text);

    await this.index.upsert({
      vectors: [
        {
          id: document.id,
          values: embedding,
          metadata: {
            text: document.text,
            ...document.metadata,
          },
        },
      ],
    });
  }

  async search(
    query: string,
    options: {
      topK?: number;
      filter?: Record<string, any>;
      includeMetadata?: boolean;
    } = {}
  ): Promise<VectorSearchResult[]> {
    const { topK = 10, filter, includeMetadata = true } = options;

    // Generate query embedding
    const queryEmbedding = await this.createEmbedding(query);

    // Search for similar vectors
    const response = await this.index.query({
      vector: queryEmbedding,
      topK,
      filter,
      includeMetadata,
    });

    return response.matches.map((match: any) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    }));
  }

  async hybridSearch(
    query: string,
    options: {
      keywordWeight?: number;
      vectorWeight?: number;
      topK?: number;
    } = {}
  ): Promise<any[]> {
    const {
      keywordWeight = 0.5,
      vectorWeight = 0.5,
      topK = 10,
    } = options;

    // Get vector search results
    const vectorResults = await this.search(query, { topK: topK * 2 });

    // Get keyword search results (using existing Elasticsearch)
    const keywordResults = await this.elasticsearchService.search(query, {
      size: topK * 2,
    });

    // Combine and rerank results
    return this.fuseResults(
      vectorResults,
      keywordResults.items,
      keywordWeight,
      vectorWeight,
      topK
    );
  }

  private fuseResults(
    vectorResults: any[],
    keywordResults: any[],
    keywordWeight: number,
    vectorWeight: number,
    topK: number
  ): any[] {
    const scores = new Map<string, number>();

    // Add vector search scores
    vectorResults.forEach((result, index) => {
      const score = (1 - index / vectorResults.length) * vectorWeight;
      scores.set(result.id, score);
    });

    // Add keyword search scores
    keywordResults.forEach((result, index) => {
      const currentScore = scores.get(result.id) || 0;
      const keywordScore = (1 - index / keywordResults.length) * keywordWeight;
      scores.set(result.id, currentScore + keywordScore);
    });

    // Sort by combined score
    const sorted = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK);

    // Return merged results
    return sorted.map(([id, score]) => {
      const vectorResult = vectorResults.find(r => r.id === id);
      const keywordResult = keywordResults.find(r => r.id === id);

      return {
        id,
        score,
        ...vectorResult?.metadata,
        ...keywordResult,
      };
    });
  }

  async deleteVector(id: string): Promise<void> {
    await this.index.delete1({
      ids: [id],
    });
  }
}
```

### Database Full-Text Search
```typescript
// search/postgres-search.ts
import { Knex } from 'knex';

export class PostgresSearchService {
  constructor(private db: Knex) {}

  async setupFullTextSearch(): Promise<void> {
    // Add tsvector column
    await this.db.schema.alterTable('products', table => {
      table.specificType('search_vector', 'tsvector');
    });

    // Create index on tsvector
    await this.db.raw(`
      CREATE INDEX IF NOT EXISTS products_search_idx
      ON products
      USING GIN (search_vector);
    `);

    // Create trigger to update tsvector
    await this.db.raw(`
      CREATE OR REPLACE FUNCTION update_search_vector()
      RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
          setweight(to_tsvector('english', coalesce(NEW.category, '')), 'C') ||
          setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'D');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await this.db.raw(`
      CREATE TRIGGER search_vector_update
      BEFORE INSERT OR UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION update_search_vector();
    `);

    // Update existing records
    await this.db.raw(`
      UPDATE products SET search_vector =
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(category, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'D');
    `);
  }

  async search(
    query: string,
    options: {
      limit?: number;
      offset?: number;
      filters?: Record<string, any>;
    } = {}
  ): Promise<any[]> {
    const { limit = 20, offset = 0, filters = {} } = options;

    let searchQuery = this.db('products')
      .select(
        '*',
        this.db.raw(
          `ts_rank_cd(search_vector, plainto_tsquery('english', ?), 32) AS rank`,
          [query]
        )
      )
      .whereRaw(
        `search_vector @@ plainto_tsquery('english', ?)`,
        [query]
      );

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        searchQuery = searchQuery.whereIn(key, value);
      } else {
        searchQuery = searchQuery.where(key, value);
      }
    });

    // Order by relevance and apply pagination
    const results = await searchQuery
      .orderBy('rank', 'desc')
      .limit(limit)
      .offset(offset);

    return results;
  }

  async searchWithHighlight(
    query: string,
    options: any = {}
  ): Promise<any[]> {
    const results = await this.search(query, options);

    // Add highlighting
    return Promise.all(
      results.map(async result => {
        const highlighted = await this.db.raw(
          `SELECT
            ts_headline('english', ?, plainto_tsquery('english', ?),
              'StartSel=<mark>, StopSel=</mark>, MaxWords=50, MinWords=20') AS title_highlighted,
            ts_headline('english', ?, plainto_tsquery('english', ?),
              'StartSel=<mark>, StopSel=</mark>, MaxWords=150, MinWords=50') AS description_highlighted
          FROM products
          WHERE id = ?`,
          [result.title, query, result.description, query, result.id]
        );

        return {
          ...result,
          _highlights: {
            title: highlighted.rows[0].title_highlighted,
            description: highlighted.rows[0].description_highlighted,
          },
        };
      })
    );
  }
}
```

## Best Practices

### Index Design
- Design schema before indexing
- Use appropriate field types
- Configure analyzers properly
- Set up synonyms and stop words
- Plan for multi-language support

### Query Performance
- Use filters instead of queries when possible
- Implement query caching
- Optimize field mappings
- Use pagination effectively
- Monitor slow queries

### Relevance Tuning
- Boost important fields
- Use function scoring
- Implement click tracking
- A/B test ranking changes
- Monitor search metrics

### Scalability
- Use index aliases for zero-downtime updates
- Implement sharding strategy
- Plan for data growth
- Use read replicas
- Monitor cluster health

## Common Patterns

### Autocomplete
```typescript
// Implement fast autocomplete with edge n-grams
async autocomplete(prefix: string): Promise<string[]> {
  return await this.search(prefix, {
    size: 10,
    searchFields: ['title.autocomplete'],
  });
}
```

### Faceted Search
```typescript
// Get facets with counts
async getFilteredResults(query: string, filters: any) {
  return await this.search(query, {
    filters,
    facets: ['category', 'brand', 'price_range'],
  });
}
```

### Geo Search
```typescript
// Search within radius
async searchNearby(lat: number, lon: number, radius: string) {
  return await this.search('', {
    filters: {
      location: {
        distance: radius,
        lat,
        lon,
      },
    },
  });
}
```

## Testing

### Search Quality Testing
```typescript
describe('Search Relevance', () => {
  test('should rank exact matches highest', async () => {
    const results = await search.search('iphone 14 pro');

    expect(results.items[0].title).toContain('iPhone 14 Pro');
    expect(results.items[0]._score).toBeGreaterThan(5.0);
  });

  test('should handle typos', async () => {
    const results = await search.search('iphne'); // Typo

    expect(results.items.some(i =>
      i.title.toLowerCase().includes('iphone')
    )).toBe(true);
  });
});
```

## Security Considerations

### Query Security
- Sanitize user input
- Implement query validation
- Use parameterized queries
- Limit query complexity
- Implement rate limiting

### Index Security
- Use API keys with minimal permissions
- Encrypt data at rest
- Implement field-level security
- Audit search queries
- Monitor for abuse patterns

## References

- [Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Algolia Documentation](https://www.algolia.com/doc/)
- [PostgreSQL Full Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [Vector Search Best Practices](https://www.pinecone.io/learn/vector-database/)
- [Search Relevance Tuning](https://opensearch.org/docs/latest/search-plugins/relevance/)