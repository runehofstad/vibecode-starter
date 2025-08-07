# 🚀 Vibecode Starter User Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Sub-Agents System](#sub-agents-system)
3. [Step-by-Step for New Project](#step-by-step-for-new-project)
4. [Daily Workflow](#daily-workflow)
5. [Available Scripts](#available-scripts)
6. [Tips and Tricks](#tips-and-tricks)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Node.js installed
- Git installed

### Quick Setup (Template Method)
```bash
# 1. Use the GitHub template to create your new repo
# 2. Clone your new repository
cd /path/to/your-projects

git clone https://github.com/your-username/your-new-repo.git
cd your-new-repo

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

All documentation is located in the `docs/` folder.

---

## Sub-Agents System

### 🤖 29 Specialized AI Agents
Vibecode Starter includes 29 specialized Sub-Agents for different development tasks:

**Core Development:**
- Frontend, Backend (Supabase/Firebase/AWS), Mobile (React Native/iOS/Flutter)

**Operations:**
- DevOps, Docker, Monitoring, Security

**Specialized:**
- Payment, WebSocket, Email, API/GraphQL, Database Migration

**Quality:**
- Testing, Documentation, Accessibility, SEO

### Using Sub-Agents with Claude Code
```bash
# Use specific agent for specialized task
claude --agent docs/agents/frontend-agent.md "Create responsive dashboard"

# Backend selection
claude --agent docs/agents/supabase-backend-agent.md "Setup database"
claude --agent docs/agents/firebase-backend-agent.md "Setup Firestore"
claude --agent docs/agents/aws-backend-agent.md "Setup Lambda functions"
```

### Using Sub-Agents with Cursor
- Reference agents with `@docs/agents/[agent-name].md`
- The `.cursorrules` file automatically loads agent context

See `docs/SUB_AGENTS.md` for complete agent list and `docs/SUB_AGENT_WORKFLOW.md` for orchestration.

---

## Step-by-Step for New Project

### 1️⃣ Create Project from Template
- Go to the [GitHub template repo](https://github.com/runehofstad/vibecode-starter)
- Click **"Use this template"**
- Create your new repository
- Clone it to your machine

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development
```bash
npm run dev
```

### 4️⃣ Project Structure
```
your-project/
├── src/                 # Your application code
├── docs/               # All documentation
│   ├── agents/         # 29 Sub-Agent specifications
│   └── *.md            # Guides and cheatsheets
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite bundler config
├── tailwind.config.js  # Tailwind CSS config
└── .cursorrules        # AI assistant configuration
```

---

## Daily Workflow

### Start the Day
```bash
cd /path/to/your-project
npm run dev
```

### Add New Functionality
- Use the guides in `docs/` for best practices
- Use Cursor or your preferred IDE

---

## Available Scripts

### Development
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Testing
| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |

### Code Quality
| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |

## Quick Reference

### Backend Options
- **Supabase** (Default): PostgreSQL, Auth, Storage, Edge Functions
- **Firebase**: Firestore, Cloud Functions, Auth
- **AWS**: Lambda, DynamoDB, API Gateway

See `docs/BACKEND_SELECTION_GUIDE.md` for choosing.

### Important Files
| File | Purpose |
|------|---------|
| `.cursorrules` | AI assistant configuration |
| `docs/SUB_AGENTS.md` | All 29 Sub-Agents overview |
| `docs/SUB_AGENT_WORKFLOW.md` | Agent orchestration guide |
| `docs/BACKEND_SELECTION_GUIDE.md` | Choose backend |
| `docs/Changelog.txt` | Change log |

### Git workflow
```bash
git checkout -b feat/new-feature
git add .
git commit -m "Add new feature"
git push
```

---

## Useful Resources

- **All documentation:** See the `docs/` folder
- **Cheat Sheets:** See `docs/` folder
- **Support:** https://github.com/runehofstad/vibecode-starter/issues

---

## Good Luck! 🎉

With this setup you have everything you need for efficient development. All onboarding is handled via the GitHub template method and documentation in `docs/`.