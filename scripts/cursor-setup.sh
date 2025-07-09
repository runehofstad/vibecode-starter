#!/bin/bash

# 🎯 CURSOR SETUP SCRIPT
# Setter opp et nytt prosjekt med Cursor-optimalisert konfigurasjon

echo "🚀 Setter opp prosjekt for Cursor..."

# Lag mappestruktur
mkdir -p src/{components/{ui,common},pages,hooks,contexts,services,utils,types,locales,assets}

# Kopier .cursorrules til prosjektroten
cp ../.cursorrules ./

# Opprett essensielle filer
cat > package.json << 'EOF'
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-hook-form": "^7.43.0",
    "clsx": "^1.2.1",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24"
  }
}
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
EOF

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

cat > .env.example << 'EOF'
# Supabase
VITE_SUPABASE_URL=din_supabase_url
VITE_SUPABASE_ANON_KEY=din_supabase_anon_key

# Andre miljøvariabler
VITE_APP_NAME=Mitt Prosjekt
EOF

mkdir -p src/locales
cat > src/locales/en.json << 'EOF'
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel"
  }
}
EOF

cat > src/locales/nb.json << 'EOF'
{
  "common": {
    "loading": "Laster...",
    "error": "En feil oppstod",
    "save": "Lagre",
    "cancel": "Avbryt"
  }
}
EOF

cat > Changelog.txt << 'EOF'
# Prosjektendringer

Format: [YYYY-MM-DD] - <beskrivelse> (commit: <hash>)

EOF

cat > .gitignore << 'EOF'
node_modules/
.pnp
.pnp.js
/build
/dist
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
pids
*.pid
*.seed
*.pid.lock
coverage/
*.lcov
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF

cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mitt Prosjekt</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

cat > src/App.tsx << 'EOF'
import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Velkommen til ditt prosjekt
        </h1>
        <p className="text-gray-600">
          Prosjektet er satt opp og klart til bruk!
        </p>
      </div>
    </div>
  )
}

export default App
EOF

cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF

cat > src/App.css << 'EOF'
.App {
  text-align: center;
}
EOF

echo "✅ Prosjektstruktur opprettet!"
echo "📋 Neste steg:"
echo "1. Kjør: npm install"
echo "2. Kopier .env.example til .env og konfigurer"
echo "3. Kjør: npm run dev"
echo "4. Åpne i Cursor og start utviklingen!"
echo ""
echo "📚 Tilgjengelige guider:"
echo "- USER_GUIDE.md - Komplett arbeidsflyt"
echo "- cheatsheets/ - Hurtigreferanser"
echo "- .cursorrules - AI-assistent konfigurasjon" 