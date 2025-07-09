# 🚀 CLAUDE CODE STARTER

En komplett startpakke for effektiv utvikling med både Claude Code CLI og Cursor IDE.

## ✨ Hva er dette?

CLAUDE CODE STARTER gir deg:
- ✅ Ferdigkonfigurerte standarder for moderne web- og mobilutvikling
- ✅ Automatisk prosjektoppsett med ett script
- ✅ **Dobbel støtte**: Claude Code CLI + Cursor IDE
- ✅ Context7-integrasjon for oppdatert dokumentasjon
- ✅ Omfattende cheat sheets og guider
- ✅ Beste praksis for profesjonelle utviklere

## 🎯 Velg ditt verktøy

### 🖥️ Claude Code CLI (Opprinnelig)
Perfekt for deg som liker kommandolinje:
```bash
npm install -g @anthropic-ai/claude-code
./install.sh
claude-setup
```

### 🎯 Cursor IDE (Ny!)
Perfekt for deg som vil ha AI direkte i IDE:
```bash
# Last ned Cursor fra https://cursor.sh/
./scripts/cursor-setup.sh
cursor .
```

## 📦 Innhold

```
CLAUDE CODE STARTER/
├── CLAUDE.md                    # Claude Code-standarder
├── .cursorrules                 # Cursor AI-konfigurasjon
├── CURSOR_README.md             # Cursor-spesifikk guide
├── USER_GUIDE.md                # Komplett brukerguide
├── NEW_PROJECT_GUIDE.md         # Steg-for-steg oppstart
├── MOBILE_APP_GUIDE.md          # Mobilutviklingsguide
├── INSTALLATION.md              # Installasjonsguide
├── scripts/
│   ├── setup-project.sh         # Claude Code-setup
│   └── cursor-setup.sh          # Cursor-setup
└── cheatsheets/
    ├── supabase-cli-cheatsheet.md
    ├── expo-eas-cheatsheet.md
    ├── react-native-cheatsheet.md
    ├── project-setup-cheatsheet.md
    ├── deployment-cheatsheet.md
    ├── git-workflow-cheatsheet.md
    └── context7-workflow.md
```

## 🚀 Rask start

### Alternativ 1: Claude Code CLI
```bash
# Installer Claude Code
yarn global add @anthropic-ai/claude-code # eller npm install -g
./install.sh

# Start nytt prosjekt
cd ~/Projects
mkdir mitt-prosjekt && cd mitt-prosjekt
claude-setup
claude
```

### Alternativ 2: Cursor IDE
```bash
# Installer Cursor fra https://cursor.sh/

# Opprett nytt prosjekt
cd ~/Projects
mkdir mitt-prosjekt && cd mitt-prosjekt
../claude-code-starter/scripts/cursor-setup.sh

# Åpne i Cursor
cursor .
```

## 🔄 Sammenligning: Claude Code vs Cursor

| Funksjon         | Claude Code CLI         | Cursor IDE           |
|------------------|------------------------|----------------------|
| Oppsett          | `claude-setup`         | `cursor-setup.sh`    |
| Konfigurasjon    | `~/.claude/CLAUDE.md`  | `.cursorrules`       |
| AI-integrasjon   | Kommandolinje          | Direkte i IDE        |
| Kontekst         | Global                 | Prosjektspesifikk    |
| Best for         | CLI-brukere            | IDE-brukere          |

Du kan bruke begge løsninger parallelt – samme standarder, samme dokumentasjon, og felles cheat sheets!

## 💡 Teknologistack

Identisk for begge løsninger:

### Web
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Testing**: Jest, React Testing Library, Playwright
- **Deploy**: Vercel, Firebase Hosting, AWS Amplify

### Mobil
- **React Native med Expo** (anbefalt)
- **iOS Native**: Swift 6+ med SwiftUI
- **Android Native**: Kotlin
- **Flutter**: Dart med Material Design
- **Testing**: Detox, XCTest, Espresso

## 📚 Dokumentasjon

Fungerer for begge løsninger:
- **USER_GUIDE.md** – Alt du trenger å vite
- **NEW_PROJECT_GUIDE.md** – 7 enkle steg til nytt prosjekt
- **MOBILE_APP_GUIDE.md** – Komplett guide for mobilutvikling
- **CURSOR_README.md** – Cursor-spesifikke instruksjoner
- **cheatsheets/** – Hurtigreferanser for alle verktøy

## 🌍 Internasjonale funksjoner

- Flerspråklig støtte (engelsk + norsk)
- Lokaliserte datoformater
- Innebygd GDPR-støtte
- Omfattende dokumentasjon

## 🤝 Bidra

Vil du forbedre CLAUDE CODE STARTER?

1. Fork repoet
2. Gjør endringer
3. Send pull request

## 📄 Lisens

MIT License – Fritt å bruke i egne prosjekter!

## 🙏 Credits

Laget av Studio X for det globale utviklermiljøet.

---

**Start ditt neste prosjekt på minutter, ikke timer!** 🚀
**Nå med dobbel støtte for Claude Code CLI og Cursor IDE!** 🎯