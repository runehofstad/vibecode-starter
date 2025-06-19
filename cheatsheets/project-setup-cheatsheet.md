# Quick Project Setup Cheat Sheet

## React + TypeScript + Vite + Tailwind + Supabase

### Initial Setup
```bash
# Create Vite project
npm create vite@latest my-app -- --template react-ts
cd my-app

# Install dependencies
npm install

# Add Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Add shadcn/ui
npx shadcn-ui@latest init

# Add essential packages
npm install @supabase/supabase-js @tanstack/react-query react-router-dom
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react clsx tailwind-merge
npm install -D @types/node
```

### Configure Tailwind
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```js
// tailwind.config.js
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
```

### TypeScript Configuration
```json
// tsconfig.json - add paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite Configuration
```js
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Project Structure Setup
```bash
# Create folder structure
mkdir -p src/{components/{ui,common},pages,hooks,contexts,services,utils,types,locales,assets}

# Create essential files
touch src/contexts/AuthContext.tsx
touch src/services/supabase.ts
touch src/types/database.types.ts
touch src/locales/{en,nb}.json
touch .env.local
touch Changelog.txt
```

### Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### Git Setup
```bash
# Initialize git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules
dist
.env
.env.local
.DS_Store
*.log
EOF

# Initial commit
git add .
git commit -m "Initial project setup with React, TypeScript, Vite, Tailwind, and Supabase"
```

## React Native with Expo

### Create Project
```bash
# Create new Expo project
npx create-expo-app my-app --template

# Navigate and install
cd my-app
npm install

# Add navigation
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context

# Add essential packages
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
npx expo install expo-secure-store expo-localization
```

### Configure EAS
```bash
# Install EAS CLI
npm install -g eas-cli

# Login and initialize
eas login
eas init

# Configure build
eas build:configure
```

### Setup Localization
```typescript
// src/locales/i18n.ts
import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'
import en from './en.json'
import nb from './nb.json'

const i18n = new I18n({ en, nb })
i18n.locale = Localization.locale
i18n.enableFallback = true

export default i18n
```

## Testing Setup

### Web (Jest + React Testing Library)
```bash
# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event @types/jest
npm install -D jest-environment-jsdom

# Create jest.config.js
cat > jest.config.js << 'EOF'
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
}
EOF

# Create setupTests.ts
echo "import '@testing-library/jest-dom'" > src/setupTests.ts
```

### E2E Testing (Playwright)
```bash
# Install Playwright
npm init playwright@latest

# Run tests
npx playwright test

# Run with UI
npx playwright test --ui
```

## Quick Commands

### Development
```bash
# Web
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Mobile
npx expo start       # Start Expo
npx expo run:ios     # Run on iOS
npx expo run:android # Run on Android
```

### Testing
```bash
# Unit tests
npm test
npm run test:watch
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Deployment
```bash
# Web - Vercel
vercel --prod

# Web - AWS Amplify
amplify publish

# Web - Firebase
firebase deploy

# Mobile - EAS
eas build --platform all
eas submit --platform all
```