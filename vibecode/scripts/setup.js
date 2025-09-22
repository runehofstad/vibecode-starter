#!/usr/bin/env node

import { readFileSync, writeFileSync, cpSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';
import inquirer from 'inquirer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = process.cwd();

/**
 * Setup Vibecode Cursor for a project
 */
async function setup() {
  console.log(chalk.magenta.bold('\n📝 Vibecode Cursor Edition - Intelligent .cursorrules Generator\n'));

  // Step 1: Detect project type
  console.log(chalk.yellow('🔍 Analyzing your project...'));
  const projectInfo = await analyzeProject();

  console.log(chalk.green('✅ Project detected!\n'));
  console.log('Type:', chalk.cyan(projectInfo.type));
  console.log('Stack:', chalk.cyan(projectInfo.stack.join(', ') || 'None'));

  // Step 2: Select configuration template
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select project template:',
      choices: [
        { name: 'Web App (React/Vue/Next)', value: 'web' },
        { name: 'Mobile App (React Native/Flutter)', value: 'mobile' },
        { name: 'Full-Stack (Next.js/Nuxt)', value: 'fullstack' },
        { name: 'API Backend (Node/Python/Go)', value: 'backend' },
        { name: 'Custom (Select agents manually)', value: 'custom' }
      ],
      default: projectInfo.suggestedTemplate
    }
  ]);

  // Step 3: Select agents
  let selectedAgents = [];

  if (template === 'custom') {
    const { agents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'agents',
        message: 'Select agents to include:',
        choices: getAvailableAgents(),
        validate: (answer) => answer.length > 0 || 'Select at least one agent'
      }
    ]);
    selectedAgents = agents;
  } else {
    selectedAgents = getTemplateAgents(template);
    console.log(chalk.yellow('\n🤖 Selected agents for', template, 'template:'));
    selectedAgents.forEach(agent => console.log(chalk.green('  ✓'), agent));
  }

  // Step 4: Configure options
  const { options } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'options',
      message: 'Additional options:',
      choices: [
        { name: 'Include Git workflow rules', value: 'git', checked: true },
        { name: 'Include testing guidelines', value: 'testing', checked: true },
        { name: 'Include security best practices', value: 'security', checked: true },
        { name: 'Include performance guidelines', value: 'performance' },
        { name: 'Include accessibility rules', value: 'accessibility' },
        { name: 'Include documentation templates', value: 'docs' }
      ]
    }
  ]);

  // Step 5: Use agent files from .vibecode/agents (already included in package)
  console.log(chalk.yellow('\n📦 Setting up agent definitions...'));
  const vibecodeAgentsPath = join(__dirname, '..', 'agents');
  const cursorAgentsPath = join(projectRoot, '.cursor', 'agents');

  mkdirSync(cursorAgentsPath, { recursive: true });

  for (const agent of selectedAgents) {
    const agentFile = `${agent}.md`;
    const sourcePath = join(vibecodeAgentsPath, agentFile);
    const targetPath = join(cursorAgentsPath, agentFile);

    if (existsSync(sourcePath)) {
      cpSync(sourcePath, targetPath);
      console.log(chalk.green('  ✓'), agentFile);
    }
  }

  // Step 6: Generate .cursorrules
  console.log(chalk.yellow('\n⚙️ Generating .cursorrules...'));
  const cursorRules = await generateCursorRules(selectedAgents, options, projectInfo);
  writeFileSync(join(projectRoot, '.cursorrules'), cursorRules);

  // Step 7: Generate Cursor context file
  console.log(chalk.yellow('📋 Generating Cursor context...'));
  const contextContent = generateCursorContext(selectedAgents, projectInfo);
  mkdirSync(join(projectRoot, '.cursor'), { recursive: true });
  writeFileSync(join(projectRoot, '.cursor', 'context.md'), contextContent);

  // Step 8: Generate Composer prompts
  console.log(chalk.yellow('💬 Generating Composer prompts...'));
  const composerPrompts = generateComposerPrompts(selectedAgents, template);
  writeFileSync(join(projectRoot, '.cursor', 'composer-prompts.md'), composerPrompts);

  // Success!
  console.log(chalk.green.bold('\n✨ Vibecode Cursor setup complete!\n'));
  console.log('Generated files:');
  console.log('  •', chalk.cyan('.cursorrules'), '- Cursor IDE rules with agent instructions');
  console.log('  •', chalk.cyan('.cursor/context.md'), '- Project context for agents');
  console.log('  •', chalk.cyan('.cursor/composer-prompts.md'), '- Ready-to-use Composer prompts');
  console.log('  •', chalk.cyan('.cursor/agents/'), '- Agent specifications');

  console.log('\nNext steps:');
  console.log('1. Open your project in Cursor');
  console.log('2. Cursor will automatically use .cursorrules');
  console.log('3. Reference agents in Composer: @agent-name');
  console.log('4. Use prompts from composer-prompts.md');
}

/**
 * Analyze project to detect type and stack
 */
async function analyzeProject() {
  const info = {
    type: 'unknown',
    stack: [],
    suggestedTemplate: 'web'
  };

  // Check package.json
  if (existsSync(join(projectRoot, 'package.json'))) {
    const pkg = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Detect frameworks
    if (deps.react) info.stack.push('React');
    if (deps.vue) info.stack.push('Vue');
    if (deps.next) {
      info.stack.push('Next.js');
      info.type = 'fullstack';
      info.suggestedTemplate = 'fullstack';
    }
    if (deps['react-native']) {
      info.stack.push('React Native');
      info.type = 'mobile';
      info.suggestedTemplate = 'mobile';
    }
    if (deps.express || deps.fastify) {
      info.stack.push('Node.js');
      if (!info.type || info.type === 'unknown') {
        info.type = 'backend';
        info.suggestedTemplate = 'backend';
      }
    }

    // Detect tools
    if (deps.typescript) info.stack.push('TypeScript');
    if (deps.tailwindcss) info.stack.push('Tailwind');
    if (deps['@supabase/supabase-js']) info.stack.push('Supabase');
    if (deps.firebase) info.stack.push('Firebase');
  }

  // Check for other project types
  if (existsSync(join(projectRoot, 'pubspec.yaml'))) {
    info.stack.push('Flutter');
    info.type = 'mobile';
    info.suggestedTemplate = 'mobile';
  }

  if (existsSync(join(projectRoot, 'requirements.txt'))) {
    info.stack.push('Python');
    if (info.type === 'unknown') {
      info.type = 'backend';
      info.suggestedTemplate = 'backend';
    }
  }

  if (existsSync(join(projectRoot, 'go.mod'))) {
    info.stack.push('Go');
    info.type = 'backend';
    info.suggestedTemplate = 'backend';
  }

  if (info.type === 'unknown' && info.stack.length > 0) {
    info.type = 'web';
  }

  return info;
}

/**
 * Get available agents
 */
function getAvailableAgents() {
  return [
    { name: 'Frontend Development', value: 'frontend-agent' },
    { name: 'Backend Development', value: 'backend-agent' },
    { name: 'Mobile Development', value: 'mobile-agent' },
    { name: 'API & GraphQL', value: 'api-graphql-agent' },
    { name: 'Testing & QA', value: 'testing-agent' },
    { name: 'DevOps & CI/CD', value: 'devops-agent' },
    { name: 'Security & Auth', value: 'security-agent' },
    { name: 'Database & Data', value: 'data-agent' },
    { name: 'UI/UX Design', value: 'design-agent' },
    { name: 'Docker & Containers', value: 'docker-container-agent' },
    { name: 'AWS Services', value: 'aws-backend-agent' },
    { name: 'Firebase Services', value: 'firebase-backend-agent' },
    { name: 'Flutter Development', value: 'flutter-agent' },
    { name: 'iOS Native (Swift)', value: 'ios-swift-agent' },
    { name: 'Database Migrations', value: 'database-migration-agent' },
    { name: 'Monitoring & Observability', value: 'monitoring-observability-agent' },
    { name: 'Documentation', value: 'documentation-agent' },
    { name: 'AI/ML Integration', value: 'ai-ml-integration-agent' },
    { name: 'Accessibility', value: 'accessibility-agent' },
    { name: 'SEO & Marketing', value: 'seo-marketing-agent' },
    { name: 'Localization & i18n', value: 'localization-agent' },
    { name: 'PWA & Offline', value: 'pwa-offline-agent' },
    { name: 'Payment Processing', value: 'payment-agent' },
    { name: 'WebSocket & Real-time', value: 'websocket-realtime-agent' },
    { name: 'Email & Communication', value: 'email-communication-agent' }
  ];
}

/**
 * Get agents for template
 */
function getTemplateAgents(template) {
  const templates = {
    web: [
      'frontend-agent',
      'design-agent',
      'testing-agent',
      'security-agent',
      'accessibility-agent',
      'seo-marketing-agent'
    ],
    mobile: [
      'mobile-agent',
      'backend-agent',
      'testing-agent',
      'security-agent',
      'design-agent'
    ],
    fullstack: [
      'frontend-agent',
      'backend-agent',
      'api-graphql-agent',
      'testing-agent',
      'security-agent',
      'devops-agent',
      'data-agent',
      'design-agent'
    ],
    backend: [
      'backend-agent',
      'api-graphql-agent',
      'data-agent',
      'testing-agent',
      'security-agent',
      'devops-agent',
      'docker-container-agent'
    ]
  };

  return templates[template] || templates.web;
}

/**
 * Generate .cursorrules content
 */
async function generateCursorRules(agents, options, projectInfo) {
  const vibecodeAgentsPath = join(__dirname, '..', 'agents');

  let rules = `# Cursor IDE Rules - Vibecode Configuration

## Project Context
- Type: ${projectInfo.type}
- Stack: ${projectInfo.stack.join(', ')}
- Active Agents: ${agents.length}

## Core Principles
1. Follow agent-specific guidelines for each domain
2. Maintain consistency across all code
3. Prioritize readability and maintainability
4. Write comprehensive tests for all features
5. Document complex logic and decisions

`;

  // Add agent-specific rules
  rules += '## Agent Instructions\n\n';

  for (const agent of agents) {
    const agentPath = join(vibecodeAgentsPath, `${agent}.md`);
    if (existsSync(agentPath)) {
      const content = readFileSync(agentPath, 'utf8');
      const summary = extractAgentSummary(content);

      rules += `### ${formatAgentName(agent)}\n`;
      rules += `${summary}\n\n`;
    }
  }

  // Add optional rules
  if (options.includes('git')) {
    rules += `## Git Workflow
- Use conventional commits (feat:, fix:, docs:, etc.)
- Keep commits atomic and focused
- Write clear, descriptive commit messages
- Create feature branches for all changes
- Squash commits before merging

`;
  }

  if (options.includes('testing')) {
    rules += `## Testing Guidelines
- Write tests before implementing features (TDD)
- Aim for >80% code coverage
- Include unit, integration, and E2E tests
- Test edge cases and error scenarios
- Use descriptive test names

`;
  }

  if (options.includes('security')) {
    rules += `## Security Best Practices
- Never hardcode secrets or credentials
- Validate all user inputs
- Use parameterized queries for databases
- Implement proper authentication and authorization
- Keep dependencies updated
- Follow OWASP guidelines

`;
  }

  if (options.includes('performance')) {
    rules += `## Performance Guidelines
- Optimize for Core Web Vitals
- Implement lazy loading for heavy components
- Use proper caching strategies
- Minimize bundle sizes
- Profile and optimize database queries

`;
  }

  if (options.includes('accessibility')) {
    rules += `## Accessibility Rules
- Follow WCAG 2.1 AA standards
- Provide proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain proper color contrast

`;
  }

  if (options.includes('docs')) {
    rules += `## Documentation Standards
- Document all public APIs
- Include usage examples
- Maintain up-to-date README
- Document architectural decisions
- Create onboarding guides

`;
  }

  rules += `## File-Based Agent Activation

When working on specific file types, follow these agent guidelines:

`;

  // Add file pattern rules
  const filePatterns = {
    '*.tsx, *.jsx': 'frontend-agent',
    '*/api/*, */backend/*': 'backend-agent',
    '*.test.*, *.spec.*': 'testing-agent',
    '*/components/*': 'frontend-agent, design-agent',
    'Dockerfile, docker-compose.yml': 'docker-container-agent',
    '.github/workflows/*': 'devops-agent',
    '*.sql, */migrations/*': 'data-agent',
    '*/auth/*, */security/*': 'security-agent'
  };

  for (const [pattern, agent] of Object.entries(filePatterns)) {
    if (agents.some(a => agent.includes(a))) {
      rules += `- **${pattern}**: Apply ${agent} guidelines\n`;
    }
  }

  rules += `

## Task-Based Agent Selection

For specific tasks, consult these agents:

`;

  const taskMap = {
    'UI/Component Development': 'frontend-agent, design-agent',
    'API Development': 'backend-agent, api-graphql-agent',
    'Database Work': 'data-agent, backend-agent',
    'Testing': 'testing-agent',
    'Security': 'security-agent',
    'Performance': 'monitoring-observability-agent',
    'Deployment': 'devops-agent',
    'Mobile': 'mobile-agent'
  };

  for (const [task, agent] of Object.entries(taskMap)) {
    if (agents.some(a => agent.includes(a))) {
      rules += `- **${task}**: ${agent}\n`;
    }
  }

  rules += `

---

*Generated by Vibecode Cursor - Intelligent Agent System*
*Agents are available in .cursor/agents/ for detailed reference*
`;

  return rules;
}

/**
 * Extract agent summary from markdown
 */
function extractAgentSummary(markdown) {
  const lines = markdown.split('\n');
  const summary = [];
  let capturing = false;

  for (const line of lines) {
    if (line.startsWith('## Expertise') || line.startsWith('## Core Responsibilities')) {
      capturing = true;
      continue;
    }
    if (capturing && line.startsWith('##')) {
      break;
    }
    if (capturing && line.trim() && line.startsWith('-')) {
      summary.push(line);
      if (summary.length >= 5) break;
    }
  }

  return summary.join('\n') || '- Specialized agent for this domain';
}

/**
 * Format agent name
 */
function formatAgentName(agent) {
  return agent
    .replace(/-agent$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + ' Agent';
}

/**
 * Generate Cursor context file
 */
function generateCursorContext(agents, projectInfo) {
  return `# Cursor Project Context

## Project Information
- **Type**: ${projectInfo.type}
- **Stack**: ${projectInfo.stack.join(', ')}
- **Agents**: ${agents.length} specialized agents configured

## Active Agents

${agents.map(agent => `- **${formatAgentName(agent)}**: @${agent}`).join('\n')}

## How to Use Agents in Cursor

### In Composer:
1. Reference agents using @agent-name
2. Example: "@frontend-agent help me create a responsive navbar"
3. Agents provide domain-specific expertise

### Agent Specializations:

${agents.map(agent => {
  const specializations = {
    'frontend-agent': 'React, TypeScript, UI components, state management',
    'backend-agent': 'APIs, databases, authentication, server logic',
    'mobile-agent': 'React Native, mobile UI, platform-specific features',
    'testing-agent': 'Jest, Playwright, E2E tests, coverage',
    'security-agent': 'Authentication, encryption, GDPR, vulnerabilities',
    'devops-agent': 'CI/CD, deployment, Docker, monitoring',
    'data-agent': 'Database optimization, migrations, queries',
    'design-agent': 'UI/UX, Figma, design systems, accessibility'
  };

  return `**${formatAgentName(agent)}**
Specializes in: ${specializations[agent] || 'Domain-specific expertise'}
Reference: @${agent}
`;
}).join('\n')}

## Quick Commands

### For new features:
1. "@backend-agent create API endpoint for [feature]"
2. "@frontend-agent build UI for [feature]"
3. "@testing-agent write tests for [feature]"

### For debugging:
1. "@testing-agent help debug this error"
2. "@backend-agent optimize this query"
3. "@frontend-agent fix rendering issue"

### For optimization:
1. "@data-agent optimize database performance"
2. "@frontend-agent improve component performance"
3. "@monitoring-observability-agent add metrics"

## Agent Collaboration

Agents work together for complex tasks:

**Example: Adding Authentication**
1. @security-agent - Design auth flow
2. @backend-agent - Implement auth API
3. @frontend-agent - Create login UI
4. @testing-agent - Write auth tests

## Files and Conventions

- Agent specs: .cursor/agents/*.md
- Project rules: .cursorrules
- Context: This file
- Prompts: composer-prompts.md

---

*Use agents to leverage specialized expertise for each aspect of your project!*
`;
}

/**
 * Generate Composer prompts
 */
function generateComposerPrompts(agents, template) {
  const prompts = [`# Cursor Composer Prompts

## Quick Start Prompts for ${template} Projects

Copy and paste these prompts into Cursor Composer for common tasks:

`];

  // Template-specific prompts
  const templatePrompts = {
    web: [
      '@frontend-agent Create a responsive navigation bar with mobile menu',
      '@design-agent Design a modern hero section with CTA buttons',
      '@frontend-agent Implement infinite scrolling for product list',
      '@testing-agent Write comprehensive tests for user authentication flow',
      '@accessibility-agent Audit and fix accessibility issues in forms',
      '@seo-marketing-agent Optimize pages for search engines'
    ],
    mobile: [
      '@mobile-agent Create onboarding screens with swipe navigation',
      '@mobile-agent Implement pull-to-refresh functionality',
      '@backend-agent Set up push notification service',
      '@mobile-agent Add offline data persistence',
      '@testing-agent Write E2E tests for critical user flows',
      '@design-agent Design consistent mobile UI patterns'
    ],
    fullstack: [
      '@backend-agent Create RESTful API with CRUD operations',
      '@frontend-agent Build admin dashboard with data tables',
      '@api-graphql-agent Convert REST endpoints to GraphQL',
      '@data-agent Optimize database queries for performance',
      '@devops-agent Set up CI/CD pipeline with automated testing',
      '@security-agent Implement role-based access control'
    ],
    backend: [
      '@backend-agent Design microservices architecture',
      '@api-graphql-agent Create GraphQL schema and resolvers',
      '@data-agent Design normalized database schema',
      '@docker-container-agent Containerize application',
      '@devops-agent Set up Kubernetes deployment',
      '@monitoring-observability-agent Add logging and monitoring'
    ]
  };

  const relevantPrompts = templatePrompts[template] || templatePrompts.web;

  prompts.push('### Common Tasks\n\n```');
  relevantPrompts.forEach(prompt => {
    if (agents.some(agent => prompt.includes(`@${agent}`))) {
      prompts.push(prompt);
    }
  });
  prompts.push('```\n\n');

  // Feature development prompts
  prompts.push(`## Feature Development

### Authentication System
\`\`\`
@security-agent Design secure authentication flow with JWT
@backend-agent Implement auth endpoints with refresh tokens
@frontend-agent Create login and signup forms with validation
@testing-agent Write auth integration tests
\`\`\`

### Real-time Features
\`\`\`
@websocket-realtime-agent Set up WebSocket server
@backend-agent Implement real-time message broadcasting
@frontend-agent Create live chat interface
@mobile-agent Add real-time sync to mobile app
\`\`\`

### Payment Integration
\`\`\`
@payment-agent Integrate Stripe payment processing
@security-agent Ensure PCI compliance
@backend-agent Create subscription management API
@frontend-agent Build checkout flow with payment forms
\`\`\`

`);

  // Debugging prompts
  prompts.push(`## Debugging & Optimization

### Performance Issues
\`\`\`
@monitoring-observability-agent Identify performance bottlenecks
@data-agent Analyze and optimize slow queries
@frontend-agent Implement code splitting and lazy loading
@testing-agent Create performance benchmarks
\`\`\`

### Bug Fixes
\`\`\`
@testing-agent Reproduce bug with failing test
@[relevant-agent] Fix the identified issue
@testing-agent Verify fix and prevent regression
\`\`\`

`);

  // Best practices prompts
  prompts.push(`## Best Practices

### Code Quality
\`\`\`
@testing-agent Increase test coverage to 80%
@security-agent Perform security audit
@documentation-agent Update API documentation
@devops-agent Set up code quality checks in CI
\`\`\`

### Refactoring
\`\`\`
@[relevant-agent] Refactor [component/module] for better maintainability
@testing-agent Ensure tests pass after refactoring
@documentation-agent Update documentation
\`\`\`

`);

  // Multi-agent workflows
  prompts.push(`## Multi-Agent Workflows

### Complete Feature (Example: User Profile)
\`\`\`
Step 1: @data-agent Design user profile database schema
Step 2: @backend-agent Create profile API endpoints
Step 3: @frontend-agent Build profile UI components
Step 4: @mobile-agent Implement mobile profile screens
Step 5: @testing-agent Write comprehensive tests
Step 6: @security-agent Review security implications
\`\`\`

### Migration Project
\`\`\`
Step 1: @data-agent Plan database migration strategy
Step 2: @database-migration-agent Create migration scripts
Step 3: @backend-agent Update API to support both versions
Step 4: @frontend-agent Migrate UI components gradually
Step 5: @testing-agent Ensure backward compatibility
Step 6: @devops-agent Deploy with zero downtime
\`\`\`

`);

  // Tips
  prompts.push(`## Tips for Using Agents

1. **Be Specific**: Instead of "fix bug", say "@testing-agent reproduce login bug then @frontend-agent fix validation issue"

2. **Chain Agents**: For complex tasks, involve multiple agents in sequence

3. **Context Matters**: Provide code snippets or file paths when asking for help

4. **Leverage Expertise**: Each agent has deep knowledge in their domain

5. **Iterate**: Start with one agent, then bring in others as needed

## Custom Prompts Template

\`\`\`
@[agent-name]
Task: [Specific task description]
Context: [Current state or problem]
Requirements: [What needs to be done]
Constraints: [Any limitations or preferences]
\`\`\`

---

*These prompts are optimized for ${template} projects with your selected agents.*
*Customize them based on your specific needs!*
`);

  return prompts.join('\n');
}

// Run setup
setup().catch(error => {
  console.error(chalk.red('❌ Error during setup:'), error);
  process.exit(1);
});