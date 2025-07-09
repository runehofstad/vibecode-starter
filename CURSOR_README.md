# 🎯 CURSOR VERSION – CLAUDE CODE STARTER

This is the Cursor-adapted version of CLAUDE CODE STARTER. You get the same standards and best practices, but optimized for Cursor IDE.

## 🚀 Quick start with Cursor

### 1. Install Cursor
```bash
# Download from https://cursor.sh/
# Or via Homebrew (macOS)
brew install --cask cursor
```

### 2. Clone this project
```bash
git clone https://github.com/runehofstad/Claude_code_starter.git
cd Claude_code_starter
```

### 3. Create a new project
```bash
# Go to your desired folder
cd ~/Projects
mkdir my-project && cd my-project

# Run Cursor setup
../Claude_code_starter/scripts/cursor-setup.sh

# Install dependencies
npm install

# Open in Cursor
cursor .
```

## 🎯 Cursor-specific features

### `.cursorrules` file
- Automatic AI configuration
- Project-specific standards
- Same stack as the Claude Code version

### Integrated cheat sheets
Use `@` in Cursor to reference:
- `@cheatsheets/supabase-cli-cheatsheet.md`
- `@cheatsheets/react-native-cheatsheet.md`
- `@cheatsheets/expo-eas-cheatsheet.md`
- `@USER_GUIDE.md`

### Context files
All markdown files work as context in Cursor:
- `USER_GUIDE.md`
- `NEW_PROJECT_GUIDE.md`
- `MOBILE_APP_GUIDE.md`

## 🔄 Differences from the Claude Code version

| Feature      | Claude Code | Cursor |
|--------------|-------------|--------|
| Configuration| `~/.claude/CLAUDE.md` | `.cursorrules` |
| Setup        | `claude-setup` | `cursor-setup.sh` |
| AI integration| CLI-based    | IDE-integrated |
| Context      | Global       | Project-specific |

## 📚 Same documentation

All guides work:
- **USER_GUIDE.md** – Complete workflow
- **NEW_PROJECT_GUIDE.md** – 7 steps to a new project
- **MOBILE_APP_GUIDE.md** – Mobile development
- **cheatsheets/** – Quick references

## 🛠️ Technology stack

Identical to the Claude Code version:
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Mobile**: React Native/Expo, Swift/SwiftUI
- **Testing**: Jest, Playwright, Detox

## 🎯 Using Cursor

1. **Open project**: `cursor .`
2. **Use AI**: Cmd+K for AI commands
3. **Context**: `@filename` to reference files
4. **Chat**: Cmd+L for AI chat with full context

## 🔧 Customization

You can customize `.cursorrules` for your team:
- Add team standards
- Change stack
- Adjust communication style

## 🤝 Both versions

You can use both in parallel:
- **Claude Code**: CLI-based
- **Cursor**: IDE-based

Same standards and best practices! 