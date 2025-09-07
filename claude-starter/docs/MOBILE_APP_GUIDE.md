# 📱 Mobile App Development Guide

## Quick Start for Mobile Apps

Vibecode Starter fully supports mobile app development with React Native, iOS (Swift), Android, and Flutter through specialized Sub-Agents.

## 🚀 Getting Started

### React Native with Expo (Recommended)

```bash
# 1. Create new project
mkdir my-mobile-app && cd my-mobile-app

# 2. Run setup
claude-setup

# 3. Start Claude Code
claude

# 4. Request mobile app setup
"Set up a React Native app with Expo for [your app type]"
```

### Example Mobile App Requests

#### 🏪 E-commerce App
```
Set up a React Native e-commerce app with:
- Product browsing with categories
- Shopping cart and checkout
- User authentication
- Push notifications for orders
- Offline product viewing
- Payment integration with Stripe
- Multi-language support (en/nb)
```

#### 💬 Social Media App
```
Create a React Native social app with:
- User profiles and authentication
- Photo/video sharing with camera
- Real-time chat with Supabase
- Push notifications
- Infinite scroll feed
- Stories feature
- Dark mode support
```

#### 🏋️ Fitness Tracker
```
Build a React Native fitness app with:
- Workout tracking and history
- Exercise library with videos
- Progress charts and statistics
- Apple Health/Google Fit integration
- Reminder notifications
- Offline mode for workouts
- Social features for sharing
```

#### 🍕 Food Delivery App
```
Create a React Native food delivery app with:
- Restaurant listings with search
- Menu browsing and customization
- Cart and order management
- Real-time order tracking
- Payment processing
- Push notifications
- Rating and review system
```

## 📋 Mobile-Specific Features

### Essential Mobile Components

Claude Code will automatically implement:
- **Navigation**: Stack, Tab, and Drawer navigation
- **Authentication**: Biometric login, secure token storage
- **Storage**: Secure storage for sensitive data
- **Permissions**: Camera, location, notifications
- **Platform-specific**: iOS and Android differences

### Performance Optimization

```bash
# Ask Claude to optimize your app
"Optimize the app performance for smooth scrolling and fast startup"

# Claude will:
# - Implement lazy loading
# - Optimize images
# - Add caching strategies
# - Reduce bundle size
# - Implement code splitting
```

### Testing Mobile Apps

```bash
# Unit tests
"Write unit tests for the authentication flow"

# Integration tests
"Set up Detox for E2E testing"

# Platform testing
"Test the app on both iOS and Android simulators"
```

## 🛠️ Development Workflow

### 1. Initial Setup
```bash
claude-setup
claude
"Set up React Native app with Expo, TypeScript, and Supabase"
```

### 2. Core Features
```bash
# Authentication
"Implement user registration and login with Supabase"

# Navigation
"Set up navigation with authentication flow"

# UI Components
"Create reusable UI components following Material Design"
```

### 3. Platform-Specific
```bash
# iOS specific
"Add iOS-specific features like haptic feedback"

# Android specific
"Implement Android back button handling"
```

### 4. Testing & Deployment
```bash
# Build
"Create production builds for both platforms"

# Deploy
"Set up EAS Build and Submit for app stores"
```

## 📱 Native Development

### iOS (Swift/SwiftUI)
```bash
# Use iOS/Swift Agent
claude --agent docs/agents/ios-swift-agent.md "Create an iOS app with SwiftUI for [app type]"
# Claude will set up Xcode project with best practices
```

### Android (Kotlin)
```bash
"Create an Android app with Kotlin for [app type]"
# Claude will set up Android Studio project
```

### Flutter
```bash
# Use Flutter Agent
claude --agent docs/agents/flutter-agent.md "Create a Flutter app for [app type]"
# Sets up Flutter project with Material Design 3
```

## 🔧 Common Mobile Tasks

### Push Notifications
```bash
"Implement push notifications with Expo Notifications"
```

### Camera & Media
```bash
"Add camera functionality with image picker and cropping"
```

### Location Services
```bash
"Implement location tracking with background updates"
```

### Offline Support
```bash
"Add offline support with data synchronization"
```

### In-App Purchases
```bash
"Implement in-app purchases for iOS and Android"
```

## 🚀 Deployment

### EAS Build & Submit
```bash
# Configure
"Set up EAS for building and submitting to stores"

# Build
eas build --platform all

# Submit
eas submit --platform all
```

### Over-the-Air Updates
```bash
# Publish update
eas update --branch production --message "Bug fixes"
```

## 📚 Resources

- **Expo Documentation**: Built into Context7
- **React Native Best Practices**: Included in CLAUDE.md
- **Platform Guidelines**: iOS HIG & Material Design
- **Testing Strategies**: See cheatsheets/

## 💡 Pro Tips

1. **Start with Expo** unless you need specific native features
2. **Test on real devices** early and often
3. **Optimize images** - they're the biggest performance impact
4. **Handle offline scenarios** from the beginning
5. **Follow platform conventions** for better user experience

Ready to build your mobile app? Just tell Claude what you need! 🚀