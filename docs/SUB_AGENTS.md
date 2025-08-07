# Vibecode Sub-Agents Configuration

## Overview
This document defines specialized Sub-Agents for common development tasks in Vibecode projects. Each Sub-Agent is optimized for specific responsibilities, enabling efficient parallel work and specialized expertise.

## Available Sub-Agents

### 1. Frontend Agent (`frontend-agent.md`)
**Specialization:** React, TypeScript, UI/UX
**Responsibilities:**
- Component development with React 18 and TypeScript
- Tailwind CSS and shadcn/ui implementation
- Form handling with react-hook-form
- Responsive design and accessibility
- Performance optimization (Core Web Vitals)

### 2. Backend Agent (Choose One)

#### 2a. Supabase Backend (`backend-agent.md`)
**Specialization:** Supabase, PostgreSQL, APIs
**Responsibilities:**
- PostgreSQL schema design and migrations
- Supabase Edge Functions development
- Row Level Security (RLS) policies
- REST/GraphQL API endpoints
- Real-time subscriptions with PostgreSQL

#### 2b. Firebase Backend (`firebase-backend-agent.md`)
**Specialization:** Firebase, Firestore, Cloud Functions
**Responsibilities:**
- Firestore NoSQL data modeling
- Cloud Functions development
- Security rules configuration
- Real-time listeners and offline sync
- Firebase service integrations

**Selection Guide:** See `docs/BACKEND_SELECTION_GUIDE.md` for choosing between Supabase and Firebase

### 2c. AWS Backend (`aws-backend-agent.md`)
**Specialization:** AWS Services, Lambda, DynamoDB
**Responsibilities:**
- Serverless architecture with Lambda
- DynamoDB NoSQL and RDS SQL databases
- API Gateway and AppSync GraphQL
- CloudFormation/CDK infrastructure
- S3, CloudFront, and other AWS services

### 3. Mobile Agents (Choose Based on Platform)

#### 3a. React Native Agent (`mobile-agent.md`)
**Specialization:** React Native, Expo, Cross-platform
**Responsibilities:**
- React Native component development
- Expo SDK integration
- Native module bridging
- Platform-specific implementations
- OTA update management

#### 3b. iOS/Swift Agent (`ios-swift-agent.md`)
**Specialization:** Native iOS, Swift, SwiftUI
**Responsibilities:**
- SwiftUI and UIKit development
- Core Data and SwiftData
- Apple ecosystem integration
- App Store optimization
- Human Interface Guidelines compliance

#### 3c. Flutter Agent (`flutter-agent.md`)
**Specialization:** Flutter, Dart, Cross-platform
**Responsibilities:**
- Flutter widget development
- Material Design 3 and Cupertino
- State management (Riverpod/Bloc)
- Platform channel integration
- Custom painters and animations

### 4. Testing Agent (`testing-agent.md`)
**Specialization:** Jest, Playwright, Testing strategies
**Responsibilities:**
- Unit test creation with Jest
- E2E test scenarios with Playwright
- Test coverage analysis
- Performance testing
- Accessibility testing

### 5. DevOps Agent (`devops-agent.md`)
**Specialization:** CI/CD, Deployment, Infrastructure
**Responsibilities:**
- GitHub Actions workflow setup
- Vercel/AWS deployment configuration
- Environment variable management
- Docker containerization
- Monitoring and logging setup

### 6. Security Agent (`security-agent.md`)
**Specialization:** Security, GDPR, Authentication
**Responsibilities:**
- Security audit and vulnerability scanning
- Authentication flow implementation
- GDPR compliance checks
- API security hardening
- Secret management

### 7. Design System Agent (`design-agent.md`)
**Specialization:** UI/UX, Figma, Design tokens
**Responsibilities:**
- Design token management
- Component library maintenance
- Figma to code synchronization
- Accessibility compliance
- Animation and interaction design

### 8. Data Agent (`data-agent.md`)
**Specialization:** Database, Analytics, Performance
**Responsibilities:**
- Database optimization
- Query performance tuning
- Analytics implementation
- Data migration scripts
- Backup strategies

### 9. CLI Agent (`cli-agent.md`)
**Specialization:** Terminal Operations, Automation, DevOps
**Responsibilities:**
- CLI tool development
- Shell scripting (Bash/Zsh)
- Task automation with Make/npm scripts
- System administration
- Terminal-based workflows

## Sub-Agent Orchestration

### Parallel Task Examples

#### Feature Development
```yaml
task: "Add user profile feature"
agents:
  - frontend-agent: Create profile components
  - backend-agent: Setup database tables and API
  - mobile-agent: Implement mobile views
  - testing-agent: Write test scenarios
```

#### Performance Optimization
```yaml
task: "Optimize application performance"
agents:
  - frontend-agent: Implement lazy loading
  - backend-agent: Optimize database queries
  - devops-agent: Setup CDN and caching
  - data-agent: Analyze performance metrics
```

### Communication Protocol

Sub-Agents communicate through:
1. **Shared context files** in `docs/context/`
2. **Type definitions** in `src/types/`
3. **API contracts** in `docs/api/`
4. **Test specifications** in `tests/specs/`

## Usage with Claude Code

### Creating a Sub-Agent
```bash
# Use the Sub-Agent template
claude --agent docs/agents/[agent-name].md "Your task here"
```

### Orchestrating Multiple Agents
```bash
# Main orchestrator delegates to Sub-Agents
claude --orchestrate "Build user authentication system"
# This will automatically delegate to:
# - backend-agent for auth logic
# - frontend-agent for UI
# - security-agent for validation
# - testing-agent for test coverage
```

### Agent Context Sharing
```bash
# Share context between agents
claude --context=shared "Continue from previous agent's work"
```

## Best Practices

### 1. Agent Selection
- Choose the most specialized agent for each task
- Use multiple agents for complex features
- Let agents work in parallel when possible

### 2. Context Management
- Keep shared types in `src/types/`
- Document API contracts clearly
- Update `docs/context/` with decisions

### 3. Quality Assurance
- Testing Agent reviews all code
- Security Agent audits sensitive features
- Design Agent ensures UI consistency

### 4. Communication
- Use clear task descriptions
- Provide necessary context upfront
- Document inter-agent dependencies

## Agent Templates

Each agent specification follows this structure:

```markdown
# [Agent Name] Sub-Agent

## Role
[Specific expertise and focus area]

## Technology Stack
[Relevant technologies and tools]

## Responsibilities
[List of specific tasks]

## Standards
[Quality and code standards]

## Communication
[How this agent interfaces with others]

## Context Requirements
[What information this agent needs]
```

## Integration with Cursor

When using Cursor IDE, Sub-Agents can be invoked through:
1. Custom .cursorrules for each agent type
2. Agent-specific prompts in the chat
3. Workspace-specific agent configurations

## Future Enhancements

- [ ] Automated agent selection based on file types
- [ ] Agent performance metrics tracking
- [ ] Cross-agent code review system
- [ ] Automated context synchronization
- [ ] Agent capability discovery
