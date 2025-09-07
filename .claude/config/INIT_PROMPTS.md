# Claude Code Initialization Prompts

Use these prompts when starting a new project from the Vibecode Starter template. Claude Code will automatically configure and load the appropriate Sub-Agents.

## 🚀 Quick Start Prompts

### One-Line Initialization

Copy and paste one of these to quickly initialize your project:

```bash
# Web Applications
"Initialize as React web app with Supabase backend and Vercel deployment"
"Initialize as Next.js full-stack app with Firebase and Tailwind CSS"
"Initialize as Vue.js SPA with AWS backend and PostgreSQL"
"Initialize as static website with no backend"

# Mobile Applications  
"Initialize as React Native app for iOS and Android with Supabase"
"Initialize as Flutter cross-platform app with Firebase backend"
"Initialize as iOS native app with Swift and CloudKit"

# Backend/API
"Initialize as Node.js REST API with PostgreSQL and AWS deployment"
"Initialize as GraphQL API with Apollo Server and MongoDB"
"Initialize as Python FastAPI backend with SQLAlchemy"
"Initialize as serverless API with AWS Lambda"

# Full-Stack
"Initialize as Next.js app with Supabase, Stripe payments, and email"
"Initialize as T3 stack (Next.js, tRPC, Tailwind, Prisma)"
"Initialize as MEAN stack application"
"Initialize as Rails + React full-stack app"

# Specialized
"Initialize as Electron desktop app with React"
"Initialize as CLI tool with Node.js"
"Initialize as Chrome extension with React"
"Initialize as Progressive Web App with offline support"
```

## 📋 Interactive Initialization

For step-by-step configuration:

```bash
"Configure project interactively"
```

Claude will ask:
1. What type of application? (Web/Mobile/API/Desktop/CLI)
2. Which frontend framework? (React/Next.js/Vue/Angular/None)
3. Which backend service? (Supabase/Firebase/AWS/Custom/None)
4. Which database? (PostgreSQL/MySQL/MongoDB/Firestore)
5. Where will you deploy? (Vercel/AWS/Netlify/Firebase)
6. Any special features? (Auth/Payments/Realtime/Email)

## 🎯 Feature-Specific Initialization

Initialize with specific features pre-configured:

```bash
# E-commerce
"Initialize e-commerce site with React, Stripe, and Supabase"

# SaaS
"Initialize SaaS starter with authentication, subscriptions, and admin panel"

# Social Platform
"Initialize social app with real-time chat, notifications, and user profiles"

# Dashboard
"Initialize admin dashboard with charts, tables, and data export"

# Blog/CMS
"Initialize blog platform with MDX, comments, and newsletter"

# Learning Platform
"Initialize e-learning platform with video streaming and progress tracking"
```

## 🔧 Custom Stack Initialization

Combine any technologies:

```bash
"Initialize with [Frontend] + [Backend] + [Database] + [Deployment]"

# Examples:
"Initialize with React + Express + MongoDB + Docker"
"Initialize with Vue + Django + PostgreSQL + AWS"
"Initialize with Angular + .NET + SQL Server + Azure"
"Initialize with Svelte + Go + CockroachDB + Fly.io"
```

## 📁 From Existing Project

When you have existing code:

```bash
# Auto-detect from package.json and file structure
"Analyze existing project and configure agents"

# Specify the stack if auto-detection fails
"Configure existing Next.js project with Supabase"
"Configure existing React Native project"
"Configure existing Express API"
```

## 🎨 Project Type Templates

### Start-up MVP
```bash
"Initialize lean MVP with React, Supabase, and rapid deployment"
```
**Optimizes for:** Speed, simplicity, quick iteration

### Enterprise Application
```bash
"Initialize enterprise app with TypeScript, testing, and CI/CD"
```
**Optimizes for:** Scalability, maintainability, security

### Open Source Project
```bash
"Initialize open source project with documentation and contribution guides"
```
**Optimizes for:** Community, documentation, ease of contribution

### Internal Tool
```bash
"Initialize internal tool with authentication and audit logging"
```
**Optimizes for:** Security, logging, admin features

## 🤖 Agent-Specific Initialization

Load specific agents only:

```bash
# Frontend focused
"Initialize with frontend and design agents only"

# Backend focused  
"Initialize with backend and database agents only"

# Mobile focused
"Initialize with mobile and testing agents only"

# DevOps focused
"Initialize with DevOps and monitoring agents only"
```

## 📝 Post-Initialization Commands

After initialization, use these commands:

```bash
# Start development
"Set up development environment"
"Create initial project structure"
"Configure linting and formatting"

# Add features
"Add user authentication"
"Add payment processing with Stripe"
"Add email notifications"
"Add real-time updates"

# Deployment
"Set up CI/CD pipeline"
"Configure production deployment"
"Set up monitoring and logging"
```

## 💡 Pro Tips

1. **Be specific** about your tech stack for best results
2. **Mention deployment target** to get platform-specific optimizations
3. **Include features** you need (auth, payments, realtime) upfront
4. **Use PROJECT_CONFIG.md** to fine-tune after initialization

## 🔄 Changing Configuration

To change project configuration after initialization:

```bash
"Switch from Supabase to Firebase"
"Add React Native to existing web app"
"Change deployment from Vercel to AWS"
"Add payment processing capability"
```

## 📚 Learning Mode

For educational projects:

```bash
"Initialize learning project with extensive comments and documentation"
"Initialize tutorial project for [specific technology]"
"Initialize with beginner-friendly setup"
```

## 🏗️ Architecture Patterns

Initialize with specific patterns:

```bash
"Initialize with microservices architecture"
"Initialize with serverless architecture"
"Initialize with monorepo structure"
"Initialize with micro-frontend architecture"
"Initialize with event-driven architecture"
```

---

*Choose the initialization prompt that best matches your project needs. Claude Code will handle the rest, loading only the relevant Sub-Agents for your specific stack!*