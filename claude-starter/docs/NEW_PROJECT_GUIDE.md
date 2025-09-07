# 📋 New Project - Step by Step

## Quick Checklist
```bash
□ Use GitHub template to create new repo
□ Clone your new repo
□ Install dependencies
□ Choose backend (Supabase/Firebase/AWS)
□ Select Sub-Agents for your project
□ Start development server
□ Verify everything works
```

---

## Detailed Guide

### Step 1: Preparation (2 min)
- Go to the [GitHub template repo](https://github.com/runehofstad/vibecode-starter)
- Click **"Use this template"**
- Create your new repository
- Clone it to your machine:
```bash
git clone https://github.com/your-username/your-new-repo.git
cd your-new-repo
```

### Step 2: Install Dependencies (1 min)
```bash
npm install
```

### Step 3: Start Development (1 min)
```bash
npm run dev
```

### Step 4: Choose Backend & Agents (2 min)

#### Backend Selection:
- **Supabase** (Default): Best for SQL, open source, real-time
- **Firebase**: Best for NoSQL, offline-first, Google ecosystem
- **AWS**: Best for enterprise scale, microservices, full control

See `docs/BACKEND_SELECTION_GUIDE.md` for detailed comparison.

#### Select Sub-Agents:
Choose from 29 specialized agents based on your needs:
- Core: Frontend, Backend, Mobile, Testing
- Ops: DevOps, Docker, Security, Monitoring
- Features: Payment, WebSocket, Email, API
- More: See `docs/SUB_AGENTS.md` for full list

### Step 5: Define the Project (5 min)
Copy and customize this template:

```
Set up a new project with the following specifications:

PROJECT NAME: [Your project name]
TYPE: [Web App / Mobile App / Full Stack]

TECHNOLOGY:
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Backend: [Supabase / Firebase / AWS]
- Mobile: [React Native / iOS Swift / Flutter / Not applicable]

MAIN FEATURES:
1. [Feature 1 - e.g. User registration and login]
2. [Feature 2 - e.g. Dashboard with data visualization]
3. [Feature 3 - e.g. File upload and document management]

SPECIAL REQUIREMENTS:
- Support for Norwegian and English
- [Other requirements]

Start with full project structure and basic setup.
```

### Step 6: Let the AI Work with Sub-Agents (10-15 min)

#### With Claude Code CLI:
```bash
# Use specific agents for tasks
claude --agent docs/agents/frontend-agent.md "Create dashboard"
claude --agent docs/agents/backend-agent.md "Setup database"
claude --agent docs/agents/testing-agent.md "Add test coverage"
```

#### With Cursor IDE:
- Reference agents: `@docs/agents/[agent-name].md`
- `.cursorrules` automatically loads agent context
- Follow the guides in `docs/` for best practices

### Step 7: Verify (2 min)
```bash
npm run dev          # Start dev server
npm run type-check   # Check TypeScript
npm run lint         # Check code quality
npm test            # Run tests
```

### Step 8: First Commit (1 min)
```bash
git add .
git commit -m "Initial project setup"
```

---

## Project Type Examples

### 🛍️ E-commerce
```
Set up a new e-commerce project with:
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Supabase for products, orders, auth
- Payment: Stripe integration (use Payment Agent)
- Features: Cart, checkout, order tracking
- Agents: Frontend, Backend, Payment, Testing
```

### 📱 Mobile App
```
Set up a cross-platform mobile app with:
- Framework: React Native with Expo
- Backend: Firebase for real-time sync
- Features: Push notifications, offline support
- Agents: Mobile, Firebase Backend, PWA/Offline
```

### 💬 Real-time Chat
```
Set up a real-time chat application with:
- Frontend: React with Socket.io
- Backend: Supabase with WebSocket
- Features: Live messaging, typing indicators
- Agents: Frontend, Backend, WebSocket, Testing
```

---

## Quick Commands

### Copy for Quick Start
```bash
# Terminal commands (run in order)
git clone https://github.com/your-username/your-new-repo.git
cd your-new-repo
npm install
npm run dev
```

---

## Need Help?

- See full user guide: `docs/USER_GUIDE.md`
- Check cheat sheets: `docs/`
- Vibecode Starter repo: https://github.com/runehofstad/vibecode-starter

All documentation is now in the `docs/` folder.