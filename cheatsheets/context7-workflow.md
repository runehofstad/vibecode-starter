# Context7 Workflow for Claude Code

## What is Context7?
Context7 generates up-to-date documentation contexts for LLMs and AI code editors, ensuring Claude Code has access to the latest API documentation and best practices.

## Setup Workflow

### 1. Generate Context for Your Stack
1. Visit https://context7.com
2. Add libraries for your project:
   - React 18
   - TypeScript
   - Supabase
   - Vite
   - Tailwind CSS
   - shadcn/ui
   - React Router
   - Expo (for mobile projects)

### 2. Copy Generated Context
Context7 will provide formatted documentation that you can:
- Include directly in your Claude Code prompts
- Save as reference files in your project
- Add to your CLAUDE.md for persistent context

### 3. Usage Examples

#### When Starting a New Feature
```bash
# 1. Generate fresh context from Context7
# 2. Start Claude Code with context
claude -p "Using the latest React 18 and Supabase documentation: [paste Context7 output]

Create a user profile component with real-time updates"
```

#### For Specific API Questions
```bash
# Get updated Supabase Auth documentation
claude -p "Based on current Supabase Auth docs: [Context7 output]

How do I implement OAuth with GitHub?"
```

#### Mobile Development
```bash
# Get latest Expo SDK documentation
claude -p "Using Expo SDK 50 docs: [Context7 output]

Set up push notifications with expo-notifications"
```

## Best Practices

### 1. Regular Updates
- Refresh Context7 documentation weekly
- Always use fresh contexts for new features
- Update when libraries have major releases

### 2. Project-Specific Contexts
Create dedicated context files:
```bash
# Save contexts for reuse
mkdir -p docs/context7
touch docs/context7/react-latest.md
touch docs/context7/supabase-latest.md
touch docs/context7/expo-latest.md
```

### 3. Combine with CLAUDE.md
Reference Context7 in your CLAUDE.md:
```markdown
## External Documentation
Latest API docs available via Context7:
- React 18: See docs/context7/react-latest.md
- Supabase: See docs/context7/supabase-latest.md
```

### 4. Version-Specific Contexts
When working with specific versions:
1. Generate context for exact version needed
2. Include version info in prompts
3. Save version-specific contexts

## Integration Tips

### For New Projects
1. Define your tech stack
2. Generate complete Context7 documentation set
3. Create initial CLAUDE.md with context references
4. Start development with accurate API knowledge

### For Existing Projects
1. Audit current dependencies
2. Generate contexts for all major libraries
3. Update outdated code patterns based on latest docs
4. Refactor using Claude Code with fresh contexts

### For Team Collaboration
1. Share Context7 configurations
2. Standardize context update schedule
3. Include context files in version control
4. Document context generation process

## Example Workflow

```bash
# Monday: Start new feature
1. Check for library updates
2. Generate fresh Context7 docs
3. Update local context files

# Development
claude -p "Using these current docs: [Context7]
Implement [feature] following latest best practices"

# Before PR
claude -p "Review this code against current docs: [Context7]
Ensure we're using latest API patterns"
```

## Troubleshooting

### Outdated Suggestions
- Regenerate Context7 documentation
- Specify library versions explicitly
- Cross-reference with official changelogs

### Conflicting Information
- Trust Context7 for latest API syntax
- Use official docs for conceptual understanding
- Test generated code thoroughly

### Missing Libraries
- Request additions on Context7
- Supplement with official documentation
- Create custom context snippets

## Benefits

1. **Always Current**: No more outdated API calls
2. **Best Practices**: Latest patterns and recommendations
3. **Type Safety**: Current TypeScript definitions
4. **Performance**: Latest optimization techniques
5. **Security**: Updated security practices

Remember: Context7 + Claude Code = Always coding with the latest knowledge!