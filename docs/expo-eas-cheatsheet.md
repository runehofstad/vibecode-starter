# Expo & EAS CLI Cheat Sheet

## Installation & Setup
```bash
# Install Expo CLI globally
npm install -g expo-cli eas-cli

# Create new Expo project
npx create-expo-app my-app --template

# Login to Expo account
expo login
eas login

# Initialize EAS in project
eas init
```

## Development
```bash
# Start development server
npx expo start

# Start with clear cache
npx expo start -c

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Open in Expo Go
npx expo start --tunnel
```

## EAS Build
```bash
# Configure EAS Build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both platforms
eas build --platform all

# Build specific profile
eas build --profile preview

# Build locally (requires setup)
eas build --local
```

## EAS Submit
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android

# Submit with specific build
eas submit -p ios --id <build-id>
```

## EAS Update (OTA)
```bash
# Publish update
eas update --branch production --message "Fix login bug"

# Publish to preview branch
eas update --branch preview

# List updates
eas update:list

# View update details
eas update:view <update-id>

# Configure auto updates
eas update:configure
```

## Credentials Management
```bash
# Manage iOS credentials
eas credentials

# Auto-manage credentials
eas build --auto-submit

# Clear credentials
eas credentials:configure --platform ios
```

## Environment & Secrets
```bash
# Set secret for EAS Build
eas secret:create --name API_KEY --value "your-key"

# List secrets
eas secret:list

# Delete secret
eas secret:delete --name API_KEY

# Use in app.config.js
export default {
  extra: {
    apiKey: process.env.API_KEY
  }
}
```

## Common Workflows

### Production Release
```bash
# 1. Update version
npm version patch

# 2. Build for production
eas build --profile production --platform all

# 3. Submit to stores
eas submit --platform all

# 4. Publish OTA update for existing users
eas update --branch production --message "v1.2.3 release"
```

### Preview Build for Testing
```bash
# 1. Create preview build
eas build --profile preview --platform all

# 2. Share with testers
# (URLs provided after build)

# 3. Push updates without rebuilding
eas update --branch preview
```

### Development Setup
```bash
# 1. Clone project
git clone <repo>
cd <project>

# 2. Install dependencies
npm install

# 3. Start dev server
npx expo start

# 4. Run on device with Expo Go
# Scan QR code
```

## Debugging
```bash
# View Metro bundler logs
npx expo start --dev-client

# Clear all caches
npx expo start -c
rm -rf node_modules
npm install
cd ios && pod install

# Check environment info
npx expo-env-info

# Validate app.json/app.config.js
npx expo config

# Run diagnostics
npx expo doctor
```

## Profile Configuration (eas.json)
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json"
      }
    }
  }
}
```

## Useful Commands
```bash
# Check Expo SDK version
expo --version

# Upgrade Expo SDK
expo upgrade

# Eject from managed workflow (careful!)
expo eject

# Add custom native code
npx expo prebuild

# Clean prebuild
npx expo prebuild --clean
```