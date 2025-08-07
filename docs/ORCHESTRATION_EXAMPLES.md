# Sub-Agent Orchestration Examples

## Overview
This document provides practical examples of how to orchestrate multiple Sub-Agents for common development scenarios in Vibecode projects.

## Example 1: E-Commerce Platform

### Scenario
Building a complete e-commerce platform with product catalog, shopping cart, checkout, and admin panel.

### Orchestration Plan
```yaml
project: "E-Commerce Platform"
phases:
  - name: "Foundation"
    parallel: true
    agents:
      - backend-agent:
          task: "Design database schema for products, orders, users"
          output: "supabase/migrations/001_initial_schema.sql"
      - design-agent:
          task: "Create design system and component library"
          output: "docs/design-system.md"
      - devops-agent:
          task: "Setup CI/CD pipeline and environments"
          output: ".github/workflows/"

  - name: "Core Features"
    parallel: true
    agents:
      - backend-agent:
          task: "Implement product API and search"
          dependencies: ["Foundation.backend-agent"]
      - frontend-agent:
          task: "Build product catalog UI"
          dependencies: ["Foundation.design-agent"]
      - mobile-agent:
          task: "Create mobile product browsing"
          dependencies: ["Foundation.design-agent"]

  - name: "Shopping Cart"
    parallel: true
    agents:
      - backend-agent:
          task: "Cart persistence and session management"
      - frontend-agent:
          task: "Cart UI with real-time updates"
      - testing-agent:
          task: "Cart functionality test suite"

  - name: "Checkout & Payment"
    parallel: false  # Sequential for security
    agents:
      - security-agent:
          task: "Design secure payment flow"
      - backend-agent:
          task: "Implement Stripe integration"
          dependencies: ["security-agent"]
      - frontend-agent:
          task: "Build checkout UI"
          dependencies: ["backend-agent"]
      - testing-agent:
          task: "Payment flow E2E tests"
          dependencies: ["frontend-agent"]

  - name: "Quality Assurance"
    parallel: true
    agents:
      - testing-agent:
          task: "Full E2E test suite"
      - security-agent:
          task: "Security audit and penetration testing"
      - data-agent:
          task: "Performance optimization and analytics"
```

### Command Execution
```bash
# Start the orchestration
claude --orchestrate-file docs/orchestration/ecommerce.yaml

# Or use direct command
claude "Build e-commerce platform with product catalog, cart, and checkout"
```

## Example 2: Real-Time Chat Application

### Scenario
Creating a Slack-like chat application with channels, direct messages, file sharing, and notifications.

### Orchestration Plan
```yaml
project: "Real-Time Chat"
agents:
  backend:
    - "Setup Supabase Realtime for WebSocket connections"
    - "Create message persistence and history"
    - "Implement file upload with virus scanning"
    - "Build notification system with push support"
  
  frontend:
    - "Create chat UI with message threads"
    - "Implement typing indicators and presence"
    - "Build emoji picker and reactions"
    - "Add file preview and download"
  
  mobile:
    - "React Native chat interface"
    - "Push notification handling"
    - "Offline message queue"
    - "Background message sync"
  
  testing:
    - "WebSocket connection tests"
    - "Message delivery guarantees"
    - "Load testing with 1000+ concurrent users"
    - "Offline/online transition tests"
```

### Parallel Execution Example
```bash
# Phase 1: Infrastructure
claude --agents backend,devops "Setup real-time infrastructure and database"

# Phase 2: Core Features (parallel)
claude --parallel \
  --agent backend "Implement message API and real-time subscriptions" \
  --agent frontend "Build chat interface with channels" \
  --agent mobile "Create mobile chat views"

# Phase 3: Advanced Features
claude --orchestrate "Add file sharing, reactions, and notifications to chat"
```

## Example 3: Dashboard Analytics System

### Scenario
Building a comprehensive analytics dashboard with real-time metrics, custom reports, and data visualization.

### Agent Task Distribution
```javascript
// orchestration.config.js
export const analyticsProject = {
  agents: {
    data: {
      priority: 1,
      tasks: [
        "Design data warehouse schema",
        "Create ETL pipelines",
        "Implement data aggregation jobs",
        "Setup real-time data streams"
      ]
    },
    backend: {
      priority: 2,
      tasks: [
        "Build analytics API endpoints",
        "Implement caching layer",
        "Create report generation service",
        "Setup WebSocket for live updates"
      ]
    },
    frontend: {
      priority: 2,
      tasks: [
        "Create chart components (line, bar, pie)",
        "Build dashboard layout system",
        "Implement date range selectors",
        "Add export functionality"
      ]
    },
    testing: {
      priority: 3,
      tasks: [
        "Test data accuracy",
        "Verify real-time updates",
        "Load test with large datasets",
        "Cross-browser compatibility"
      ]
    }
  }
};
```

## Example 4: Social Media Features

### Scenario
Adding social features to an existing application: user profiles, posts, comments, likes, and follow system.

### Step-by-Step Orchestration
```bash
# Step 1: Database and API
claude --agent backend-agent "
  Create social media database schema:
  - User profiles with avatars
  - Posts with media attachments
  - Comments with threading
  - Likes and follow relationships
  - Activity feed generation
"

# Step 2: Frontend Components (parallel)
claude --parallel-agents "
  frontend: Create post composer with media upload
  frontend: Build infinite scroll feed
  frontend: Implement comment threads
  mobile: Create mobile post viewer
"

# Step 3: Real-time Features
claude --orchestrate "
  Add real-time updates for:
  - New posts in feed
  - Live comment count
  - Instant like animations
  - Online presence indicators
"

# Step 4: Testing & Security
claude --agents testing,security "
  Test and secure social features:
  - Privacy settings
  - Content moderation
  - Rate limiting
  - GDPR compliance
"
```

## Example 5: Migration Project

### Scenario
Migrating a legacy application from REST to GraphQL with zero downtime.

### Phased Migration Plan
```yaml
migration:
  phase1:
    name: "Parallel API Development"
    agents:
      - backend: "Create GraphQL schema alongside REST"
      - testing: "Build compatibility test suite"
    duration: "1 week"
  
  phase2:
    name: "Frontend Migration"
    strategy: "feature-flag"
    agents:
      - frontend: "Update components to use GraphQL"
      - mobile: "Migrate mobile API calls"
      - testing: "A/B test both implementations"
    duration: "2 weeks"
  
  phase3:
    name: "Optimization"
    agents:
      - backend: "Remove REST endpoints"
      - data: "Optimize GraphQL resolvers"
      - devops: "Update monitoring and caching"
    duration: "1 week"
```

## Example 6: Performance Optimization Sprint

### Scenario
Improving application performance to meet Core Web Vitals targets.

### Coordinated Optimization
```bash
# Analyze current performance
claude --agents data,testing "
  Analyze performance bottlenecks:
  - Run Lighthouse audits
  - Profile database queries
  - Measure API response times
  - Check bundle sizes
"

# Implement optimizations (parallel)
claude --orchestrate "
  frontend-agent: 
    - Implement code splitting
    - Add lazy loading for images
    - Optimize bundle with tree shaking
    - Use React.memo for expensive components
  
  backend-agent:
    - Add database indexes
    - Implement query caching
    - Optimize N+1 queries
    - Add CDN for static assets
  
  devops-agent:
    - Setup edge caching
    - Configure compression
    - Implement service workers
    - Add performance monitoring
"

# Verify improvements
claude --agent testing-agent "
  Verify performance improvements:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
  - Time to Interactive < 3.8s
"
```

## Example 7: Accessibility Compliance

### Scenario
Ensuring WCAG 2.1 AA compliance across the entire application.

### Accessibility Audit & Fix
```yaml
accessibility_project:
  audit:
    agents: [testing, design]
    tasks:
      - "Run automated accessibility scans"
      - "Manual keyboard navigation testing"
      - "Screen reader compatibility check"
      - "Color contrast analysis"
  
  implementation:
    agents: [frontend, mobile]
    tasks:
      - "Add ARIA labels and roles"
      - "Implement focus management"
      - "Create skip navigation links"
      - "Ensure form accessibility"
  
  validation:
    agents: [testing]
    tasks:
      - "Verify with multiple screen readers"
      - "Test with keyboard only"
      - "Validate against WCAG criteria"
      - "Generate compliance report"
```

## Best Practices for Orchestration

### 1. Task Dependencies
Always specify dependencies between agent tasks:
```yaml
frontend_task:
  depends_on: ["backend.api_complete", "design.mockups_ready"]
```

### 2. Parallel vs Sequential
Use parallel execution when tasks are independent:
```bash
# Good for parallel
claude --parallel frontend:UI backend:API testing:Setup

# Needs sequential
claude --sequential security:Audit backend:FixVulnerabilities testing:Verify
```

### 3. Context Sharing
Ensure agents share context through documentation:
```
docs/context/
├── api-contracts.md      # Backend → Frontend
├── design-tokens.json    # Design → Frontend/Mobile
├── test-scenarios.md     # All → Testing
└── security-rules.md     # Security → All
```

### 4. Progress Tracking
Monitor agent progress with clear milestones:
```bash
claude --track-progress "Show status of all active agents"
```

### 5. Error Handling
Plan for agent failures:
```yaml
on_failure:
  frontend_agent: 
    retry: 2
    fallback: "manual_intervention"
  backend_agent:
    retry: 3
    rollback: true
```

## Orchestration Commands Reference

### Basic Commands
```bash
# Single agent
claude --agent [agent-spec] "[task]"

# Multiple agents in parallel
claude --parallel-agents "[agent1:task1] [agent2:task2]"

# Sequential execution
claude --sequential "[task1]" "[task2]" "[task3]"

# Full orchestration
claude --orchestrate "[complex project description]"
```

### Advanced Commands
```bash
# Use orchestration file
claude --orchestrate-file path/to/orchestration.yaml

# With context sharing
claude --shared-context path/to/context/ --orchestrate "[task]"

# Conditional execution
claude --if-success "agent1" --then "agent2" --else "agent3"

# Progress monitoring
claude --monitor --orchestration-id abc123
```

## Troubleshooting

### Common Issues

1. **Agent Conflicts**: Agents modifying same files
   - Solution: Use proper git branching or sequential execution

2. **Context Loss**: Agents not aware of others' work
   - Solution: Maintain shared context documents

3. **Performance**: Too many parallel agents
   - Solution: Limit parallel execution based on system resources

4. **Dependency Chains**: Complex interdependencies
   - Solution: Break into smaller, manageable phases

## Conclusion

Effective orchestration of Sub-Agents can dramatically improve development speed and quality. Start with simple parallel tasks and gradually build more complex orchestration patterns as you become comfortable with the system.
