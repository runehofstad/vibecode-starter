# 🎯 CURSOR VERSION – VIBECODE STARTER

This is the Cursor-adapted version of VIBECODE STARTER. You get the same standards and best practices, but optimized for Cursor IDE.

## 🚀 Quick start with Cursor (Template Method)

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

## 🎯 Cursor-specific features

### `.cursorrules` file
- Automatic AI configuration
- Project-specific standards
- Same stack as the Claude Code version

### Integrated cheat sheets
Use `@` in Cursor to reference:
- `@docs/supabase-cli-cheatsheet.md`
- `@docs/react-native-cheatsheet.md`
- `@docs/expo-eas-cheatsheet.md`
- `@docs/USER_GUIDE.md`

### Context files
All markdown files work as context in Cursor:
- `docs/USER_GUIDE.md`
- `docs/NEW_PROJECT_GUIDE.md`
- `docs/MOBILE_APP_GUIDE.md`

## 🔄 Differences from the Claude Code version

| Feature      | Claude Code | Cursor |
|--------------|-------------|--------|
| Configuration| `~/.claude/CLAUDE.md` | `.cursorrules` |
| Setup        | `claude-setup` | Template method |
| AI integration| CLI-based    | IDE-integrated |
| Context      | Global       | Project-specific |

## 📚 Same documentation

All guides work:
- `docs/USER_GUIDE.md` – Complete workflow
- `docs/NEW_PROJECT_GUIDE.md` – 7 steps to a new project
- `docs/MOBILE_APP_GUIDE.md` – Mobile development
- `docs/` – All cheat sheets and standards

## 🛠️ Technology stack

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

---

**Note:** This project no longer uses shell scripts for setup. All onboarding is handled via the GitHub template method and documentation in `docs/`. 