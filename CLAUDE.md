# VIBECODE STARTER - Claude Code Project Instructions

## 🚀 PROJECT INITIALIZATION

When starting a new project from this template, use one of these initialization commands:

### Quick Initialization Commands
```bash
# For specific project types:
"Initialize as React web app with Supabase"
"Initialize as React Native mobile app" 
"Initialize as Next.js full-stack app"
"Initialize as API-only backend with AWS"

# For auto-detection:
"Analyze and configure project"
"Load project context"

# For custom configuration:
"Configure project stack"
```

### Auto-Detection & Configuration
When you start working on this project, I will:
1. **Detect or ask** about your project type (Web/Mobile/API/Full-stack)
2. **Identify your tech stack** (React/Next.js/Vue, Supabase/Firebase/AWS, etc.)
3. **Load ONLY relevant agents** for your specific stack
4. **Ignore irrelevant agents** to reduce complexity

### Project Configuration Template
```yaml
# PROJECT CONFIGURATION (auto-detected or specified)
Project Type: [Web App | Mobile App | Desktop | API | CLI | Full-Stack]
Frontend: [React | Next.js | Vue | Angular | None]
Backend: [Supabase | Firebase | AWS | Custom API | None]  
Mobile: [React Native | Flutter | iOS Native | None]
Database: [PostgreSQL | MySQL | MongoDB | Firestore | DynamoDB]
Deployment: [Vercel | AWS | Firebase | Netlify | Custom]
Testing: [Jest | Vitest | Playwright | Cypress]
```

## 🤖 Automatic Sub-Agent Usage

This project includes 29 specialized Sub-Agents. Based on your project configuration, I will automatically use the appropriate agents:

## Agent Activation Rules

### Frontend Development
When working on UI, components, or frontend features:
- **Always use:** `docs/agents/frontend-agent.md`
- Technologies: React 18, TypeScript, Tailwind CSS, shadcn/ui
- Focus: Component development, responsive design, state management

### Backend Development
When working on APIs, database, or server-side logic:
- **Choose based on project:**
  - Supabase: `docs/agents/backend-agent.md`
  - Firebase: `docs/agents/firebase-backend-agent.md`
  - AWS: `docs/agents/aws-backend-agent.md`
- Focus: Database schema, API endpoints, authentication, real-time features

### Mobile Development
When working on mobile applications:
- **React Native:** `docs/agents/mobile-agent.md`
- **iOS Native:** `docs/agents/ios-swift-agent.md`
- **Flutter:** `docs/agents/flutter-agent.md`
- Focus: Cross-platform components, native integrations, performance

### Testing
When writing or running tests:
- **Always use:** `docs/agents/testing-agent.md`
- Technologies: Jest, React Testing Library, Playwright
- Focus: Unit tests, integration tests, E2E scenarios

### DevOps & Deployment
When setting up CI/CD or deployment:
- **Always use:** `docs/agents/devops-agent.md`
- Focus: GitHub Actions, Vercel/AWS deployment, Docker

### Security & Compliance
When implementing auth or handling sensitive data:
- **Always use:** `docs/agents/security-agent.md`
- Focus: Authentication, GDPR, security audits, data encryption

## Automatic Agent Selection

Based on file types and tasks, automatically use these agents:

| File Pattern | Agent to Use |
|-------------|--------------|
| `*.tsx`, `*.jsx`, `components/` | frontend-agent |
| `api/`, `*.sql`, `supabase/` | backend-agent |
| `*.test.*`, `__tests__/` | testing-agent |
| `.github/workflows/`, `Dockerfile` | devops-agent |
| `auth/`, `security/` | security-agent |
| Mobile app files | mobile-agent |

## Task-Based Agent Orchestration

### For Complex Features
When implementing full features (e.g., "Add user authentication"):
1. Read and apply `backend-agent.md` for API and database
2. Read and apply `frontend-agent.md` for UI components
3. Read and apply `testing-agent.md` for test coverage
4. Read and apply `security-agent.md` for security review

### For Performance Optimization
When optimizing performance:
1. Use `data-agent.md` for database optimization
2. Use `frontend-agent.md` for UI performance
3. Use `monitoring-observability-agent.md` for metrics

### For New Integrations
When adding third-party services:
1. Use appropriate backend agent for server integration
2. Use `api-graphql-agent.md` for API design
3. Use `documentation-agent.md` for API docs

## Specialized Agent Usage

### Real-time Features
- Use `websocket-realtime-agent.md` for WebSocket implementation
- Use `backend-agent.md` for database subscriptions

### Payment Processing
- Use `payment-agent.md` for Stripe/Vipps integration
- Use `security-agent.md` for PCI compliance

### Internationalization
- Use `localization-agent.md` for i18n setup
- Use `frontend-agent.md` for UI adaptation

### Email/Notifications
- Use `email-communication-agent.md` for transactional emails
- Use `backend-agent.md` for notification logic

## Working Instructions

1. **Always check for relevant agents** before starting any task
2. **Read the full agent specification** when working in that domain
3. **Follow the agent's standards** for code style and structure
4. **Use the agent's recommended tools** and libraries
5. **Apply the agent's best practices** and patterns

## Context Sharing

When working across multiple agents:
- Keep shared types in `src/types/`
- Document API contracts in `docs/api/`
- Update `docs/context/` with architectural decisions
- Ensure consistency between agent outputs

## Quality Assurance

Before completing any task:
1. Verify code follows the relevant agent's standards
2. Run tests as specified by testing-agent
3. Check security implications with security-agent guidelines
4. Ensure documentation per documentation-agent standards

## Example Workflow

```bash
# When user asks: "Create a user profile feature"

# Step 1: Automatically read and apply these agents:
- docs/agents/backend-agent.md (for database and API)
- docs/agents/frontend-agent.md (for UI components)
- docs/agents/mobile-agent.md (if mobile app exists)
- docs/agents/testing-agent.md (for test coverage)

# Step 2: Implement following each agent's guidelines

# Step 3: Validate against all agent standards
```

## Important Notes

- **Never skip agent specifications** - they contain critical project standards
- **Always use multiple agents** for complex features
- **Follow the orchestration patterns** in `docs/SUB_AGENT_WORKFLOW.md`
- **Reference agent specs in comments** when implementing their guidelines

## Quick Start by Project Type

### 🌐 Web Application
```bash
"Initialize as React web app with [Supabase/Firebase/AWS]"
```
**Active Agents:** frontend, backend, testing, security, devops, design

### 📱 Mobile Application  
```bash
"Initialize as [React Native/Flutter/iOS] mobile app"
```
**Active Agents:** mobile/flutter/ios-swift, backend, testing, security

### 🚀 Full-Stack Application
```bash
"Initialize as Next.js full-stack with [Supabase/Firebase]"
```
**Active Agents:** frontend, backend, api-graphql, testing, security, devops

### 🔧 API/Backend Only
```bash
"Initialize as API with [Node.js/Python/Go] and [PostgreSQL/MongoDB]"
```
**Active Agents:** backend, api-graphql, testing, security, database-migration

### 🖥️ Desktop Application
```bash
"Initialize as Electron desktop app"
```
**Active Agents:** frontend, testing, security, devops

## Project-Specific Configuration

When you see placeholders below, Claude Code will ask you to specify:

### Current Configuration
```yaml
# ACTIVE PROJECT CONFIGURATION
Project Type: [TO BE DETERMINED ON INIT]
Primary Backend: [Supabase/Firebase/AWS/Custom]
Mobile Platform: [React Native/Flutter/iOS/None]
Deployment Target: [Vercel/AWS/Firebase/Netlify]
Active Agents: [Will be set based on project type]
```

## Smart Agent Loading

### Conditional Agent Activation
Based on your project configuration, agents are automatically activated or deactivated:

| If Project Has | Active Agents | Inactive Agents |
|---------------|---------------|-----------------|
| React Native | mobile-agent | flutter-agent, ios-swift-agent |
| Flutter | flutter-agent | mobile-agent, ios-swift-agent |
| Supabase | backend-agent | firebase-backend, aws-backend |
| No Mobile | - | All mobile agents |
| API Only | backend, api-graphql | frontend, design |

### Example Initialization Flow
```bash
User: "Initialize project"
Claude: "What type of project? (Web/Mobile/API/Full-stack)"
User: "Mobile app"
Claude: "Which platform? (React Native/Flutter/iOS)"
User: "React Native"
Claude: "Backend service? (Supabase/Firebase/AWS/None)"
User: "Supabase"
Claude: ✅ Configured! Loading: mobile-agent, backend-agent, testing-agent
        ❌ Skipping: flutter-agent, ios-swift-agent, firebase-backend-agent
```

---

*This intelligent initialization ensures Claude Code only uses relevant Sub-Agents for your specific project, reducing complexity and improving focus!*