# 🚀 Vibecode Starter

> Universal AI agent system for Cursor IDE and Claude Code

## ✨ What is Vibecode?

Vibecode Starter is a comprehensive collection of 28 specialized AI agents that enhance your development workflow. It works seamlessly with both **Cursor IDE** and **Claude Code**, automatically configuring itself based on your tools and project.

## 🎯 Features

- **28 Specialized AI Agents** - Frontend, backend, testing, security, and more
- **Universal Compatibility** - Works with both Cursor and Claude Code
- **Automatic Configuration** - Detects your stack and configures appropriately
- **Project Analysis** - Understands your codebase structure
- **Best Practices** - Enforces coding standards and patterns
- **Zero Manual Setup** - One command does everything

## 📦 Quick Start

### Use as GitHub Template

1. **Click "Use this template"** on GitHub
2. **Create your repository**
3. **Clone and install:**

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
cd YOUR_PROJECT
bash install.sh
```

### Install in Existing Project

```bash
# Clone Vibecode Starter
git clone https://github.com/runehofstad/vibecode-starter.git

# Go to your project
cd my-existing-project

# Install Vibecode
bash ../vibecode-starter/install.sh
```

## 🛠️ Configuration

The installer automatically detects your tools:

### For Cursor IDE Users
```bash
npm run vibecode:setup
```
- Generates optimized `.cursorrules`
- Configures Composer prompts
- Sets up agent references

### For Claude Code Users
```bash
npm run vibecode:init
```
- Installs agents to `~/.claude/agents/`
- Configures `CLAUDE.md` with guidelines
- Sets up project routing

### Using Both?
The installer configures for both automatically!

## 🤖 Included Agents (28 Total)

### Core Development
- **frontend-agent** - React, Vue, TypeScript, UI components
- **backend-agent** - APIs, databases, authentication
- **mobile-agent** - React Native, mobile development
- **testing-agent** - Jest, Playwright, testing strategies
- **security-agent** - Authentication, encryption, GDPR
- **devops-agent** - CI/CD, deployment, infrastructure

### Specialized Agents
- **api-graphql-agent** - REST and GraphQL APIs
- **data-agent** - Database optimization, queries
- **design-agent** - UI/UX, Figma, design systems
- **docker-container-agent** - Containerization
- **monitoring-observability-agent** - Logging, APM
- **documentation-agent** - Technical writing
- **ai-ml-integration-agent** - LLM integration
- **accessibility-agent** - WCAG compliance
- **seo-marketing-agent** - SEO optimization
- **database-migration-agent** - Schema migrations
- **localization-agent** - i18n, translations
- **pwa-offline-agent** - PWA, service workers
- **payment-agent** - Stripe, payment processing
- **websocket-realtime-agent** - Real-time features
- **email-communication-agent** - Transactional emails
- **aws-backend-agent** - AWS services
- **firebase-backend-agent** - Firebase platform
- **flutter-agent** - Flutter development
- **ios-swift-agent** - Native iOS
- **git-github-agent** - Version control
- **cli-agent** - Command-line tools
- **bankid-agent** - Norwegian BankID

## 📁 Project Structure

```
vibecode-starter/
├── vibecode/
│   ├── agents/           # All 28 agent specifications
│   ├── scripts/          # Setup and configuration
│   └── orchestrator/     # Project analysis
├── install.sh           # Universal installer
├── README.md
└── LICENSE
```

### After Installation

```
your-project/
├── .vibecode/           # Hidden Vibecode directory
├── .cursorrules         # (If using Cursor)
├── CLAUDE.md           # (If using Claude Code)
└── [your files...]
```

## 💡 How It Works

### 1. Project Analysis
Vibecode analyzes your project to detect:
- Frontend frameworks (React, Vue, Next.js)
- Backend services (Node, Python, Go)
- Database systems
- Testing frameworks
- Build tools

### 2. Intelligent Configuration
Based on analysis, Vibecode:
- Selects relevant agents
- Generates tool-specific configs
- Sets up best practices
- Configures coding standards

### 3. Seamless Integration
- **Cursor:** Reads `.cursorrules` automatically
- **Claude Code:** Uses agents from `~/.claude/agents/`
- **Both:** Share the same agent knowledge base

## 🚀 Usage Examples

### In Cursor Composer
```
@frontend-agent Create a responsive dashboard
@backend-agent Design REST API for users
@testing-agent Write comprehensive tests
```

### In Claude Code
```
"Build authentication system"
# Vibecode suggests: security-agent, backend-agent, frontend-agent

"Optimize database queries"
# Vibecode suggests: data-agent, monitoring-agent
```

## 🔧 Commands

```bash
# Setup for Cursor
npm run vibecode:setup

# Initialize for Claude Code
npm run vibecode:init

# Analyze project structure
npm run vibecode:analyze

# List available agents
npm run vibecode:list
```

## 📚 Documentation

Each agent includes comprehensive documentation:
- Expertise areas
- Best practices
- Code patterns
- Tool recommendations
- Common pitfalls

## 🤝 Contributing

1. Fork the repository
2. Add new agents or improve existing ones
3. Update documentation
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file

## 🙋 Support

- **Issues:** [GitHub Issues](https://github.com/runehofstad/vibecode-starter/issues)
- **Discussions:** [GitHub Discussions](https://github.com/runehofstad/vibecode-starter/discussions)

---

**Built with ❤️ for developers using AI-powered tools**

*Transform your development workflow with Vibecode Starter!*