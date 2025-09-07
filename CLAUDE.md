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

1. The `claude-starter/` directory is ignored by git (local helper files only)
2. Full documentation is in `claude-starter/docs/`
3. Project configuration is in `claude-starter/.claude/config/PROJECT_CONFIG.md`
4. For detailed instructions, see `claude-starter/CLAUDE_FULL.md`

## Current Project Configuration

```yaml
Project Type: [TO BE DETERMINED]
Backend: [TO BE DETERMINED]
Frontend: [TO BE DETERMINED]
Mobile: [TO BE DETERMINED]
```

---

*Initialize your project with one of the commands above to get started!*