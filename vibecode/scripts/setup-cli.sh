#!/bin/bash

# Vibecode CLI Setup Helper
# Detects needed CLIs and helps install them

echo "🔍 Checking for required CLI tools..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check if command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}  ✓ $1 installed${NC}"
        return 0
    else
        echo -e "${RED}  ✗ $1 not found${NC}"
        return 1
    fi
}

# Function to suggest installation
suggest_install() {
    echo -e "${YELLOW}  → To install: $2${NC}"
}

# Check package.json for dependencies
if [ -f package.json ]; then

    # Check for Supabase
    if grep -q "@supabase/supabase-js" package.json; then
        echo ""
        echo "📦 Supabase detected"
        if ! check_command "supabase"; then
            suggest_install "supabase" "npm install -g supabase"
            echo "     Then run: supabase login"
        fi
    fi

    # Check for Firebase
    if grep -q "firebase" package.json; then
        echo ""
        echo "📦 Firebase detected"
        if ! check_command "firebase"; then
            suggest_install "firebase" "npm install -g firebase-tools"
            echo "     Then run: firebase login"
        fi
    fi

    # Check for Vercel
    if grep -q "\"build\": \"next build\"" package.json || [ -f "vercel.json" ]; then
        echo ""
        echo "📦 Vercel/Next.js detected"
        if ! check_command "vercel"; then
            suggest_install "vercel" "npm install -g vercel"
            echo "     Then run: vercel login"
        fi
    fi
fi

# Check for GitHub
echo ""
echo "📦 GitHub integration"
if ! check_command "gh"; then
    suggest_install "gh" "brew install gh (Mac) or see: https://cli.github.com"
    echo "     Then run: gh auth login"
fi

# Check for Docker
if [ -f "Dockerfile" ] || [ -f "docker-compose.yml" ]; then
    echo ""
    echo "📦 Docker detected"
    if ! check_command "docker"; then
        suggest_install "docker" "Download Docker Desktop from docker.com"
    fi
fi

# Check for AWS
if [ -f "serverless.yml" ] || [ -d ".aws" ]; then
    echo ""
    echo "📦 AWS detected"
    if ! check_command "aws"; then
        suggest_install "aws" "brew install awscli (Mac) or pip install awscli"
        echo "     Then run: aws configure"
    fi
fi

echo ""
echo "💡 Tip: Run this script again after installing CLIs to verify"
echo ""

# Ask if user wants to install missing CLIs
echo "Would you like to install missing CLIs now? (y/n)"
read -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Installing missing CLIs..."

    # Auto-install Node-based CLIs
    if [ -f package.json ]; then
        if grep -q "@supabase/supabase-js" package.json && ! command -v supabase &> /dev/null; then
            echo "Installing Supabase CLI..."
            npm install -g supabase
        fi

        if grep -q "firebase" package.json && ! command -v firebase &> /dev/null; then
            echo "Installing Firebase CLI..."
            npm install -g firebase-tools
        fi

        if (grep -q "next" package.json || [ -f "vercel.json" ]) && ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
    fi

    echo ""
    echo "✅ Installation complete! Don't forget to login to each service."
fi