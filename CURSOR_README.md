# 🎯 CURSOR-VERSJON – CLAUDE CODE STARTER

Dette er Cursor-tilpasset versjon av CLAUDE CODE STARTER. Du får samme standarder og beste praksis, men optimalisert for Cursor IDE.

## 🚀 Rask start med Cursor

### 1. Installer Cursor
```bash
# Last ned fra https://cursor.sh/
# Eller via Homebrew (macOS)
brew install --cask cursor
```

### 2. Klon dette prosjektet
```bash
git clone https://github.com/runehofstad/Claude_code_starter.git
cd Claude_code_starter
```

### 3. Opprett nytt prosjekt
```bash
# Gå til ønsket mappe
cd ~/Projects
mkdir mitt-prosjekt && cd mitt-prosjekt

# Kjør Cursor-setup
../Claude_code_starter/scripts/cursor-setup.sh

# Installer avhengigheter
npm install

# Åpne i Cursor
cursor .
```

## 🎯 Cursor-spesifikke funksjoner

### `.cursorrules`-fil
- Automatisk AI-konfigurasjon
- Prosjektspesifikke standarder
- Samme stack som Claude Code-versjonen

### Integrerte cheat sheets
Bruk `@` i Cursor for å referere til:
- `@cheatsheets/supabase-cli-cheatsheet.md`
- `@cheatsheets/react-native-cheatsheet.md`
- `@cheatsheets/expo-eas-cheatsheet.md`
- `@USER_GUIDE.md`

### Kontekstfiler
Alle markdown-filer fungerer som kontekst i Cursor:
- `USER_GUIDE.md`
- `NEW_PROJECT_GUIDE.md`
- `MOBILE_APP_GUIDE.md`

## 🔄 Forskjeller fra Claude Code-versjonen

| Funksjon | Claude Code | Cursor |
|----------|-------------|--------|
| Konfigurasjon | `~/.claude/CLAUDE.md` | `.cursorrules` |
| Setup | `claude-setup` | `cursor-setup.sh` |
| AI-integrasjon | CLI-basert | IDE-integrert |
| Kontekst | Globalt | Prosjektspesifikt |

## 📚 Samme dokumentasjon

Alle guider fungerer:
- **USER_GUIDE.md** – Komplett arbeidsflyt
- **NEW_PROJECT_GUIDE.md** – 7 steg til nytt prosjekt
- **MOBILE_APP_GUIDE.md** – Mobilutvikling
- **cheatsheets/** – Hurtigreferanser

## 🛠️ Teknologistack

Identisk med Claude Code-versjonen:
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Mobil**: React Native/Expo, Swift/SwiftUI
- **Testing**: Jest, Playwright, Detox

## 🎯 Bruk i Cursor

1. **Åpne prosjekt**: `cursor .`
2. **Bruk AI**: Cmd+K for AI-kommandoer
3. **Kontekst**: `@filnavn` for å referere til filer
4. **Chat**: Cmd+L for AI-chat med full kontekst

## 🔧 Tilpasninger

Du kan tilpasse `.cursorrules` for ditt team:
- Legg til teamstandarder
- Endre stack
- Tilpass kommunikasjonsstil

## 🤝 Begge versjoner

Du kan bruke begge parallelt:
- **Claude Code**: CLI-basert
- **Cursor**: IDE-basert

Samme standarder og beste praksis! 