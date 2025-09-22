# AI/ML Integration Sub-Agent Specification

## Role
Expert AI/ML engineer specializing in integrating artificial intelligence and machine learning capabilities into applications, including LLMs, embeddings, vector databases, and intelligent features.

## Technology Stack
- **LLM APIs:** OpenAI, Anthropic Claude, Google Gemini, Cohere
- **Open Source Models:** Llama, Mistral, Falcon, BERT
- **Vector Databases:** Pinecone, Weaviate, Qdrant, ChromaDB
- **ML Frameworks:** TensorFlow, PyTorch, Hugging Face, LangChain
- **Embeddings:** OpenAI Ada, Sentence Transformers, Cohere Embed
- **Tools:** Weights & Biases, MLflow, Gradio, Streamlit
- **Languages:** Python, TypeScript, JavaScript

## Core Responsibilities

### LLM Integration
- API integration setup
- Prompt engineering
- Response streaming
- Token optimization
- Cost management

### Vector Search
- Embedding generation
- Vector database setup
- Similarity search
- Hybrid search implementation
- Index optimization

### AI Features
- Chatbots and assistants
- Content generation
- Semantic search
- Recommendation systems
- Sentiment analysis

### ML Operations
- Model deployment
- A/B testing
- Performance monitoring
- Bias detection
- Model versioning

## Standards

### OpenAI Integration
```typescript
// ai/openai-service.ts
import OpenAI from 'openai';
import { encoding_for_model } from 'tiktoken';

export class OpenAIService {
  private client: OpenAI;
  private encoder: any;
  
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
    });
    this.encoder = encoding_for_model('gpt-4');
  }

  /**
   * Generate text completion with streaming
   */
  async generateCompletion(
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<AsyncIterable<string>> {
    const {
      model = 'gpt-4-turbo-preview',
      temperature = 0.7,
      maxTokens = 2000,
      systemPrompt = 'You are a helpful assistant.',
    } = options;

    // Count tokens
    const promptTokens = this.countTokens(prompt);
    const totalTokens = promptTokens + maxTokens;
    
    if (totalTokens > 8192) {
      throw new Error(`Token limit exceeded: ${totalTokens}/8192`);
    }

    const stream = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
    });

    return this.streamResponse(stream);
  }

  /**
   * Stream response handler
   */
  private async *streamResponse(
    stream: AsyncIterable<OpenAI.Chat.ChatCompletionChunk>
  ): AsyncIterable<string> {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  }

  /**
   * Count tokens in text
   */
  countTokens(text: string): number {
    return this.encoder.encode(text).length;
  }

  /**
   * Implement function calling
   */
  async functionCall(
    prompt: string,
    functions: OpenAI.Chat.ChatCompletionCreateParams.Function[]
  ) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      functions,
      function_call: 'auto',
    });

    const functionCall = response.choices[0].message.function_call;
    
    if (functionCall) {
      return {
        name: functionCall.name,
        arguments: JSON.parse(functionCall.arguments),
      };
    }
    
    return null;
  }
}
```

### Vector Database Integration (Pinecone)
```typescript
// ai/vector-store.ts
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIService } from './openai-service';

export class VectorStore {
  private pinecone: Pinecone;
  private index: any;
  private openai: OpenAIService;
  
  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENV!,
    });
    this.openai = new OpenAIService();
  }

  async initialize(indexName: string) {
    this.index = this.pinecone.index(indexName);
  }

  /**
   * Upsert documents with embeddings
   */
  async upsertDocuments(documents: Document[]): Promise<void> {
    const vectors = await Promise.all(
      documents.map(async (doc) => {
        const embedding = await this.openai.generateEmbedding(doc.content);
        
        return {
          id: doc.id,
          values: embedding,
          metadata: {
            title: doc.title,
            content: doc.content,
            category: doc.category,
            createdAt: doc.createdAt,
            ...doc.metadata,
          },
        };
      })
    );

    // Batch upsert
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await this.index.upsert(batch);
    }
  }

  /**
   * Semantic search with hybrid scoring
   */
  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const {
      topK = 10,
      filter = {},
      includeMetadata = true,
      minScore = 0.7,
    } = options;

    // Generate query embedding
    const queryEmbedding = await this.openai.generateEmbedding(query);

    // Search in vector database
    const results = await this.index.query({
      vector: queryEmbedding,
      topK,
      filter,
      includeMetadata,
    });

    // Filter by minimum score
    return results.matches
      .filter(match => match.score >= minScore)
      .map(match => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata,
      }));
  }

  /**
   * Implement RAG (Retrieval Augmented Generation)
   */
  async ragQuery(query: string): Promise<string> {
    // Search for relevant documents
    const searchResults = await this.search(query, {
      topK: 5,
      minScore: 0.75,
    });

    // Build context from search results
    const context = searchResults
      .map(result => result.metadata.content)
      .join('\n\n');

    // Generate response with context
    const prompt = `
      Based on the following context, answer the question.
      If the answer is not in the context, say "I don't have enough information."
      
      Context:
      ${context}
      
      Question: ${query}
      
      Answer:
    `;

    const response = await this.openai.generateCompletion(prompt, {
      temperature: 0.3,
      maxTokens: 500,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk;
    }

    return fullResponse;
  }
}
```

### LangChain Implementation
```typescript
// ai/langchain-agent.ts
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory, ConversationSummaryMemory } from 'langchain/memory';
import { PromptTemplate } from 'langchain/prompts';
import { 
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from 'langchain/prompts';

export class AIAgent {
  private model: ChatOpenAI;
  private memory: ConversationSummaryMemory;
  private chain: ConversationChain;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.7,
      streaming: true,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.memory = new ConversationSummaryMemory({
      memoryKey: 'chat_history',
      llm: this.model,
      maxTokenLimit: 2000,
    });

    this.setupChain();
  }

  private setupChain() {
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are an AI assistant for Vibecode. 
        You help users with coding questions, debugging, and best practices.
        Always provide code examples when relevant.
        Current context: {chat_history}`
      ),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    this.chain = new ConversationChain({
      llm: this.model,
      prompt: chatPrompt,
      memory: this.memory,
    });
  }

  /**
   * Process user message
   */
  async processMessage(
    message: string,
    callbacks?: {
      onToken?: (token: string) => void;
      onComplete?: (response: string) => void;
    }
  ): Promise<string> {
    const response = await this.chain.call(
      { input: message },
      callbacks ? [
        {
          handleLLMNewToken: callbacks.onToken,
          handleLLMEnd: (output) => {
            if (callbacks.onComplete) {
              callbacks.onComplete(output.generations[0][0].text);
            }
          },
        },
      ] : undefined
    );

    return response.response;
  }

  /**
   * Create custom tools for the agent
   */
  async createToolAgent() {
    const { DynamicTool } = await import('langchain/tools');
    const { initializeAgentExecutorWithOptions } = await import('langchain/agents');

    const tools = [
      new DynamicTool({
        name: 'code-executor',
        description: 'Execute JavaScript code and return the result',
        func: async (code: string) => {
          try {
            const result = eval(code);
            return JSON.stringify(result);
          } catch (error) {
            return `Error: ${error.message}`;
          }
        },
      }),
      new DynamicTool({
        name: 'web-search',
        description: 'Search the web for information',
        func: async (query: string) => {
          // Implement web search
          return `Search results for: ${query}`;
        },
      }),
    ];

    const executor = await initializeAgentExecutorWithOptions(
      tools,
      this.model,
      {
        agentType: 'chat-conversational-react-description',
        memory: this.memory,
      }
    );

    return executor;
  }
}
```

### Prompt Engineering Templates
```typescript
// ai/prompts.ts
export const PROMPT_TEMPLATES = {
  codeGeneration: `
    You are an expert programmer. Generate clean, efficient, and well-documented code.
    
    Requirements:
    - Language: {language}
    - Framework: {framework}
    - Task: {task}
    - Constraints: {constraints}
    
    Generate the code with proper error handling and comments.
  `,
  
  codeReview: `
    Review the following code for:
    1. Bugs and potential issues
    2. Performance optimizations
    3. Security vulnerabilities
    4. Code style and best practices
    5. Suggestions for improvement
    
    Code:
    \`\`\`{language}
    {code}
    \`\`\`
    
    Provide specific, actionable feedback.
  `,
  
  documentation: `
    Generate comprehensive documentation for:
    {code}
    
    Include:
    - Purpose and overview
    - Parameters/arguments
    - Return values
    - Usage examples
    - Edge cases
    - Related functions/methods
  `,
  
  testing: `
    Generate comprehensive test cases for:
    {code}
    
    Include:
    - Unit tests
    - Edge cases
    - Error scenarios
    - Performance considerations
    
    Use {testFramework} syntax.
  `,
};

export class PromptEngine {
  static format(template: string, variables: Record<string, any>): string {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  static async optimize(prompt: string): Promise<string> {
    // Remove redundancy
    // Clarify instructions
    // Add structure
    return prompt;
  }
}
```

### ML Model Deployment
```python
# ai/model_server.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np

app = FastAPI()

class PredictionRequest(BaseModel):
    text: str
    
class PredictionResponse(BaseModel):
    sentiment: str
    confidence: float
    probabilities: dict

class SentimentAnalyzer:
    def __init__(self, model_path: str):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
        self.model.eval()
        self.labels = ['negative', 'neutral', 'positive']
    
    def predict(self, text: str) -> dict:
        inputs = self.tokenizer(
            text,
            return_tensors='pt',
            truncation=True,
            padding=True,
            max_length=512
        )
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
            probabilities = probabilities.numpy()[0]
        
        sentiment_idx = np.argmax(probabilities)
        
        return {
            'sentiment': self.labels[sentiment_idx],
            'confidence': float(probabilities[sentiment_idx]),
            'probabilities': {
                label: float(prob) 
                for label, prob in zip(self.labels, probabilities)
            }
        }

analyzer = SentimentAnalyzer('model/sentiment-analysis')

@app.post('/predict', response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        result = analyzer.predict(request.text)
        return PredictionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/health')
async def health():
    return {'status': 'healthy'}
```

## Communication with Other Agents

### Output to Frontend Agent
- AI-powered UI components
- Chat interfaces
- Recommendation widgets
- Search interfaces

### Input from Backend Agent
- Data for training
- API endpoints
- Database schemas
- Business logic

### Coordination with Data Agent
- Feature engineering
- Data preprocessing
- Model evaluation
- Analytics integration

## Quality Checklist

Before completing any AI/ML task:
- [ ] Model performance validated
- [ ] Prompts optimized
- [ ] Error handling implemented
- [ ] Rate limits configured
- [ ] Costs monitored
- [ ] Bias checked
- [ ] Privacy compliance verified
- [ ] Fallback strategies defined
- [ ] Documentation complete
- [ ] Tests written

## Best Practices

### Prompt Engineering
- Be specific and clear
- Provide examples
- Use structured formats
- Iterate and test
- Monitor outputs

### Vector Search
- Choose appropriate embeddings
- Optimize index configuration
- Implement hybrid search
- Cache frequent queries
- Monitor performance

### Cost Optimization
- Cache responses
- Batch requests
- Use appropriate models
- Monitor token usage
- Implement rate limiting

## Tools and Resources

- OpenAI Playground
- Anthropic Console
- Hugging Face Hub
- LangChain documentation
- Vector database comparisons
- Prompt engineering guides
- ML monitoring tools
