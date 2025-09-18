# 🚀 VIBECODE STARTER

**Clean template for rapid development with Claude Code and 29 specialized Sub-Agents**

## ✨ What is this?

VIBECODE STARTER provides:
- 🤖 **29 specialized Sub-Agents** for expert-level development in any domain
- ⚡ **Zero setup time** - pre-configured build tools, linting, testing
- 🎯 **Clean project structure** - only essential files in your repo
- 📚 **Comprehensive documentation** - guides for every scenario
- 🚀 **From idea to deployed app in hours, not days**

## 🚀 How to Use This Template

### Step 1: Create Your Project
1. **Click "Use this template"** button on [GitHub](https://github.com/runehofstad/vibecode-starter)
2. Name your new repository
3. Choose Public or Private
4. Click **"Create repository from template"**

### Step 2: Clone and Setup
```bash
# Clone your new repository
git clone https://github.com/your-username/your-new-repo.git
cd your-new-repo

# Install dependencies
npm install
```

### Step 3: Initialize with Claude Code
Open Claude Code and run one of these commands:
```bash
"Initialize as React web app with Supabase"
"Initialize as React Native mobile app"
"Initialize as Next.js full-stack app"
"Initialize as API backend"
"Analyze and configure project"  # Auto-detect
```

### Step 4: Add Helper Files to Your .gitignore
**IMPORTANT:** Keep your repo clean by adding this to YOUR project's `.gitignore`:
```bash
# Add claude-starter to your gitignore
echo -e "\n# Claude helper files (local only)\nclaude-starter/\n.claude/" >> .gitignore
git add .gitignore
git commit -m "Add claude-starter to gitignore"
```

### Step 5: Start Development
```bash
npm run dev
```

You now have:
- ✅ Clean project repository (only your code in git)
- ✅ All 29 Sub-Agents available locally
- ✅ Full documentation in `claude-starter/docs/`
- ✅ Claude Code fully configured and ready

## 📦 What You Get

When you use this template, your project starts clean with only essential files:

```
your-project/
├── config/                     # Build configurations
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── src/                        # Your application code (to be created)
├── CLAUDE.md                   # Simple Claude Code instructions
├── package.json                # Dependencies
├── postcss.config.js
├── .gitignore                  # Includes claude-starter/
└── LICENSE
```

## 📚 Claude Starter Kit

The template includes full documentation and Sub-Agents in `claude-starter/`:

```
claude-starter/                 # All Claude helper files
├── .claude/                    # Claude configuration
│   ├── config/                 # PROJECT_CONFIG, INIT_PROMPTS, etc.
│   └── .cursorrules           
├── docs/                       
│   ├── agents/                 # 29 specialized Sub-Agents
│   └── guides/                 # All user guides
└── CLAUDE_FULL.md              # Full instructions
```

### ⚠️ IMPORTANT: After creating your project

**Add to YOUR project's .gitignore:**
```gitignore
# Claude helper files (keep locally, don't commit to your project)
claude-starter/
.claude/
```

This keeps your project repository clean while maintaining access to all helper files locally.

## 🤖 NEW: Sub-Agents System

Leverage **29 specialized AI agents** for different development tasks:

### ⚠️ IMPORTANT: How to Activate Sub-Agents

**Sub-Agents are NOT automatic!** You must explicitly tell Claude Code to use them:

1. **CLAUDE.md file now included** - This helps Claude Code recognize when to use agents
2. **Explicit references required** - Always mention the agent file when giving tasks
3. **See AGENT_EXAMPLES.md** for complete usage examples

### Core Development Agents
- **Frontend Agent** – React, TypeScript, UI/UX development
- **Backend Agents** – Supabase, Firebase, AWS backends
- **Mobile Agents** – React Native, iOS/Swift, Flutter
- **Testing Agent** – Jest, Playwright, comprehensive testing

### Infrastructure & Operations
- **DevOps Agent** – CI/CD, deployment, infrastructure
- **Docker/Container Agent** – Containerization, orchestration
- **Monitoring Agent** – Observability, logging, metrics
- **Security Agent** – Authentication, GDPR, security audits

### Specialized Agents
- **API/GraphQL Agent** – REST, GraphQL, API design
- **Database Migration Agent** – Schema migrations, data sync
- **Payment Agent** – Stripe, Vipps, e-commerce
- **WebSocket Agent** – Real-time features, live updates
- **Email/Communication Agent** – Transactional email, SMS, push
- **And 14 more specialized agents...**

### 🚀 Quick Start - How to Use Agents

```bash
# ✅ CORRECT - Explicitly reference the agent
claude "Use docs/agents/frontend-agent.md to create a responsive dashboard"

# ✅ CORRECT - Multiple agents for complex tasks
claude "Read frontend-agent.md and backend-agent.md, then build user authentication"

# ❌ WRONG - No agent reference (Claude won't use agents)
claude "Create a dashboard"
```

### Key Files for Agent Usage
- **`CLAUDE.md`** - Auto-instructs Claude to use agents (NEW!)
- **`AGENT_EXAMPLES.md`** - Complete usage examples (NEW!)
- **`docs/SUB_AGENTS.md`** - Full agent documentation
- **`docs/SUB_AGENT_WORKFLOW.md`** - Orchestration patterns
- **`docs/agents/`** - Individual agent specifications

## 📚 Documentation

All guides and cheat sheets are now in the `docs/` folder:
- `docs/USER_GUIDE.md` – Everything you need to know
- `docs/NEW_PROJECT_GUIDE.md` – 7 simple steps to a new project
- `docs/MOBILE_APP_GUIDE.md` – Complete guide for mobile development
- `docs/SUB_AGENTS.md` – Sub-Agents system overview
- `docs/SUB_AGENT_WORKFLOW.md` – Agent workflow patterns
- `docs/agents/` – Individual agent specifications
- `docs/CURSOR_README.md` – Cursor-specific instructions
- `docs/` – All cheat sheets and standards

## 💡 Technology stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: 
  - **Supabase** (PostgreSQL, Auth, Storage, Edge Functions) - Default
  - **Firebase** (Firestore, Cloud Functions, Auth) - Alternative
  - Choose based on your needs: `docs/BACKEND_SELECTION_GUIDE.md`
- **Testing**: Jest, React Testing Library, Playwright
- **Deploy**: Vercel, Firebase Hosting, AWS Amplify
- **Mobile**: React Native/Expo, Swift/SwiftUI, Kotlin, Flutter

## 🌍 International features

- Multi-language support (English + Norwegian included)
- Localized date formats
- Built-in GDPR support
- Comprehensive documentation

## 🤝 Contribute

Want to improve VIBECODE STARTER?

1. Fork the repo
2. Make changes
3. Open a pull request

---

**Note:** This project no longer uses shell scripts for setup. All onboarding is handled via the GitHub template method and documentation in `docs/`.