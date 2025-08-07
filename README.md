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
├── docs/                       # All documentation and cheat sheets
│   ├── USER_GUIDE.md           # Complete user guide
│   ├── NEW_PROJECT_GUIDE.md    # Step-by-step startup
│   ├── MOBILE_APP_GUIDE.md     # Mobile development guide
│   ├── CURSOR_README.md        # Cursor-specific guide
│   ├── VIBECODE.md             # Project standards
│   ├── ...                     # All other guides and cheat sheets
├── src/                        # Your app code
├── package.json
└── ...
```

## 🤖 NEW: Sub-Agents System

Leverage specialized AI agents for different development tasks:

### Available Sub-Agents
- **Frontend Agent** – React, TypeScript, UI/UX development
- **Backend Agent** – Supabase, PostgreSQL, API development
- **Mobile Agent** – React Native, Expo, native development
- **Testing Agent** – Jest, Playwright, comprehensive testing
- **Security Agent** – Authentication, GDPR, security audits
- **DevOps Agent** – CI/CD, deployment, infrastructure
- **Design Agent** – UI/UX, Figma integration, accessibility
- **Data Agent** – Database optimization, analytics

### Quick Example
```bash
# Use specific agent for specialized task
claude --agent docs/agents/frontend-agent.md "Create responsive dashboard"

# Orchestrate multiple agents for complex features
claude --orchestrate "Build complete authentication system"
```

See `docs/SUB_AGENTS.md` and `docs/SUB_AGENT_WORKFLOW.md` for complete documentation.

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