# 🚀 VIBECODE STARTER

A complete starter kit for efficient development with both Claude Code CLI and Cursor IDE.

## ✨ What is this?

VIBECODE STARTER provides:
- ✅ Pre-configured standards for modern web and mobile development
- ✅ **GitHub template** for instant project setup
- ✅ **Sub-Agents system** for specialized development tasks (NEW!)
- ✅ Context7 integration for up-to-date documentation
- ✅ Comprehensive cheat sheets and guides
- ✅ Best practices for professional developers

## 🚀 How to start a new project (Template Method)

1. **Click "Use this template"** on GitHub ([repo link](https://github.com/runehofstad/vibecode-starter)).
2. Create your new repository (choose name and visibility).
3. Clone your new repository to your local machine:
   ```sh
   git clone https://github.com/your-username/your-new-repo.git
   cd your-new-repo
   ```
4. Install dependencies and start coding!
   ```sh
   npm install
   npm run dev
   ```

All documentation is located in the `docs/` folder.

## 📦 Contents

```
vibecode-starter/
├── .claude/                    # Claude Code configuration
│   ├── config/                 # Project configuration files
│   │   ├── PROJECT_CONFIG.md   # Stack configuration
│   │   ├── INIT_PROMPTS.md     # Initialization examples
│   │   └── AGENT_EXAMPLES.md   # Agent usage examples
│   └── settings.local.json     # Local Claude settings
├── docs/                       # All documentation and cheat sheets
│   ├── agents/                 # 29 specialized Sub-Agents
│   ├── USER_GUIDE.md           # Complete user guide
│   ├── NEW_PROJECT_GUIDE.md    # Step-by-step startup
│   ├── MOBILE_APP_GUIDE.md     # Mobile development guide
│   ├── CURSOR_README.md        # Cursor-specific guide
│   ├── VIBECODE.md             # Project standards
│   └── ...                     # All other guides and cheat sheets
├── CLAUDE.md                   # Main Claude Code instructions (root required)
├── src/                        # Your app code
├── package.json
└── ...
```

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