# 🚀 Claude Code User Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Step-by-Step for New Project](#step-by-step-for-new-project)
3. [Daily Workflow](#daily-workflow)
4. [Tips and Tricks](#tips-and-tricks)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Node.js installed
- Claude Code installed: `npm install -g @anthropic-ai/claude-code`
- Git installed

### Quick Setup
```bash
# Navigate to project folder
cd /path/to/my-project

# Run setup script
~/Desktop/CLAUDE\ CODE\ STARTER/scripts/setup-project.sh

# Start Claude Code
claude
```

---

## Step-by-Step for New Project

### 1️⃣ Create Project Folder
```bash
# Create new folder
mkdir my-new-project
cd my-new-project

# Initialize git
git init
```

### 2️⃣ Run Setup Script
```bash
# This adds Context7 and copies standard files
~/Desktop/CLAUDE\ CODE\ STARTER/scripts/setup-project.sh
```

### 3️⃣ Start Claude Code with Project Type
```bash
# Start Claude
claude

# First command - request project setup
"Set up a new React project with TypeScript, Vite, Tailwind CSS and Supabase"
```

### 4️⃣ Claude will automatically:
- Create folder structure
- Install dependencies
- Configure TypeScript and Tailwind
- Set up Supabase
- Create basic components
- Create localization (en/nb)

### 5️⃣ Verify the Setup
```bash
# Claude will run these commands for you:
npm run dev        # Start development server
npm run typecheck  # Check TypeScript
npm run lint       # Run linting
```

---

## Daily Workflow

### Start the Day
```bash
# 1. Navigate to project folder
cd /path/to/project

# 2. Start Claude Code
claude

# 3. Check todo list
"Show the todo list"

# 4. Continue where you left off
"Continue with implementing user authentication"
```

### Add New Functionality
```bash
# Ask Claude to create a feature
"Create a user profile page with ability to upload profile picture"

# Claude will:
# - Create necessary components
# - Set up Supabase Storage
# - Implement upload functionality
# - Add error handling
# - Update routing
```

### Testing
```bash
# Request testing
"Write tests for the user profile component"

# Or run existing tests
"Run all tests and fix any errors"
```

### Commit and PR
```bash
# Create commit
"Create a git commit for the changes"

# Create pull request
"Create a pull request for this feature"
```

---

## Tips and Tricks

### 🎯 Effective Commands

#### Search and Navigation
```bash
"Find all places where we use authentication"
"Show me the user component"
"Which file handles API calls?"
```

#### Refactoring
```bash
"Refactor this component to use hooks"
"Optimize performance in the product list"
"Migrate from JavaScript to TypeScript"
```

#### Documentation with Context7
```bash
# Get updated documentation
"Use Context7 to find best practices for Supabase RLS"
"What's new in React 18?"
```

### 📝 Use CLAUDE.md Effectively

Add project-specific details:
```markdown
## Project-Specific Notes

### API Endpoints
- Auth: https://api.myapp.com/auth
- Users: https://api.myapp.com/users

### Special Requirements
- All dates must be displayed in Norwegian format
- Use only Supabase Edge Functions, not Firebase
```

### 🔄 Update Context7 Regularly
```bash
# Every Monday
claude mcp add context7 -- npx -y @upstash/context7-mcp
```

---

## Troubleshooting

### Problem: Claude doesn't understand the project structure
**Solution:**
```bash
"Read CLAUDE.md and understand the project structure"
```

### Problem: Outdated API usage
**Solution:**
1. Update Context7
2. Ask Claude to use the latest documentation

### Problem: Claude forgets context
**Solution:**
```bash
# Use the todo list actively
"Show the todo list and continue with the next task"
```

### Problem: Errors in generated code
**Solution:**
```bash
"Run linting and type checking, and fix all errors"
```

---

## Example: Complete Project Setup

### E-commerce App with User Authentication
```bash
# 1. Create and navigate
mkdir norwegian-webshop
cd norwegian-webshop

# 2. Run setup
~/Desktop/CLAUDE\ CODE\ STARTER/scripts/setup-project.sh

# 3. Start Claude
claude

# 4. Initial command
"Set up an e-commerce app with:
- React, TypeScript, Vite, Tailwind
- Supabase for backend and auth
- Product catalog with search and filtering
- Shopping cart and checkout
- User registration and login
- Norwegian and English language support
- Responsive design for mobile and desktop"

# 5. Claude will systematically:
# - Create project structure
# - Install all dependencies
# - Configure Supabase
# - Create database schema
# - Implement auth flow
# - Create product components
# - Set up routing
# - Implement shopping cart
# - Add localization

# 6. Test and verify
"Run the project and show me that everything works"

# 7. Next step
"Add payment integration with Stripe"
```

---

## Quick Reference

### Most Used Commands
| Command | Description |
|---------|-------------|
| `claude` | Start Claude Code |
| `claude -p "question"` | Single question |
| `claude -c` | Continue last conversation |
| `/memory` | Edit CLAUDE.md |
| `/exit` | Exit Claude |

### Important Files
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project standards |
| `~/.claude/CLAUDE.md` | Personal preferences |
| `Changelog.txt` | Change log |
| `cheatsheets/` | Quick references |

### Git workflow
```bash
# Feature branch
git checkout -b feat/new-feature

# Commit with Claude
"Create a commit for the changes"

# Push and PR
"Create pull request"
```

---

## Useful Resources

- **Claude Code Docs**: https://docs.anthropic.com/en/docs/claude-code
- **Context7**: https://context7.com
- **Cheat Sheets**: See `cheatsheets/` folder
- **Support**: https://github.com/anthropics/claude-code/issues

---

## Good Luck! 🎉

With this setup you have everything you need for efficient development with Claude Code. Remember:
- Use natural language
- Be specific in your instructions
- Let Claude handle the repetitive work
- Focus on creativity and problem solving!