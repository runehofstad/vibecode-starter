# Project Instructions for Claude Code

## 🚀 Quick Start

This project uses the Vibecode Starter Kit. To initialize:

```bash
# Choose your project type:
"Initialize as React web app with Supabase"
"Initialize as React Native mobile app"
"Initialize as Next.js full-stack app"
"Initialize as API backend"

# Or auto-detect:
"Analyze and configure project"
```

## 📁 Claude Starter Kit Location

All Claude-specific documentation, Sub-Agents, and configuration files are in:
```
claude-starter/
├── .claude/          # Configuration files
├── docs/             # All documentation
│   ├── agents/       # 29 specialized Sub-Agents
│   └── guides/       # User guides
└── CLAUDE_FULL.md    # Full instructions with all details
```

## 🤖 Using Sub-Agents

Based on your project type, I will automatically load relevant Sub-Agents from `claude-starter/docs/agents/`:

- **Frontend:** frontend-agent, design-agent
- **Backend:** backend-agent, api-graphql-agent
- **Mobile:** mobile-agent, flutter-agent, ios-swift-agent
- **Testing:** testing-agent
- **DevOps:** devops-agent
- **Security:** security-agent

## 📝 Important Notes

1. Full documentation is in `claude-starter/docs/`
2. Project configuration is in `claude-starter/.claude/config/PROJECT_CONFIG.md`
3. For detailed instructions, see `claude-starter/CLAUDE_FULL.md`

### ⚠️ After Using This Template

When you create your own project from this template:
1. Use all the helper files in `claude-starter/` for development
2. Add `claude-starter/` to YOUR project's .gitignore
3. This keeps your project repo clean while maintaining local access to all helpers

## Current Project Configuration

```yaml
Project Type: [TO BE DETERMINED]
Backend: [TO BE DETERMINED]
Frontend: [TO BE DETERMINED]
Mobile: [TO BE DETERMINED]
```

---

*Initialize your project with one of the commands above to get started!*