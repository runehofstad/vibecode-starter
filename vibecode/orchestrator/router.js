import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Intelligent agent routing system for Claude Code
 * Automatically selects and chains agents based on task analysis
 */

export class AgentRouter {
  constructor() {
    this.routingRules = this.loadRoutingRules();
    this.agentCapabilities = this.loadAgentCapabilities();
    this.activeAgents = new Set();
  }

  loadRoutingRules() {
    return {
      // File pattern to agent mapping
      filePatterns: {
        '**/*.tsx': ['frontend-agent', 'design-agent'],
        '**/*.jsx': ['frontend-agent', 'design-agent'],
        '**/components/**': ['frontend-agent', 'testing-agent'],
        '**/api/**': ['backend-agent', 'api-graphql-agent'],
        '**/*.sql': ['data-agent', 'database-migration-agent'],
        '**/supabase/**': ['backend-agent', 'security-agent'],
        '**/*.test.*': ['testing-agent'],
        '**/*.spec.*': ['testing-agent'],
        '.github/workflows/**': ['devops-agent'],
        'Dockerfile*': ['docker-container-agent', 'devops-agent'],
        '**/auth/**': ['security-agent', 'backend-agent'],
        '**/*.swift': ['ios-swift-agent'],
        '**/*.dart': ['flutter-agent'],
        '**/android/**': ['mobile-agent'],
        '**/ios/**': ['mobile-agent', 'ios-swift-agent']
      },

      // Task keyword to agent mapping
      taskKeywords: {
        'authentication|login|signup|auth': ['security-agent', 'backend-agent', 'frontend-agent'],
        'database|query|migration|schema': ['data-agent', 'database-migration-agent', 'backend-agent'],
        'ui|interface|component|design|layout': ['frontend-agent', 'design-agent'],
        'test|testing|coverage|e2e': ['testing-agent'],
        'deploy|deployment|ci|cd|pipeline': ['devops-agent'],
        'performance|optimize|speed|cache': ['data-agent', 'monitoring-observability-agent'],
        'api|endpoint|rest|graphql': ['api-graphql-agent', 'backend-agent'],
        'mobile|ios|android|react native': ['mobile-agent'],
        'security|encryption|vulnerability': ['security-agent'],
        'docker|container|kubernetes': ['docker-container-agent', 'devops-agent'],
        'accessibility|a11y|wcag': ['accessibility-agent', 'frontend-agent'],
        'payment|stripe|billing': ['payment-agent', 'security-agent', 'backend-agent'],
        'email|notification|sms': ['email-communication-agent', 'backend-agent'],
        'websocket|realtime|socket': ['websocket-realtime-agent', 'backend-agent'],
        'seo|marketing|analytics': ['seo-marketing-agent', 'frontend-agent'],
        'i18n|localization|translation': ['localization-agent', 'frontend-agent']
      },

      // Agent dependency chains
      agentChains: {
        'feature-development': [
          { agents: ['backend-agent'], parallel: false },
          { agents: ['frontend-agent', 'mobile-agent'], parallel: true },
          { agents: ['testing-agent'], parallel: false }
        ],
        'bug-fix': [
          { agents: ['testing-agent'], parallel: false },
          { agents: ['backend-agent', 'frontend-agent'], parallel: true },
          { agents: ['testing-agent'], parallel: false }
        ],
        'security-audit': [
          { agents: ['security-agent'], parallel: false },
          { agents: ['backend-agent', 'frontend-agent'], parallel: true },
          { agents: ['testing-agent'], parallel: false }
        ],
        'performance-optimization': [
          { agents: ['monitoring-observability-agent'], parallel: false },
          { agents: ['data-agent', 'backend-agent', 'frontend-agent'], parallel: true },
          { agents: ['testing-agent'], parallel: false }
        ]
      }
    };
  }

  loadAgentCapabilities() {
    return {
      'frontend-agent': {
        capabilities: ['ui', 'react', 'typescript', 'css', 'components'],
        priority: 2,
        dependencies: []
      },
      'backend-agent': {
        capabilities: ['api', 'database', 'authentication', 'server'],
        priority: 1,
        dependencies: []
      },
      'mobile-agent': {
        capabilities: ['react-native', 'ios', 'android', 'mobile-ui'],
        priority: 2,
        dependencies: ['backend-agent']
      },
      'testing-agent': {
        capabilities: ['jest', 'playwright', 'testing', 'coverage'],
        priority: 3,
        dependencies: ['frontend-agent', 'backend-agent']
      },
      'security-agent': {
        capabilities: ['authentication', 'encryption', 'vulnerability', 'gdpr'],
        priority: 1,
        dependencies: []
      },
      'devops-agent': {
        capabilities: ['ci-cd', 'deployment', 'docker', 'monitoring'],
        priority: 3,
        dependencies: ['backend-agent']
      },
      'data-agent': {
        capabilities: ['database', 'optimization', 'migration', 'analytics'],
        priority: 1,
        dependencies: []
      },
      'design-agent': {
        capabilities: ['ui-ux', 'figma', 'design-system', 'accessibility'],
        priority: 1,
        dependencies: []
      }
    };
  }

  /**
   * Analyze task and determine required agents
   */
  analyzeTask(taskDescription, files = []) {
    const agents = new Set();
    const taskLower = taskDescription.toLowerCase();

    // Check task keywords
    for (const [pattern, agentList] of Object.entries(this.routingRules.taskKeywords)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(taskLower)) {
        agentList.forEach(agent => agents.add(agent));
      }
    }

    // Check file patterns
    for (const file of files) {
      for (const [pattern, agentList] of Object.entries(this.routingRules.filePatterns)) {
        if (this.matchPattern(file, pattern)) {
          agentList.forEach(agent => agents.add(agent));
        }
      }
    }

    // If no agents found, use general-purpose for research
    if (agents.size === 0) {
      return ['general-purpose'];
    }

    return this.orderAgentsByPriority(Array.from(agents));
  }

  /**
   * Match file path against pattern (simplified glob matching)
   */
  matchPattern(filePath, pattern) {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');

    return new RegExp(`^${regexPattern}$`).test(filePath);
  }

  /**
   * Order agents by priority and dependencies
   */
  orderAgentsByPriority(agents) {
    return agents.sort((a, b) => {
      const capA = this.agentCapabilities[a];
      const capB = this.agentCapabilities[b];

      if (!capA || !capB) return 0;

      // Check dependencies
      if (capA.dependencies.includes(b)) return 1;
      if (capB.dependencies.includes(a)) return -1;

      // Sort by priority
      return (capA.priority || 99) - (capB.priority || 99);
    });
  }

  /**
   * Get execution plan for agents
   */
  getExecutionPlan(agents, preferParallel = true) {
    const plan = [];
    const processed = new Set();

    // Group agents that can run in parallel
    const groups = [];

    for (const agent of agents) {
      const cap = this.agentCapabilities[agent];
      if (!cap) continue;

      // Check if agent has unprocessed dependencies
      const hasUnmetDeps = cap.dependencies.some(dep =>
        agents.includes(dep) && !processed.has(dep)
      );

      if (hasUnmetDeps) {
        // Add dependencies first
        const depGroup = cap.dependencies.filter(dep =>
          agents.includes(dep) && !processed.has(dep)
        );
        groups.push({ agents: depGroup, parallel: preferParallel });
        depGroup.forEach(dep => processed.add(dep));
      }

      // Find or create group for this priority level
      let group = groups.find(g =>
        !g.agents.some(a =>
          this.agentCapabilities[a]?.dependencies.includes(agent) ||
          cap.dependencies.includes(a)
        )
      );

      if (!group) {
        group = { agents: [], parallel: preferParallel };
        groups.push(group);
      }

      group.agents.push(agent);
      processed.add(agent);
    }

    return groups.filter(g => g.agents.length > 0);
  }

  /**
   * Route task to appropriate agents with execution plan
   */
  route(taskDescription, context = {}) {
    const { files = [], chainType = null, parallel = true } = context;

    // Check for predefined chains
    if (chainType && this.routingRules.agentChains[chainType]) {
      return {
        agents: this.routingRules.agentChains[chainType],
        type: 'chain',
        chainType
      };
    }

    // Analyze task to find agents
    const agents = this.analyzeTask(taskDescription, files);

    // Get execution plan
    const executionPlan = this.getExecutionPlan(agents, parallel);

    return {
      agents: agents,
      executionPlan,
      type: 'dynamic'
    };
  }

  /**
   * Generate Claude Code Task tool calls
   */
  generateTaskCalls(routingResult, taskDescription) {
    const { agents, executionPlan, type } = routingResult;
    const calls = [];

    if (type === 'chain') {
      // Use predefined chain
      for (const phase of agents) {
        const phaseCalls = phase.agents.map(agent => ({
          tool: 'Task',
          subagent_type: agent === 'general-purpose' ? 'general-purpose' : agent.replace('-agent', ''),
          description: `${agent}: ${taskDescription}`,
          prompt: taskDescription,
          parallel: phase.parallel
        }));
        calls.push(...phaseCalls);
      }
    } else {
      // Use dynamic execution plan
      for (const group of executionPlan) {
        const groupCalls = group.agents.map(agent => ({
          tool: 'Task',
          subagent_type: agent === 'general-purpose' ? 'general-purpose' : agent.replace('-agent', ''),
          description: `${agent}: ${taskDescription}`,
          prompt: taskDescription,
          parallel: group.parallel
        }));
        calls.push(...groupCalls);
      }
    }

    return calls;
  }
}

// Export for use in Claude Code
export default AgentRouter;