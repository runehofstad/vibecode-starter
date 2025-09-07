# 🚀 Sub-Agent Usage Examples

## Quick Command Reference

### 1. Single Agent Commands

#### Frontend Development
```bash
# Create a new component
claude "Use docs/agents/frontend-agent.md to create a responsive dashboard with charts"

# Fix UI issues
claude "Following frontend-agent.md, fix the mobile layout issues in the header"

# Add animations
claude "Apply frontend-agent.md standards to add smooth transitions to the modal"
```

#### Backend Development
```bash
# Create API endpoint
claude "Use docs/agents/backend-agent.md to create a REST API for user profiles"

# Database optimization
claude "Following backend-agent.md, optimize the slow queries in the dashboard"

# Add authentication
claude "Apply backend-agent.md to implement JWT authentication"
```

#### Testing
```bash
# Write tests
claude "Use docs/agents/testing-agent.md to create unit tests for the UserService"

# E2E testing
claude "Following testing-agent.md, write Playwright tests for the checkout flow"
```

### 2. Multi-Agent Orchestration

#### Complete Feature Implementation
```bash
# Shopping cart feature (multiple agents)
claude "Read and apply frontend-agent.md, backend-agent.md, and testing-agent.md to implement a complete shopping cart feature with add/remove items, persistence, and full test coverage"
```

#### Security-First Development
```bash
# Payment integration with security
claude "Use payment-agent.md and security-agent.md together to implement Stripe payment processing with PCI compliance"
```

#### Mobile App Development
```bash
# Cross-platform mobile feature
claude "Apply mobile-agent.md, backend-agent.md, and testing-agent.md to create a mobile chat interface with real-time updates"
```

### 3. Specialized Agent Tasks

#### Real-time Features
```bash
# WebSocket implementation
claude "Use websocket-realtime-agent.md to add live notifications to the dashboard"

# Collaborative editing
claude "Apply websocket-realtime-agent.md and frontend-agent.md for real-time collaborative document editing"
```

#### Internationalization
```bash
# Multi-language support
claude "Use localization-agent.md to add Norwegian and English language support"
```

#### DevOps & Deployment
```bash
# CI/CD setup
claude "Apply devops-agent.md to create GitHub Actions workflow for automated testing and deployment"

# Docker configuration
claude "Use docker-container-agent.md to containerize the application"
```

### 4. Performance & Optimization

#### Database Performance
```bash
# Query optimization
claude "Use data-agent.md and backend-agent.md to analyze and optimize slow database queries"
```

#### Frontend Performance
```bash
# Core Web Vitals
claude "Apply frontend-agent.md guidelines to improve Lighthouse scores and Core Web Vitals"
```

#### Monitoring Setup
```bash
# Observability
claude "Use monitoring-observability-agent.md to set up application monitoring with Prometheus and Grafana"
```

### 5. Complex Workflows

#### Migration Projects
```bash
# Database migration
claude "Use database-migration-agent.md and backend-agent.md to migrate from Firebase to Supabase"
```

#### Refactoring
```bash
# Code modernization
claude "Apply frontend-agent.md, testing-agent.md to refactor class components to functional components with hooks"
```

#### Accessibility Improvements
```bash
# WCAG compliance
claude "Use accessibility-agent.md and frontend-agent.md to ensure WCAG 2.1 AA compliance"
```

## Interactive Mode Examples

When in interactive Claude Code session:

### Explicit Agent Reference
```
You: Create a user authentication system

Better: Read docs/agents/backend-agent.md for auth logic, 
docs/agents/frontend-agent.md for login UI, and 
docs/agents/security-agent.md for security best practices, 
then implement a complete authentication system
```

### Step-by-Step with Agents
```
You: Let's build a dashboard

Better: 
1. First, review docs/agents/frontend-agent.md for component standards
2. Check docs/agents/backend-agent.md for API requirements
3. Build the dashboard following both specifications
```

### Agent-Driven Development
```
You: Fix the performance issues

Better: 
1. Use docs/agents/data-agent.md to analyze database performance
2. Apply docs/agents/frontend-agent.md for UI optimizations
3. Follow docs/agents/monitoring-observability-agent.md to add metrics
```

## CLI Flags for Agents

### Direct Agent Usage
```bash
# Specific agent with task
claude --agent docs/agents/frontend-agent.md "Create responsive navigation"

# Multiple agents (conceptual - requires orchestration)
claude --orchestrate "Build complete feature using all relevant agents"
```

### With Context Sharing
```bash
# Continue from previous agent work
claude --context=shared "Continue the authentication implementation from backend-agent"
```

## Project Setup Commands

### Initial Project Configuration
```bash
# 1. Clone the starter
git clone https://github.com/your-username/your-project.git
cd your-project

# 2. Install dependencies
npm install

# 3. Start with agent guidance
claude "Review all agents in docs/agents/ and set up the project structure according to their standards"
```

### Feature Development Flow
```bash
# 1. Plan with agents
claude "Review relevant agents for user profile feature and create implementation plan"

# 2. Implement backend
claude "Use backend-agent.md to implement user profile API"

# 3. Implement frontend
claude "Use frontend-agent.md to create profile UI components"

# 4. Add tests
claude "Use testing-agent.md to write comprehensive tests"

# 5. Security review
claude "Use security-agent.md to audit the implementation"
```

## Tips for Effective Agent Usage

1. **Always be specific** about which agent to use
2. **Reference multiple agents** for complex tasks
3. **Read agent specs first** before implementation
4. **Follow agent standards** exactly
5. **Use agents for code review** after implementation

## Common Patterns

### Pattern: Feature Development
```bash
claude "For the [FEATURE NAME] feature:
1. Use backend-agent.md for API design
2. Use frontend-agent.md for UI implementation  
3. Use testing-agent.md for test coverage
4. Use security-agent.md for security review"
```

### Pattern: Bug Fix
```bash
claude "To fix [BUG DESCRIPTION]:
1. Analyze using relevant agent (frontend/backend/mobile)
2. Implement fix following agent standards
3. Add tests per testing-agent.md"
```

### Pattern: Performance Optimization
```bash
claude "To optimize [AREA]:
1. Use data-agent.md for analysis
2. Apply optimizations per relevant agent
3. Add monitoring per monitoring-observability-agent.md"
```

## Remember

- Agents are **specifications**, not automatic processes
- You must **explicitly reference** them
- They work best when **used together**
- Always **follow their standards**
- The CLAUDE.md file helps with **automatic recognition**

---

*These examples show how to properly activate and use the Sub-Agents in your Vibecode Starter project. The key is being explicit about which agents to use for each task.*