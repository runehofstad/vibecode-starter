# 🚀 VIBECODE STARTER

A complete starter kit for efficient development with both Claude Code CLI and Cursor IDE.

## ✨ What is this?

VIBECODE STARTER provides:
- ✅ Pre-configured standards for modern web and mobile development
- ✅ Automatic project setup with one script
- ✅ **Dual support**: Claude Code CLI + Cursor IDE
- ✅ Context7 integration for up-to-date documentation
- ✅ Comprehensive cheat sheets and guides
- ✅ Best practices for professional developers

## 🎯 Choose your tool

### 🖥️ Claude Code CLI (Original)
Perfect for command-line lovers:
```bash
npm install -g @anthropic-ai/claude-code
./install.sh
claude-setup
```

### 🎯 Cursor IDE (New!)
Perfect for those who want AI directly in the IDE:
```bash
# Download Cursor from https://cursor.sh/
./scripts/cursor-setup.sh
cursor .
```

## 📦 Contents

```
VIBECODE STARTER/
├── VIBECODE.md                  # Claude Code standards (rename file if needed)
├── .cursorrules                 # Cursor AI configuration
├── CURSOR_README.md             # Cursor-specific guide
├── USER_GUIDE.md                # Complete user guide
├── NEW_PROJECT_GUIDE.md         # Step-by-step startup
├── MOBILE_APP_GUIDE.md          # Mobile development guide
├── INSTALLATION.md              # Installation guide
├── scripts/
│   ├── setup-project.sh         # Claude Code setup
│   └── cursor-setup.sh          # Cursor setup
└── cheatsheets/
    ├── supabase-cli-cheatsheet.md
    ├── expo-eas-cheatsheet.md
    ├── react-native-cheatsheet.md
    ├── project-setup-cheatsheet.md
    ├── deployment-cheatsheet.md
    ├── git-workflow-cheatsheet.md
    └── context7-workflow.md
```

## 🚀 Quick start

### Option 1: Claude Code CLI
```bash
# Install Claude Code
yarn global add @anthropic-ai/claude-code # or npm install -g
./install.sh

# Start new project
cd ~/Projects
mkdir my-project && cd my-project
claude-setup
claude
```

### Option 2: Cursor IDE
```bash
# Install Cursor from https://cursor.sh/

# Create new project
cd ~/Projects
mkdir my-project && cd my-project
../vibecode-starter/scripts/cursor-setup.sh

# Open in Cursor
cursor .
```

## 🔄 Comparison: Claude Code vs Cursor

| Feature         | Claude Code CLI         | Cursor IDE           |
|-----------------|------------------------|----------------------|
| Setup           | `claude-setup`         | `cursor-setup.sh`    |
| Configuration   | `~/.claude/CLAUDE.md`  | `.cursorrules`       |
| AI integration  | Command-line           | Direct in IDE        |
| Context         | Global                 | Project-specific     |
| Best for        | CLI users              | IDE users            |

You can use both solutions in parallel – same standards, same documentation, and shared cheat sheets!

## 💡 Technology stack

Identical for both solutions:

### Web
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Testing**: Jest, React Testing Library, Playwright
- **Deploy**: Vercel, Firebase Hosting, AWS Amplify

### Mobile
- **React Native with Expo** (recommended)
- **iOS Native**: Swift 6+ with SwiftUI
- **Android Native**: Kotlin
- **Flutter**: Dart with Material Design
- **Testing**: Detox, XCTest, Espresso

## 📚 Documentation

Works for both solutions:
- **USER_GUIDE.md** – Everything you need to know
- **NEW_PROJECT_GUIDE.md** – 7 simple steps to a new project
- **MOBILE_APP_GUIDE.md** – Complete guide for mobile development
- **CURSOR_README.md** – Cursor-specific instructions
- **cheatsheets/** – Quick references for all tools

## 🌍 International features

- Multi-language support (English + Norwegian included)
- Localized date formats
- Built-in GDPR support
- Comprehensive documentation

## 🤝 Contribute

Want to improve VIBECODE STARTER?

1. Fork the repo
2. Make changes
3. Send a pull request

## 📄 License

MIT License – Free to use in your own projects!

## 🙏 Credits

Created by Studio X for the global developer community.

---

**Start your next project in minutes, not hours!** 🚀
**Now with dual support for Claude Code CLI and Cursor IDE!** 🎯