# 🎨 Design Guidelines - Vibecode Starter

## Design System Overview

### Core Design Principles
- **Simplicity**: Clean, minimal interfaces that focus on functionality
- **Consistency**: Unified visual language across all platforms
- **Accessibility**: WCAG 2.1 AA compliance for all components
- **Mobile-First**: Responsive design that works on all devices
- **Performance**: Lightweight components that load quickly

## Color System

### Primary Colors
```css
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-900: #1e3a8a;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Neutral Colors
```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale
```css
.text-h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
.text-h2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
.text-h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
.text-h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
.text-lg { font-size: 1.125rem; line-height: 1.6; }
.text-base { font-size: 1rem; line-height: 1.6; }
.text-sm { font-size: 0.875rem; line-height: 1.5; }
.text-xs { font-size: 0.75rem; line-height: 1.4; }
```

## Component Guidelines

### Buttons
- Use shadcn/ui or Tailwind for consistent button styles
- Primary, secondary, and destructive variants
- Minimum touch target: 44x44px

### Forms
- Use clear labels and error messages
- Group related fields
- Use accessible input types

### Cards
- Use for grouping related content
- Padding: 24px
- Rounded corners: 8px

## Mobile Design Guidelines
- Follow mobile-first principles
- Use bottom navigation for main sections
- Ensure all touch targets are at least 44x44px
- Use safe area insets for iOS

## Accessibility Guidelines
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- All interactive elements must be keyboard accessible
- Use semantic HTML and ARIA labels

## Animation Guidelines
- Use Framer Motion for React animations
- Keep transitions under 300ms
- Use micro-interactions for feedback

## Icon Guidelines
- Use Lucide React icons
- Standard sizes: 16px, 20px, 24px
- Consistent stroke width (1.5px)

## Layout Patterns
- Use a 12-column grid for desktop
- Responsive breakpoints: 640px, 768px, 1024px, 1280px
- Max container width: 1200px

## Error & Loading States
- Always show clear error messages
- Use skeleton loaders or spinners for loading

## Native iOS Design
- **Follow Apple’s Human Interface Guidelines:**
  - [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
  - Use native controls and navigation patterns
  - Prioritize clarity, deference, and depth
  - Support dark mode and dynamic type
  - Use SF Symbols for icons

## Best Practices
- Reuse components
- Keep code and styles DRY
- Document all custom components
- Test for accessibility and responsiveness

## Tools & Resources
- Figma for design mockups
- Storybook for component documentation
- Tailwind CSS for utility-first styling
- shadcn/ui for base components
- Framer Motion for animations
- Jest & React Testing Library for testing 