#!/bin/bash
# Quick project setup script with Context7

echo "🚀 Setting up new project with Claude Code standards..."

# Add Context7 MCP server
echo "📚 Adding Context7 for documentation..."
claude mcp add context7 -- npx -y @upstash/context7-mcp

# Create project structure if needed
if [ ! -f "CLAUDE.md" ]; then
    echo "📝 Creating CLAUDE.md..."
    cp ~/Desktop/CLAUDE\ CODE\ STARTER/CLAUDE.md .
fi

# Create changelog if needed
if [ ! -f "Changelog.txt" ]; then
    echo "📋 Creating Changelog.txt..."
    touch Changelog.txt
    echo "# Changelog" > Changelog.txt
    echo "" >> Changelog.txt
    echo "[$(date +%Y-%m-%d)] - Project initialized with Claude Code standards (commit: pending)" >> Changelog.txt
fi

echo "✅ Project ready for Claude Code!"
echo ""
echo "Next steps:"
echo "1. Run 'claude' to start coding"
echo "2. Context7 is now available for up-to-date documentation"