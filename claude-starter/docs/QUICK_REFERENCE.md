# Vibecode Quick Reference Guide

## 🤖 Using Sub-Agents for Specific Tasks

Instead of separate guides, use the specialized Sub-Agents for each area:

### Code Standards & Quality
- **Code Standards** → Use `docs/agents/frontend-agent.md`, `docs/agents/backend-agent.md`
- **Testing** → Use `docs/agents/testing-agent.md`
- **Security** → Use `docs/agents/security-agent.md`
- **Performance** → Use `docs/agents/monitoring-observability-agent.md`

### Design & UX
- **Design Guidelines** → Use `docs/agents/design-agent.md`
- **Accessibility** → Use `docs/agents/accessibility-agent.md`
- **Internationalization** → Use `docs/agents/localization-agent.md`

### Infrastructure & Deployment
- **DevOps** → Use `docs/agents/devops-agent.md`
- **Docker** → Use `docs/agents/docker-container-agent.md`
- **Database** → Use `docs/agents/database-migration-agent.md`

## 📚 Essential Guides

These comprehensive guides remain as primary references:

1. **[SUB_AGENTS.md](SUB_AGENTS.md)** - Complete overview of all 26 agents
2. **[SUB_AGENT_WORKFLOW.md](SUB_AGENT_WORKFLOW.md)** - How to work with agents
3. **[ORCHESTRATION_EXAMPLES.md](ORCHESTRATION_EXAMPLES.md)** - Multi-agent coordination
4. **[BACKEND_SELECTION_GUIDE.md](BACKEND_SELECTION_GUIDE.md)** - Choose between Supabase/Firebase/AWS
5. **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user documentation
6. **[NEW_PROJECT_GUIDE.md](NEW_PROJECT_GUIDE.md)** - Starting new projects

## 🎯 Quick Agent Selection

### By Technology
```bash
# Frontend
claude --agent docs/agents/frontend-agent.md "Create React component"

# Backend (choose one)
claude --agent docs/agents/backend-agent.md "Supabase API"
claude --agent docs/agents/firebase-backend-agent.md "Firebase setup"
claude --agent docs/agents/aws-backend-agent.md "AWS Lambda function"

# Mobile
claude --agent docs/agents/mobile-agent.md "React Native app"
claude --agent docs/agents/ios-swift-agent.md "Native iOS app"
claude --agent docs/agents/flutter-agent.md "Flutter app"
```

### By Task
```bash
# Security audit
claude --agent docs/agents/security-agent.md "Implement authentication"

# Performance optimization
claude --agent docs/agents/monitoring-observability-agent.md "Setup monitoring"

# Database work
claude --agent docs/agents/data-agent.md "Optimize queries"
claude --agent docs/agents/database-migration-agent.md "Create migration"

# API development
claude --agent docs/agents/api-graphql-agent.md "Design REST API"

# Testing
claude --agent docs/agents/testing-agent.md "Write unit tests"

# Deployment
claude --agent docs/agents/devops-agent.md "Setup CI/CD"
claude --agent docs/agents/docker-container-agent.md "Containerize app"
```

## 🚀 Common Workflows

### Starting a New Project
```bash
# 1. Frontend + Backend + Database
claude --orchestrate "Create full-stack app with React, Supabase, and PostgreSQL"

# 2. Mobile App
claude --orchestrate "Create React Native app with Firebase backend"

# 3. PWA
claude --agent docs/agents/pwa-offline-agent.md "Convert to PWA"
```

### Adding Features
```bash
# Authentication
claude --orchestrate "Add authentication with MFA"

# Search
claude --orchestrate "Implement full-text search"

# Analytics
claude --orchestrate "Add analytics tracking"
```

## 📖 Cheatsheets

Quick references for common tools:

- [Supabase CLI](supabase-cli-cheatsheet.md)
- [Expo/EAS](expo-eas-cheatsheet.md)
- [React Native](react-native-cheatsheet.md)
- [Git Workflow](git-workflow-cheatsheet.md)
- [Deployment](deployment-cheatsheet.md)
- [Project Setup](project-setup-cheatsheet.md)

## 🔗 Resources

- **Examples**: `docs/examples/` - Code examples and templates
- **Archive**: `docs/archive/` - Legacy documentation
- **Agents**: `docs/agents/` - All 26 specialized agents

## 💡 Tips

1. **Use the right agent** - Each agent is an expert in its domain
2. **Combine agents** - Use orchestration for complex tasks
3. **Check cheatsheets** - Quick commands and snippets
4. **Follow workflows** - Proven patterns for common tasks

---

*For detailed information on any topic, refer to the specific agent documentation in `docs/agents/`*
