# Sub-Agent Workflow Guide

## Overview
This guide explains how to effectively use Claude Code's Sub-Agent feature with Vibecode Starter projects. Sub-Agents enable parallel task execution and specialized expertise for different aspects of your development workflow.

## Quick Start

### 1. Single Agent for Specialized Task
```bash
# Use a specific agent for a focused task
claude --agent docs/agents/frontend-agent.md "Create a responsive dashboard layout with charts"
```

### 2. Multiple Agents in Parallel
```bash
# Main command delegates to multiple agents
claude "Build a complete user authentication system"
# This automatically engages:
# - backend-agent: Database, API, auth logic
# - frontend-agent: Login/signup UI
# - testing-agent: Test coverage
# - security-agent: Security audit
```

### 3. Agent Orchestration
```bash
# Orchestrate complex features
claude --orchestrate "Implement real-time chat feature with typing indicators"
# Coordinates:
# - backend-agent: WebSocket setup, message storage
# - frontend-agent: Chat UI, typing indicators
# - mobile-agent: Mobile chat interface
# - testing-agent: Real-time test scenarios
```

## Workflow Patterns

### Pattern 1: Feature Development
```yaml
Task: "Add shopping cart functionality"
Workflow:
  1. Planning Phase:
     - Main agent creates feature specification
     - Identifies required Sub-Agents
  
  2. Parallel Development:
     - backend-agent: Cart API, database schema
     - frontend-agent: Cart UI components
     - mobile-agent: Mobile cart views
     - testing-agent: Test scenarios
  
  3. Integration:
     - Main agent coordinates integration
     - Ensures type consistency
     - Validates cross-agent work
  
  4. Quality Assurance:
     - testing-agent: Full test suite
     - security-agent: Security review
     - performance-agent: Performance audit
```

### Pattern 2: Bug Fix
```yaml
Task: "Fix performance issue in product search"
Workflow:
  1. Investigation:
     - data-agent: Analyze query performance
     - frontend-agent: Check rendering issues
  
  2. Implementation:
     - backend-agent: Optimize database queries
     - frontend-agent: Implement virtualization
  
  3. Verification:
     - testing-agent: Performance tests
     - devops-agent: Monitor improvements
```

### Pattern 3: Refactoring
```yaml
Task: "Migrate from REST to GraphQL"
Workflow:
  1. Planning:
     - backend-agent: Design GraphQL schema
     - frontend-agent: Plan query migrations
  
  2. Implementation:
     - backend-agent: Implement resolvers
     - frontend-agent: Update API calls
     - mobile-agent: Update mobile queries
  
  3. Testing:
     - testing-agent: Update test suites
     - integration verification
```

## Agent Selection Guide

### When to Use Each Agent

#### Frontend Agent
- UI component development
- Responsive design implementation
- State management setup
- Form handling
- Animation and interactions

#### Backend Agent
- Database schema design
- API endpoint creation
- Authentication setup
- Data validation
- Performance optimization

#### Mobile Agent
- React Native components
- Platform-specific features
- Native module integration
- Mobile performance
- App store preparation

#### Testing Agent
- Test suite creation
- Coverage analysis
- Performance testing
- Accessibility testing
- E2E scenarios

#### Security Agent
- Security audits
- Authentication flows
- Data encryption
- GDPR compliance
- Vulnerability scanning

#### DevOps Agent
- CI/CD setup
- Deployment configuration
- Monitoring setup
- Infrastructure as code
- Environment management

#### Design Agent
- Design system maintenance
- Component library
- Figma integration
- Accessibility compliance
- Brand consistency

#### Data Agent
- Database optimization
- Migration scripts
- Analytics implementation
- Data modeling
- Backup strategies

## Context Sharing

### Shared Resources
```
project/
├── docs/
│   ├── context/          # Shared context between agents
│   │   ├── api-spec.md   # API specifications
│   │   ├── types.ts      # Shared TypeScript types
│   │   └── decisions.md  # Architecture decisions
│   └── agents/           # Agent specifications
├── src/
│   └── types/           # Shared type definitions
└── tests/
    └── specs/           # Test specifications
```

### Context Files

#### API Specification (`docs/context/api-spec.md`)
```markdown
# API Specification

## Endpoints

### GET /api/users/:id
- **Input:** User ID (UUID)
- **Output:** User object
- **Auth:** Required (JWT)
- **Agent:** backend-agent
```

#### Shared Types (`docs/context/types.ts`)
```typescript
// Shared between all agents
export interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

## Best Practices

### 1. Task Decomposition
- Break complex tasks into agent-specific subtasks
- Identify dependencies between agents
- Plan parallel vs sequential execution

### 2. Clear Communication
- Provide complete context to each agent
- Reference shared specifications
- Document inter-agent dependencies

### 3. Quality Gates
- Testing agent reviews all code
- Security agent audits sensitive features
- Performance agent validates optimizations

### 4. Incremental Development
- Start with core functionality
- Add agents as complexity grows
- Maintain working state between iterations

## Example Scenarios

### Scenario 1: New Feature
```bash
# Step 1: Planning
claude "Plan e-commerce checkout flow with payment integration"

# Step 2: Backend development
claude --agent docs/agents/backend-agent.md "Implement payment API with Stripe"

# Step 3: Frontend development
claude --agent docs/agents/frontend-agent.md "Create checkout UI with form validation"

# Step 4: Testing
claude --agent docs/agents/testing-agent.md "Write E2E tests for checkout flow"

# Step 5: Security audit
claude --agent docs/agents/security-agent.md "Audit payment security implementation"
```

### Scenario 2: Performance Optimization
```bash
# Analyze current performance
claude --agent docs/agents/data-agent.md "Analyze slow queries in user dashboard"

# Optimize backend
claude --agent docs/agents/backend-agent.md "Optimize dashboard queries with indexing"

# Optimize frontend
claude --agent docs/agents/frontend-agent.md "Implement lazy loading and virtualization"

# Verify improvements
claude --agent docs/agents/testing-agent.md "Run performance benchmarks"
```

### Scenario 3: Mobile App Addition
```bash
# Orchestrate mobile app creation
claude --orchestrate "Create React Native app for existing web platform"
# Automatically coordinates:
# - mobile-agent: App setup and components
# - backend-agent: Mobile-specific APIs
# - testing-agent: Mobile test suite
# - devops-agent: Mobile CI/CD
```

## Monitoring and Feedback

### Agent Performance Metrics
- Task completion time
- Code quality scores
- Test coverage achieved
- Bugs introduced/fixed
- Performance improvements

### Continuous Improvement
- Review agent interactions
- Optimize task distribution
- Update agent specifications
- Refine workflow patterns

## Troubleshooting

### Common Issues

#### Issue: Agents producing conflicting code
**Solution:** Ensure shared type definitions and clear API contracts

#### Issue: Slow task completion
**Solution:** Increase parallelization, optimize agent selection

#### Issue: Missing context between agents
**Solution:** Update shared context files, improve documentation

#### Issue: Inconsistent code style
**Solution:** Enforce ESLint/Prettier across all agents

## Advanced Techniques

### Dynamic Agent Selection
```bash
# Let Claude choose the best agents
claude --auto-agents "Optimize application for mobile devices"
```

### Agent Chaining
```bash
# Chain agent outputs
claude --chain "backend-agent > frontend-agent > testing-agent" "Update user API"
```

### Conditional Workflows
```bash
# Use agents based on conditions
claude --workflow docs/workflows/feature.yaml "Add new feature"
```

## Integration with Cursor

When using Cursor IDE:
1. Reference agent specs in your prompts
2. Use `.cursorrules` for consistent behavior
3. Leverage Cursor's context awareness
4. Combine with MCP servers for enhanced capabilities

## Conclusion

Sub-Agents transform complex development tasks into manageable, parallel workflows. By leveraging specialized agents, you can:
- Increase development speed
- Improve code quality
- Ensure comprehensive testing
- Maintain consistency
- Scale your development process

Start with simple agent usage and gradually adopt more complex orchestration patterns as your project grows.
