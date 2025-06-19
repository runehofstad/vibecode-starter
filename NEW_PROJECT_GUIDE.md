# 📋 New Project - Step by Step

## Quick Checklist
```bash
□ Create project folder
□ Run setup script
□ Start Claude Code
□ Request project setup
□ Verify everything works
```

---

## Detailed Guide

### Step 1: Preparation (2 min)
```bash
# Create and navigate to new folder
mkdir my-project
cd my-project

# Initialize git
git init
```

### Step 2: Run Setup (1 min)
```bash
# Run automatic setup (after installation)
claude-setup

# Or with full path if you haven't installed
~/Desktop/CLAUDE\ CODE\ STARTER/scripts/setup-project.sh
```
This installs Context7 and copies standard files.

### Step 3: Start Claude Code (1 min)
```bash
claude
```

### Step 4: Define the Project (5 min)
Copy and customize this template:

```
Set up a new project with the following specifications:

PROJECT NAME: [Your project name]
TYPE: [Web App / Mobile App / Full Stack]

TECHNOLOGY:
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Backend: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- Mobile: [React Native with Expo / Not applicable]

MAIN FEATURES:
1. [Feature 1 - e.g. User registration and login]
2. [Feature 2 - e.g. Dashboard with data visualization]
3. [Feature 3 - e.g. File upload and document management]

SPECIAL REQUIREMENTS:
- Support for Norwegian and English
- [Other requirements]

Start with full project structure and basic setup.
```

### Step 5: Let Claude Work (10-15 min)
Claude will automatically:
- ✅ Create folder structure
- ✅ Install dependencies
- ✅ Configure TypeScript
- ✅ Set up Tailwind CSS
- ✅ Configure Supabase
- ✅ Create base components
- ✅ Set up routing
- ✅ Implement localization

### Step 6: Verify (2 min)
```bash
# Ask Claude to verify
"Run the project and check that everything works"

# Claude will run:
npm run dev
npm run typecheck
npm run lint
```

### Step 7: First Commit (1 min)
```bash
"Create first commit with project setup"
```

---

## Project Type Examples

### 🛍️ E-commerce
```
Set up an e-commerce platform with:
- Product catalog with search and filtering
- Shopping cart and checkout
- User accounts and order history
- Admin panel for product management
- Stripe integration for payments
- Responsive design
- Norwegian and English language support
```

### 📊 Dashboard/Analytics
```
Set up an analytics dashboard with:
- User authentication with roles
- Real-time data from Supabase
- Interactive charts and visualizations
- Export reports (PDF/Excel)
- Mobile-optimized view
- Dark/light theme
- Norwegian and English language support
```

### 📱 Mobile App
```
Set up a React Native app with Expo for:
- Social networking app
- User registration and profiles
- Photo sharing with camera
- Push notifications
- Offline support
- iOS and Android
- Norwegian and English language support
```

### 🏢 SaaS Platform
```
Set up a SaaS platform with:
- Multi-tenant architecture
- User and team management
- Subscriptions with Stripe
- API with rate limiting
- Webhook integrations
- Admin dashboard
- Norwegian and English language support
```

---

## Tips for Best Start

### 📝 Be Specific
```
# Good ✅
"Create a login page with email and password, 
forgot password functionality, and Google OAuth"

# Less good ❌
"Create login"
```

### 🎯 Start Simple
Begin with core functionality, expand later:
1. Basic structure
2. Authentication
3. Main features
4. Styling and polish

### 🔄 Iterate Quickly
```bash
# After each step
"Show me what has been implemented"
"Run and test the functionality"
"What are we still missing?"
```

---

## Common Next Steps

### After Basic Setup
1. **Testing**: "Set up testing with Jest and React Testing Library"
2. **CI/CD**: "Configure GitHub Actions for testing and deployment"
3. **Documentation**: "Create README with installation and usage"
4. **Deployment**: "Prepare for deployment to Vercel/Firebase/AWS Amplify"

### Feature Development
```bash
# Always use this flow
"Implement [feature-name]"
"Write tests for [feature-name]"
"Create commit for [feature-name]"
```

---

## Quick Commands

### Copy for Quick Start
```bash
# Terminal commands (run in order)
mkdir my-project && cd my-project
git init
~/Desktop/CLAUDE\ CODE\ STARTER/scripts/setup-project.sh
claude
```

### Standard Project Prompt
```
Set up a new React project with TypeScript, Vite, 
Tailwind CSS, shadcn/ui, and Supabase. Include 
user authentication, routing, and Norwegian/English support. 
Start with full project structure.
```

---

## Need Help?

- See full user guide: `BRUKERVEILEDNING.md`
- Check cheat sheets: `cheatsheets/`
- Claude Code docs: https://docs.anthropic.com/en/docs/claude-code

Good luck with your new project! 🚀