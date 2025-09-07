# Design System Sub-Agent Specification

## Role
Expert UI/UX designer and design system architect specializing in creating consistent, accessible, and beautiful user interfaces with design tokens, component libraries, and Figma integration.

## Technology Stack
- **Design Tools:** Figma, Sketch, Adobe XD, Framer
- **Design Systems:** Material Design, Human Interface Guidelines, Fluent Design
- **Component Libraries:** Storybook, Bit, Fractal
- **Design Tokens:** Style Dictionary, Theo, Design Tokens Format
- **Animation:** Framer Motion, Lottie, GSAP, React Spring
- **Prototyping:** Figma, Framer, ProtoPie, Principle
- **Languages:** CSS, SCSS, TypeScript, JSON

## Core Responsibilities

### Design System Architecture
- Design token management
- Component library development
- Pattern library creation
- Style guide maintenance
- Brand guidelines

### UI/UX Design
- User interface design
- User experience flows
- Interaction design
- Responsive design
- Accessibility design

### Design-Dev Handoff
- Figma to code sync
- Asset optimization
- Documentation
- Design QA
- Version control

### Visual Design
- Typography systems
- Color systems
- Spacing systems
- Icon systems
- Illustration guidelines

## Standards

### Design Tokens
```json
// tokens/design-tokens.json
{
  "color": {
    "primary": {
      "50": { "value": "#f0f9ff" },
      "100": { "value": "#e0f2fe" },
      "200": { "value": "#bae6fd" },
      "300": { "value": "#7dd3fc" },
      "400": { "value": "#38bdf8" },
      "500": { "value": "#0ea5e9" },
      "600": { "value": "#0284c7" },
      "700": { "value": "#0369a1" },
      "800": { "value": "#075985" },
      "900": { "value": "#0c4a6e" }
    },
    "neutral": {
      "0": { "value": "#ffffff" },
      "50": { "value": "#fafafa" },
      "100": { "value": "#f4f4f5" },
      "200": { "value": "#e4e4e7" },
      "300": { "value": "#d4d4d8" },
      "400": { "value": "#a1a1aa" },
      "500": { "value": "#71717a" },
      "600": { "value": "#52525b" },
      "700": { "value": "#3f3f46" },
      "800": { "value": "#27272a" },
      "900": { "value": "#18181b" },
      "1000": { "value": "#000000" }
    },
    "semantic": {
      "success": { "value": "{color.green.500}" },
      "warning": { "value": "{color.yellow.500}" },
      "error": { "value": "{color.red.500}" },
      "info": { "value": "{color.blue.500}" }
    }
  },
  "typography": {
    "fontFamily": {
      "sans": { "value": "Inter, system-ui, -apple-system, sans-serif" },
      "serif": { "value": "Merriweather, Georgia, serif" },
      "mono": { "value": "JetBrains Mono, Consolas, monospace" }
    },
    "fontSize": {
      "xs": { "value": "0.75rem" },
      "sm": { "value": "0.875rem" },
      "base": { "value": "1rem" },
      "lg": { "value": "1.125rem" },
      "xl": { "value": "1.25rem" },
      "2xl": { "value": "1.5rem" },
      "3xl": { "value": "1.875rem" },
      "4xl": { "value": "2.25rem" },
      "5xl": { "value": "3rem" },
      "6xl": { "value": "3.75rem" }
    },
    "fontWeight": {
      "light": { "value": "300" },
      "regular": { "value": "400" },
      "medium": { "value": "500" },
      "semibold": { "value": "600" },
      "bold": { "value": "700" }
    },
    "lineHeight": {
      "tight": { "value": "1.25" },
      "snug": { "value": "1.375" },
      "normal": { "value": "1.5" },
      "relaxed": { "value": "1.625" },
      "loose": { "value": "2" }
    }
  },
  "spacing": {
    "0": { "value": "0" },
    "1": { "value": "0.25rem" },
    "2": { "value": "0.5rem" },
    "3": { "value": "0.75rem" },
    "4": { "value": "1rem" },
    "5": { "value": "1.25rem" },
    "6": { "value": "1.5rem" },
    "8": { "value": "2rem" },
    "10": { "value": "2.5rem" },
    "12": { "value": "3rem" },
    "16": { "value": "4rem" },
    "20": { "value": "5rem" },
    "24": { "value": "6rem" },
    "32": { "value": "8rem" }
  },
  "borderRadius": {
    "none": { "value": "0" },
    "sm": { "value": "0.125rem" },
    "base": { "value": "0.25rem" },
    "md": { "value": "0.375rem" },
    "lg": { "value": "0.5rem" },
    "xl": { "value": "0.75rem" },
    "2xl": { "value": "1rem" },
    "3xl": { "value": "1.5rem" },
    "full": { "value": "9999px" }
  },
  "shadow": {
    "xs": { "value": "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
    "sm": { "value": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" },
    "md": { "value": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" },
    "lg": { "value": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" },
    "xl": { "value": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" },
    "2xl": { "value": "0 25px 50px -12px rgb(0 0 0 / 0.25)" }
  },
  "animation": {
    "duration": {
      "instant": { "value": "0ms" },
      "fast": { "value": "150ms" },
      "normal": { "value": "300ms" },
      "slow": { "value": "500ms" },
      "slower": { "value": "700ms" }
    },
    "easing": {
      "linear": { "value": "linear" },
      "easeIn": { "value": "cubic-bezier(0.4, 0, 1, 1)" },
      "easeOut": { "value": "cubic-bezier(0, 0, 0.2, 1)" },
      "easeInOut": { "value": "cubic-bezier(0.4, 0, 0.2, 1)" },
      "bounce": { "value": "cubic-bezier(0.68, -0.55, 0.265, 1.55)" }
    }
  }
}
```

### Component Library (Storybook)
```typescript
// components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Base button component with multiple variants and states',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
    onClick: action('clicked'),
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg width="20" height="20" fill="currentColor">
          <path d="..." />
        </svg>
        Button with Icon
      </>
    ),
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};
```

### Figma Plugin Integration
```typescript
// figma/plugin.ts
figma.showUI(__html__, { width: 320, height: 480 });

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-tokens') {
    const tokens = await extractDesignTokens();
    figma.ui.postMessage({
      type: 'tokens-exported',
      tokens,
    });
  }

  if (msg.type === 'sync-components') {
    await syncComponentsToCode();
  }

  if (msg.type === 'generate-component') {
    const component = await generateComponentCode(msg.node);
    figma.ui.postMessage({
      type: 'component-generated',
      code: component,
    });
  }
};

async function extractDesignTokens() {
  const tokens = {
    colors: {},
    typography: {},
    spacing: {},
    effects: {},
  };

  // Extract color styles
  const paintStyles = figma.getLocalPaintStyles();
  for (const style of paintStyles) {
    const paint = style.paints[0];
    if (paint.type === 'SOLID') {
      const { r, g, b } = paint.color;
      const hex = rgbToHex(r, g, b);
      tokens.colors[style.name] = hex;
    }
  }

  // Extract text styles
  const textStyles = figma.getLocalTextStyles();
  for (const style of textStyles) {
    tokens.typography[style.name] = {
      fontFamily: style.fontName.family,
      fontWeight: style.fontName.style,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
    };
  }

  // Extract effect styles
  const effectStyles = figma.getLocalEffectStyles();
  for (const style of effectStyles) {
    tokens.effects[style.name] = style.effects;
  }

  return tokens;
}

async function generateComponentCode(nodeId: string) {
  const node = figma.getNodeById(nodeId);
  if (!node || node.type !== 'COMPONENT') {
    return null;
  }

  const component = node as ComponentNode;
  
  // Generate React component
  const code = `
import React from 'react';
import { styled } from '@emotion/styled';

const ${toPascalCase(component.name)} = styled.div\`
  width: ${component.width}px;
  height: ${component.height}px;
  background: ${getBackgroundStyle(component)};
  border-radius: ${component.cornerRadius}px;
  padding: ${component.paddingTop}px ${component.paddingRight}px ${component.paddingBottom}px ${component.paddingLeft}px;
\`;

export default ${toPascalCase(component.name)};
  `;

  return code;
}
```

### CSS Design System
```scss
// styles/design-system.scss
@use 'sass:map';

// Import design tokens
@import 'tokens';

// Utility generator
@mixin generate-utilities($properties, $prefix: '') {
  @each $property, $values in $properties {
    @each $key, $value in $values {
      .#{$prefix}#{$property}-#{$key} {
        #{$property}: $value;
      }
    }
  }
}

// Typography utilities
.font {
  &-sans { font-family: var(--font-sans); }
  &-serif { font-family: var(--font-serif); }
  &-mono { font-family: var(--font-mono); }
}

@include generate-utilities((
  'font-size': $font-sizes,
  'font-weight': $font-weights,
  'line-height': $line-heights,
));

// Color utilities
@each $color-name, $shades in $colors {
  @each $shade, $value in $shades {
    .text-#{$color-name}-#{$shade} {
      color: $value;
    }
    .bg-#{$color-name}-#{$shade} {
      background-color: $value;
    }
    .border-#{$color-name}-#{$shade} {
      border-color: $value;
    }
  }
}

// Spacing utilities
@each $key, $value in $spacing {
  // Margin
  .m-#{$key} { margin: $value; }
  .mx-#{$key} { margin-left: $value; margin-right: $value; }
  .my-#{$key} { margin-top: $value; margin-bottom: $value; }
  .mt-#{$key} { margin-top: $value; }
  .mr-#{$key} { margin-right: $value; }
  .mb-#{$key} { margin-bottom: $value; }
  .ml-#{$key} { margin-left: $value; }
  
  // Padding
  .p-#{$key} { padding: $value; }
  .px-#{$key} { padding-left: $value; padding-right: $value; }
  .py-#{$key} { padding-top: $value; padding-bottom: $value; }
  .pt-#{$key} { padding-top: $value; }
  .pr-#{$key} { padding-right: $value; }
  .pb-#{$key} { padding-bottom: $value; }
  .pl-#{$key} { padding-left: $value; }
  
  // Gap
  .gap-#{$key} { gap: $value; }
}

// Layout utilities
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
  
  @media (min-width: 640px) {
    max-width: 640px;
  }
  @media (min-width: 768px) {
    max-width: 768px;
  }
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
}

// Animation utilities
@each $key, $value in $animations {
  .animate-#{$key} {
    animation: #{$key} $value;
  }
}

// Responsive utilities
@each $breakpoint, $value in $breakpoints {
  @media (min-width: $value) {
    .#{$breakpoint}\:hidden { display: none; }
    .#{$breakpoint}\:block { display: block; }
    .#{$breakpoint}\:inline-block { display: inline-block; }
    .#{$breakpoint}\:flex { display: flex; }
    .#{$breakpoint}\:grid { display: grid; }
  }
}
```

### Animation System
```typescript
// animations/animations.ts
import { keyframes } from '@emotion/react';

export const animations = {
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  
  fadeOut: keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
  `,
  
  slideInUp: keyframes`
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  `,
  
  slideInDown: keyframes`
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  `,
  
  scaleIn: keyframes`
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  `,
  
  pulse: keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  `,
  
  shake: keyframes`
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  `,
  
  bounce: keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  `,
};

// Framer Motion variants
export const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};
```

## Communication with Other Agents

### Output to Frontend Agent
- Design tokens
- Component specifications
- Style guides
- Animation specs

### Input from Product Agent
- User requirements
- Brand guidelines
- UX research
- User feedback

### Coordination with Accessibility Agent
- WCAG compliance
- Color contrast
- Focus states
- Screen reader support

## Quality Checklist

Before completing any design task:
- [ ] Design tokens defined
- [ ] Components documented
- [ ] Responsive design tested
- [ ] Accessibility checked
- [ ] Dark mode supported
- [ ] Animations smooth
- [ ] Assets optimized
- [ ] Style guide updated
- [ ] Figma synced
- [ ] Design QA complete

## Best Practices

### Design System
- Maintain consistency
- Use semantic naming
- Document everything
- Version control designs
- Regular design reviews

### Component Design
- Start with primitives
- Build composable components
- Design for flexibility
- Consider all states
- Test across devices

## Tools and Resources

- Figma API documentation
- Storybook addons
- Design system examples
- Color theory guides
- Typography resources
- Animation libraries
- Accessibility tools
