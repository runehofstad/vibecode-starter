# 🚀 Claude Code Starter Kit

A complete starter template for Claude Code with **29 specialized Sub-Agents** that activate automatically for rapid application development.

## ✨ How It Works

Claude Code and Cursor **automatically detect** Sub-Agents via the CLAUDE.md file. You don't need to do anything special - just start coding!

### Setup (2 minutes)
```bash
# 1. Use GitHub template to create your repo
# 2. Clone the project
git clone https://github.com/your-username/your-new-repo.git
cd your-new-repo
npm install
```

## 💻 Working with Claude Code

### Getting Started

**Simply tell Claude what you want to build:**
```bash
# Start a conversation about your project
"I want to build a web app with user authentication"
"Help me create a mobile app"
"I need an API backend with database"
"What kind of project should we build?"
```

**Claude will automatically:**
1. Ask about your requirements
2. Suggest the right technology stack
3. Set up your project structure
4. Load relevant Sub-Agents for your needs

### Automatically Available Sub-Agents

**These agents activate automatically when relevant:**

#### Core Development
- **Frontend Agent** (`frontend-agent.md`) - React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend Agent** (`backend-agent.md`) - Supabase, PostgreSQL, Edge Functions, RLS
- **Mobile Agent** (`mobile-agent.md`) - React Native, Expo, cross-platform
- **Testing Agent** (`testing-agent.md`) - Jest, Playwright, testing strategies

#### Specialized Agents
- **DevOps Agent** (`devops-agent.md`) - CI/CD, deployment, Docker
- **Security Agent** (`security-agent.md`) - Authentication, GDPR, security
- **API/GraphQL Agent** (`api-graphql-agent.md`) - REST/GraphQL APIs
- **Payment Agent** (`payment-agent.md`) - Stripe, PayPal, payment gateways
- **WebSocket Agent** (`websocket-realtime-agent.md`) - Real-time features
- **Email Agent** (`email-communication-agent.md`) - Email, SMS, push notifications

...and 19 more specialized agents in `claude-starter/docs/agents/`

### Usage Examples
```bash
# Describe what you need - Claude handles the rest
"Build a user profile feature with database and UI"
"Create comprehensive tests and set up CI/CD"
"Analyze performance and optimize the application"
"Implement real-time chat with WebSocket"
```

### How It Works Behind the Scenes
- The CLAUDE.md file instructs Claude Code about available agents
- Claude analyzes your request and selects relevant agents
- Multiple agents can work in parallel for complex tasks
- You get expert help without specifying which expertise you need

## 📁 Project Structure

```
your-project/
├── config/                    # Build configurations (ESLint, Prettier, TypeScript)
├── src/                       # Your application code (created on demand)
├── claude-starter/           # All helper files (add to .gitignore)
│   ├── .claude/             # Claude Code configuration
│   ├── docs/                # All documentation and guides
│   │   ├── agents/          # 29 specialized Sub-Agents
│   │   └── guides/          # User guides and workflows
│   └── CLAUDE_FULL.md       # Complete documentation
├── CLAUDE.md                 # Claude Code instructions
├── package.json              # Dependencies and scripts
└── .cursorrules             # Cursor IDE configuration (if using Cursor)
```

## 🚀 Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions) - Default
- **Alternative Backends**: Firebase, AWS (Sub-Agents available for all)
- **Mobile**: React Native/Expo, Swift/SwiftUI, Flutter
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel, Firebase Hosting, AWS Amplify

## 🚀 Get Started Now

```bash
# 1. Use GitHub template: https://github.com/runehofstad/vibecode-starter
# 2. Clone and start
git clone https://github.com/your-username/your-new-repo.git
cd your-new-repo && npm install

# 3. Open in Claude Code and start building!
# Simply describe what you want to create
```

## 📚 Complete Documentation

- **`claude-starter/docs/USER_GUIDE.md`** - Complete workflow guide
- **`claude-starter/docs/NEW_PROJECT_GUIDE.md`** - 7 steps to new project
- **`claude-starter/docs/MOBILE_APP_GUIDE.md`** - Mobile development guide
- **`claude-starter/docs/SUB_AGENTS.md`** - All 29 agents documented
- **`claude-starter/docs/agents/`** - Individual agent specifications
- **`claude-starter/CLAUDE_FULL.md`** - Complete instructions

## 🎯 Benefits of This Approach

1. **No manual configuration** - Everything is ready from the start
2. **Automatic agent selection** - Claude chooses the right experts
3. **Natural language** - Describe what you want, not how
4. **Parallel expertise** - Multiple agents work simultaneously
5. **Always up-to-date** - CLAUDE.md keeps agents synchronized

## ⚠️ Tips for Best Results

- **Be specific** in your descriptions for best agent matching
- **Start simple** and build gradually to see how agents collaborate
- **Let Claude suggest** solutions based on available agents

## 📝 After Using This Template

When creating your own project:
1. `claude-starter/` contains all documentation and agents
2. Consider adding `claude-starter/` to .gitignore for a clean repo
3. The CLAUDE.md file ensures Claude always has access to agents

---

**Claude Code Starter Kit** - 29 expert agents that activate automatically when you need them.