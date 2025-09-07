# Project Configuration

This file defines your project's technology stack and determines which Sub-Agents are active.

## Current Configuration

```yaml
# PROJECT CONFIGURATION
# Update these values to match your project

project:
  name: "My Project"
  type: "TO_BE_DETERMINED" # Options: web_app | mobile_app | full_stack | api | desktop | cli
  description: "Project description"

frontend:
  framework: "TO_BE_DETERMINED" # Options: react | nextjs | vue | angular | none
  ui_library: "tailwind" # Options: tailwind | mui | antd | chakra | custom
  state_management: "TO_BE_DETERMINED" # Options: redux | zustand | context | mobx | none
  
backend:
  provider: "TO_BE_DETERMINED" # Options: supabase | firebase | aws | custom | none
  language: "typescript" # Options: typescript | javascript | python | go | rust
  framework: "TO_BE_DETERMINED" # Options: express | fastify | nestjs | fastapi | gin
  
mobile:
  platform: "none" # Options: react_native | flutter | ios_native | android_native | none
  target_os: [] # Options: [ios, android] or [ios] or [android]
  
database:
  type: "TO_BE_DETERMINED" # Options: postgresql | mysql | mongodb | firestore | dynamodb | sqlite
  orm: "TO_BE_DETERMINED" # Options: prisma | typeorm | sequelize | mongoose | none
  
deployment:
  platform: "TO_BE_DETERMINED" # Options: vercel | aws | firebase | netlify | railway | render
  ci_cd: "github_actions" # Options: github_actions | gitlab_ci | circle_ci | jenkins
  containerization: false # Options: true (Docker) | false
  
testing:
  unit: "jest" # Options: jest | vitest | mocha | pytest
  e2e: "playwright" # Options: playwright | cypress | selenium | puppeteer
  coverage_threshold: 80 # Minimum coverage percentage
  
features:
  authentication: false # Will activate security-agent
  payments: false # Will activate payment-agent  
  realtime: false # Will activate websocket-realtime-agent
  email: false # Will activate email-communication-agent
  i18n: false # Will activate localization-agent
  pwa: false # Will activate pwa-offline-agent
  analytics: false # Will activate monitoring-observability-agent
```

## Active Sub-Agents

Based on the configuration above, these agents will be automatically activated:

### Core Agents (Always Active)
- ✅ `testing-agent` - Test coverage and quality
- ✅ `documentation-agent` - Documentation standards
- ✅ `git-github-agent` - Version control

### Conditional Agents (Based on Configuration)

| Configuration | Activated Agents |
|--------------|-----------------|
| `project.type = web_app` | frontend-agent, design-agent |
| `project.type = mobile_app` | mobile-agent OR flutter-agent OR ios-swift-agent |
| `project.type = full_stack` | frontend-agent, backend-agent, api-graphql-agent |
| `project.type = api` | backend-agent, api-graphql-agent |
| `backend.provider = supabase` | backend-agent (NOT firebase/aws agents) |
| `backend.provider = firebase` | firebase-backend-agent (NOT supabase/aws agents) |
| `backend.provider = aws` | aws-backend-agent (NOT supabase/firebase agents) |
| `mobile.platform = react_native` | mobile-agent (NOT flutter/ios agents) |
| `mobile.platform = flutter` | flutter-agent (NOT react-native/ios agents) |
| `mobile.platform = ios_native` | ios-swift-agent (NOT react-native/flutter agents) |
| `deployment.platform = *` | devops-agent |
| `deployment.containerization = true` | docker-container-agent |
| `features.authentication = true` | security-agent |
| `features.payments = true` | payment-agent |
| `features.realtime = true` | websocket-realtime-agent |
| `features.email = true` | email-communication-agent |
| `features.i18n = true` | localization-agent |
| `features.pwa = true` | pwa-offline-agent |
| `features.analytics = true` | monitoring-observability-agent |

## Quick Configuration Templates

### React Web App with Supabase
```yaml
project.type: web_app
frontend.framework: react
backend.provider: supabase
database.type: postgresql
deployment.platform: vercel
```
**Activates:** frontend-agent, backend-agent, design-agent, devops-agent

### React Native Mobile App
```yaml
project.type: mobile_app
mobile.platform: react_native
backend.provider: firebase
deployment.platform: firebase
```
**Activates:** mobile-agent, firebase-backend-agent, devops-agent

### Next.js Full-Stack
```yaml
project.type: full_stack
frontend.framework: nextjs
backend.provider: custom
database.type: postgresql
deployment.platform: vercel
```
**Activates:** frontend-agent, backend-agent, api-graphql-agent, design-agent, devops-agent

### API-Only Backend
```yaml
project.type: api
backend.provider: custom
backend.language: typescript
backend.framework: express
database.type: postgresql
deployment.platform: aws
```
**Activates:** backend-agent, api-graphql-agent, aws-backend-agent, devops-agent

## How to Use This File

1. **New Project:** Update the configuration values when starting
2. **Claude Code reads this automatically** to determine which agents to use
3. **Changes take effect immediately** - no restart needed
4. **Commit this file** to ensure consistent behavior across team

## Validation Rules

- Only ONE mobile platform can be active at a time
- Only ONE backend provider can be primary (others can be secondary)
- If `project.type = api`, frontend agents are disabled
- If `mobile.platform = none`, all mobile agents are disabled

## Example Commands After Configuration

```bash
# Once configured, use simple commands:
"Create user authentication" # Uses appropriate agents based on config
"Add payment processing" # Activates payment-agent if not already active
"Set up CI/CD pipeline" # Uses devops-agent with your deployment platform
"Create mobile app screens" # Uses the configured mobile agent
```

---

*This configuration file is the brain of your project - it tells Claude Code exactly which tools and patterns to use!*