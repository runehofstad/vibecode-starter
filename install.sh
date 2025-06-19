#!/bin/bash
# CLAUDE CODE STARTER Installation Script

echo "🚀 Installing CLAUDE CODE STARTER..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo -e "${YELLOW}⚠️  Claude Code is not installed${NC}"
    echo "Please install it first with:"
    echo -e "${BLUE}npm install -g @anthropic-ai/claude-code${NC}"
    echo ""
    exit 1
fi

# Create directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p ~/.local/bin
mkdir -p ~/.claude

# Copy files
echo -e "${BLUE}📄 Installing files...${NC}"

# Install the setup script
cp scripts/setup-project.sh ~/.local/bin/claude-setup
chmod +x ~/.local/bin/claude-setup
echo "✓ Installed claude-setup command"

# Check if user already has a personal CLAUDE.md
if [ ! -f ~/.claude/CLAUDE.md ]; then
    echo -e "${BLUE}📝 Creating personal preferences file...${NC}"
    # Create a template personal CLAUDE.md
    cat > ~/.claude/CLAUDE.md << 'EOF'
# Personal Claude Code Preferences

## About Me
- Role: Developer
- Location: [Your Location]
- Preferred Language: English

## Development Preferences
- Editor: VS Code
- Terminal: zsh
- Package Manager: npm
- Git Workflow: Feature branches with conventional commits

## Code Style
- TypeScript: Strict mode always
- Formatting: Prettier with 2 spaces
- Linting: ESLint with recommended rules
- Comments: In English

## Project Defaults
Import project standards from CLAUDE CODE STARTER when available:
@./CLAUDE.md

---
Note: Customize this file to match your preferences!
EOF
    echo "✓ Created personal preferences template"
else
    echo "✓ Personal CLAUDE.md already exists (skipping)"
fi

# Update PATH if needed
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo -e "${BLUE}🔧 Updating PATH...${NC}"
    
    # Detect shell
    if [ -n "$ZSH_VERSION" ]; then
        SHELL_RC="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        SHELL_RC="$HOME/.bashrc"
    else
        SHELL_RC="$HOME/.profile"
    fi
    
    # Add to PATH
    echo "" >> "$SHELL_RC"
    echo "# Added by CLAUDE CODE STARTER" >> "$SHELL_RC"
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$SHELL_RC"
    echo "✓ Updated PATH in $SHELL_RC"
    echo ""
    echo -e "${YELLOW}⚠️  Please run: source $SHELL_RC${NC}"
    echo "   Or open a new terminal for PATH changes to take effect"
fi

# Create starter directory reference
STARTER_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "$STARTER_DIR" > ~/.claude/starter-location.txt
echo "✓ Saved starter location for future reference"

# Update setup script with correct path
sed -i.bak "s|~/Desktop/CLAUDE\\\\ CODE\\\\ STARTER|$STARTER_DIR|g" ~/.local/bin/claude-setup
rm ~/.local/bin/claude-setup.bak 2>/dev/null

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo "📚 Next steps:"
echo "1. If prompted above, run: source ~/.zshrc (or ~/.bashrc)"
echo "2. Create a new project: mkdir my-app && cd my-app"
echo "3. Run setup: claude-setup"
echo "4. Start coding: claude"
echo ""
echo "📖 Documentation:"
echo "   • User Guide: $STARTER_DIR/BRUKERVEILEDNING.md"
echo "   • Quick Start: $STARTER_DIR/NYTT-PROSJEKT-GUIDE.md"
echo "   • Cheat Sheets: $STARTER_DIR/cheatsheets/"
echo ""
echo "Happy coding! 🚀"