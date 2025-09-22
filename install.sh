#!/bin/bash

# Vibecode Starter - Universal Installation Script
# Works with both Cursor IDE and Claude Code

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        🚀 VIBECODE STARTER 🚀           ║${NC}"
echo -e "${CYAN}║    AI-Powered Development Assistant     ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if vibecode folder exists
if [ ! -d "$SCRIPT_DIR/vibecode" ]; then
    echo -e "${RED}❌ Error: vibecode folder not found in $SCRIPT_DIR${NC}"
    exit 1
fi

# Detect which tools are available/in use
USES_CURSOR=false
USES_CLAUDE=false

echo -e "${BLUE}🔍 Detecting your AI development tools...${NC}"
echo ""

# Check for Cursor
if command -v cursor &> /dev/null || [ -f .cursorrules ] || [ -d .cursor ]; then
    USES_CURSOR=true
    echo -e "${GREEN}  ✓ Cursor IDE detected${NC}"
fi

# Check for Claude
if [ -d ~/.claude ] || [ -f CLAUDE.md ]; then
    USES_CLAUDE=true
    echo -e "${GREEN}  ✓ Claude Code detected${NC}"
fi

# If neither detected, ask user
if [ "$USES_CURSOR" = false ] && [ "$USES_CLAUDE" = false ]; then
    echo -e "${YELLOW}No AI tools detected. Which do you use?${NC}"
    echo "1) Cursor IDE"
    echo "2) Claude Code"
    echo "3) Both"
    echo "4) Skip configuration"
    read -p "Enter your choice (1-4): " choice

    case $choice in
        1) USES_CURSOR=true ;;
        2) USES_CLAUDE=true ;;
        3) USES_CURSOR=true; USES_CLAUDE=true ;;
        4) ;;
        *) echo -e "${YELLOW}Invalid choice, skipping configuration${NC}" ;;
    esac
fi

echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  No git repository found. Initializing git...${NC}"
    git init
fi

# Install Vibecode core
echo -e "${GREEN}📦 Installing Vibecode core...${NC}"

# Create .vibecode directory (hidden working directory)
if [ -d .vibecode ]; then
    echo -e "${YELLOW}⚠️  .vibecode directory already exists${NC}"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Installation cancelled${NC}"
        exit 1
    fi
    rm -rf .vibecode
fi

# Copy vibecode folder to .vibecode (hidden)
cp -r "$SCRIPT_DIR/vibecode" .vibecode
echo -e "${GREEN}  ✓ Core files installed${NC}"

# Configure for Cursor
if [ "$USES_CURSOR" = true ]; then
    echo ""
    echo -e "${MAGENTA}📝 Configuring for Cursor IDE...${NC}"

    # Create .cursorrules if it doesn't exist
    if [ ! -f .cursorrules ]; then
        cat > .cursorrules << 'EOF'
# Cursor Rules - Vibecode Configuration

This file will be auto-generated when you run setup.

## Quick Start

Run the following command to configure Vibecode for Cursor:

```bash
npm run vibecode:setup
```

---

*Powered by Vibecode Starter*
EOF
        echo -e "${GREEN}  ✓ Created .cursorrules template${NC}"
    fi
fi

# Configure for Claude Code
if [ "$USES_CLAUDE" = true ]; then
    echo ""
    echo -e "${BLUE}🤖 Configuring for Claude Code...${NC}"

    # Install agents globally for Claude
    echo -e "${CYAN}  Installing agents to ~/.claude/agents/...${NC}"
    node "$SCRIPT_DIR/vibecode/scripts/install-global.js" 2>/dev/null || {
        echo -e "${YELLOW}  ⚠️  Could not install globally, will use local setup${NC}"
    }

    # Create CLAUDE.md if it doesn't exist
    if [ ! -f CLAUDE.md ]; then
        cat > CLAUDE.md << 'EOF'
# Claude Code Configuration

This file will be auto-generated when you run initialization.

## Quick Start

Run the following command to configure Vibecode for Claude Code:

```bash
npm run vibecode:init
```

---

*Powered by Vibecode Starter*
EOF
        echo -e "${GREEN}  ✓ Created CLAUDE.md template${NC}"
    fi
fi

# Update package.json
echo ""
echo -e "${GREEN}📝 Updating package.json...${NC}"

if [ ! -f package.json ]; then
    cat > package.json << 'EOF'
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "vibecode:setup": "node .vibecode/scripts/setup.js",
    "vibecode:init": "node .vibecode/scripts/init.js",
    "vibecode:analyze": "node .vibecode/orchestrator/analyzer.js"
  },
  "devDependencies": {
    "chalk": "^5.3.0",
    "inquirer": "^9.2.12",
    "glob": "^10.3.10",
    "js-yaml": "^4.1.0"
  }
}
EOF
    npm install
else
    # Add scripts to existing package.json
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['vibecode:setup'] = 'node .vibecode/scripts/setup.js';
    pkg.scripts['vibecode:init'] = 'node .vibecode/scripts/init.js';
    pkg.scripts['vibecode:analyze'] = 'node .vibecode/orchestrator/analyzer.js';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "

    # Install dependencies
    echo -e "${GREEN}  Installing dependencies...${NC}"
    npm install chalk@5.3.0 inquirer@9.2.12 glob@10.3.10 js-yaml@4.1.0
fi

# Update .gitignore
echo ""
echo -e "${GREEN}📝 Updating .gitignore...${NC}"
if [ ! -f .gitignore ]; then
    touch .gitignore
fi

# Add entries to .gitignore
if ! grep -q ".vibecode/cache" .gitignore; then
    echo "" >> .gitignore
    echo "# Vibecode" >> .gitignore
    echo ".vibecode/cache/" >> .gitignore
    echo ".vibecode/temp/" >> .gitignore
    echo ".vibecode/logs/" >> .gitignore
fi

# Success message
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        ✅ INSTALLATION COMPLETE!         ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""

# Tool-specific instructions
if [ "$USES_CURSOR" = true ]; then
    echo -e "${MAGENTA}📝 For Cursor IDE:${NC}"
    echo -e "   Run: ${YELLOW}npm run vibecode:setup${NC}"
    echo -e "   This will generate optimized .cursorrules for your project"
    echo ""
fi

if [ "$USES_CLAUDE" = true ]; then
    echo -e "${BLUE}🤖 For Claude Code:${NC}"
    echo -e "   Run: ${YELLOW}npm run vibecode:init${NC}"
    echo -e "   This will configure intelligent routing for your project"
    echo ""
fi

echo -e "${CYAN}🎯 What you get:${NC}"
echo -e "   • 28 specialized AI agents"
echo -e "   • Intelligent project analysis"
echo -e "   • Automatic configuration"
echo -e "   • Best practices for your stack"
echo ""

echo -e "${GREEN}Happy coding with Vibecode! 🚀${NC}"