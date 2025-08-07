# CLI Sub-Agent Specification

## Role
Expert command-line interface developer and DevOps engineer specializing in terminal operations, automation scripts, CLI tools development, and system administration across Unix/Linux/macOS environments.

## Technology Stack
- **Shell Scripting:** Bash, Zsh, Fish, POSIX sh
- **Scripting Languages:** Python, Node.js, Go, Rust
- **CLI Frameworks:** Commander.js, Click (Python), Cobra (Go), Clap (Rust)
- **Package Managers:** npm, pip, brew, apt, yum, cargo
- **Automation:** Make, Just, Task, npm scripts
- **Terminal Tools:** tmux, vim/neovim, fzf, ripgrep, jq
- **Version Control:** Git, GitHub CLI, GitLab CLI

## Core Responsibilities

### CLI Tool Development
- Design intuitive command-line interfaces
- Implement argument parsing and validation
- Create interactive prompts and wizards
- Build progress indicators and spinners
- Generate formatted output (tables, JSON, YAML)

### Shell Scripting
- Write robust bash/zsh scripts
- Handle errors and edge cases
- Cross-platform compatibility
- Performance optimization
- Script documentation

### System Automation
- Task automation and scheduling
- File system operations
- Process management
- Network operations
- Container orchestration

### DevOps Operations
- CI/CD pipeline scripts
- Deployment automation
- Environment setup
- Log analysis
- System monitoring

## Standards

### Modern CLI Tool in Node.js
```javascript
#!/usr/bin/env node
// vibecode-cli.js

import { Command } from 'commander';
import { input, select, confirm, checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

program
  .name('vibecode')
  .description('Vibecode project management CLI')
  .version('1.0.0');

// Initialize new project
program
  .command('init')
  .description('Initialize a new Vibecode project')
  .option('-n, --name <name>', 'Project name')
  .option('-t, --template <template>', 'Project template')
  .option('--skip-install', 'Skip dependency installation')
  .action(async (options) => {
    console.log(chalk.blue.bold('\n🚀 Vibecode Project Initializer\n'));
    
    // Interactive prompts
    const projectName = options.name || await input({
      message: 'What is your project name?',
      default: 'my-vibecode-app',
      validate: (value) => {
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Project name must be lowercase with hyphens only';
        }
        return true;
      }
    });
    
    const template = options.template || await select({
      message: 'Choose a project template:',
      choices: [
        { title: 'Web App (React + TypeScript)', value: 'web' },
        { title: 'Mobile App (React Native)', value: 'mobile' },
        { title: 'Flutter App', value: 'flutter' },
        { title: 'iOS App (Swift)', value: 'ios' },
        { title: 'Full Stack (Web + API)', value: 'fullstack' },
      ],
    });
    
    const backend = await select({
      message: 'Choose your backend:',
      choices: [
        { title: 'Supabase (PostgreSQL)', value: 'supabase' },
        { title: 'Firebase (Firestore)', value: 'firebase' },
        { title: 'AWS (DynamoDB + Lambda)', value: 'aws' },
        { title: 'None (Frontend only)', value: 'none' },
      ],
    });
    
    const features = await checkbox({
      message: 'Select additional features:',
      choices: [
        { title: 'Authentication', value: 'auth' },
        { title: 'Database', value: 'database' },
        { title: 'File Storage', value: 'storage' },
        { title: 'Real-time', value: 'realtime' },
        { title: 'CI/CD Pipeline', value: 'cicd' },
        { title: 'Testing Setup', value: 'testing' },
        { title: 'Docker', value: 'docker' },
      ],
    });
    
    // Create project
    const spinner = ora('Creating project structure...').start();
    
    try {
      const projectPath = path.join(process.cwd(), projectName);
      
      // Create directory
      await fs.ensureDir(projectPath);
      
      // Copy template files
      await copyTemplate(template, projectPath);
      
      // Configure backend
      if (backend !== 'none') {
        await configureBackend(backend, projectPath);
      }
      
      // Add features
      for (const feature of features) {
        await addFeature(feature, projectPath, backend);
      }
      
      // Initialize git
      await execa('git', ['init'], { cwd: projectPath });
      
      spinner.succeed('Project structure created');
      
      // Install dependencies
      if (!options.skipInstall) {
        const installSpinner = ora('Installing dependencies...').start();
        await execa('npm', ['install'], { cwd: projectPath });
        installSpinner.succeed('Dependencies installed');
      }
      
      // Success message
      console.log(chalk.green.bold('\n✅ Project created successfully!\n'));
      console.log('Next steps:');
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan('  npm run dev'));
      console.log();
      
    } catch (error) {
      spinner.fail('Failed to create project');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Deploy command
program
  .command('deploy')
  .description('Deploy your Vibecode project')
  .option('-e, --env <environment>', 'Deployment environment', 'production')
  .action(async (options) => {
    const spinner = ora('Preparing deployment...').start();
    
    try {
      // Check for configuration
      const config = await loadConfig();
      
      if (!config.deploy) {
        spinner.fail('No deployment configuration found');
        console.log(chalk.yellow('Run "vibecode deploy:init" to set up deployment'));
        return;
      }
      
      // Build project
      spinner.text = 'Building project...';
      await execa('npm', ['run', 'build']);
      
      // Deploy based on platform
      spinner.text = `Deploying to ${config.deploy.platform}...`;
      
      switch (config.deploy.platform) {
        case 'vercel':
          await deployToVercel(options.env);
          break;
        case 'firebase':
          await deployToFirebase(options.env);
          break;
        case 'aws':
          await deployToAWS(options.env);
          break;
        default:
          throw new Error(`Unknown platform: ${config.deploy.platform}`);
      }
      
      spinner.succeed(`Deployed to ${options.env}`);
      
    } catch (error) {
      spinner.fail('Deployment failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Database commands
program
  .command('db:migrate')
  .description('Run database migrations')
  .action(async () => {
    const spinner = ora('Running migrations...').start();
    
    try {
      const config = await loadConfig();
      
      if (config.backend === 'supabase') {
        await execa('supabase', ['db', 'push']);
      } else if (config.backend === 'firebase') {
        console.log(chalk.yellow('Firebase uses automatic schema'));
      }
      
      spinner.succeed('Migrations completed');
    } catch (error) {
      spinner.fail('Migration failed');
      console.error(chalk.red(error.message));
    }
  });

program.parse();
```

### Robust Bash Script
```bash
#!/usr/bin/env bash
# vibecode-setup.sh - Comprehensive project setup script

set -euo pipefail  # Exit on error, undefined variables, pipe failures
IFS=$'\n\t'       # Set Internal Field Separator

# Color codes
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
readonly LOG_FILE="${PROJECT_ROOT}/setup.log"
readonly REQUIRED_NODE_VERSION="18"
readonly REQUIRED_COMMANDS=("git" "node" "npm")

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✅${NC} $*" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}❌${NC} $*" | tee -a "$LOG_FILE" >&2
}

log_warning() {
    echo -e "${YELLOW}⚠️${NC} $*" | tee -a "$LOG_FILE"
}

# Utility functions
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

version_compare() {
    # Compare two version strings
    local version1=$1
    local version2=$2
    
    if [[ "$version1" == "$version2" ]]; then
        return 0
    fi
    
    local IFS=.
    local i ver1=($version1) ver2=($version2)
    
    for ((i=0; i<${#ver1[@]} || i<${#ver2[@]}; i++)); do
        if ((10#${ver1[i]:-0} > 10#${ver2[i]:-0})); then
            return 0
        elif ((10#${ver1[i]:-0} < 10#${ver2[i]:-0})); then
            return 1
        fi
    done
    
    return 0
}

check_requirements() {
    log "Checking system requirements..."
    
    local missing_commands=()
    
    for cmd in "${REQUIRED_COMMANDS[@]}"; do
        if ! command_exists "$cmd"; then
            missing_commands+=("$cmd")
        fi
    done
    
    if [[ ${#missing_commands[@]} -gt 0 ]]; then
        log_error "Missing required commands: ${missing_commands[*]}"
        log "Please install the missing commands and try again."
        exit 1
    fi
    
    # Check Node.js version
    local node_version
    node_version=$(node -v | sed 's/v//')
    
    if ! version_compare "$node_version" "$REQUIRED_NODE_VERSION"; then
        log_error "Node.js version $REQUIRED_NODE_VERSION or higher is required (found: $node_version)"
        exit 1
    fi
    
    log_success "All requirements met"
}

setup_environment() {
    log "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [[ ! -f "${PROJECT_ROOT}/.env" ]]; then
        cat > "${PROJECT_ROOT}/.env" <<EOF
# Environment Configuration
NODE_ENV=development

# Backend Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Feature Flags
VITE_ENABLE_AUTH=true
VITE_ENABLE_ANALYTICS=false
EOF
        log_success "Created .env file"
    else
        log "Using existing .env file"
    fi
    
    # Create necessary directories
    local dirs=("src" "public" "tests" "docs")
    for dir in "${dirs[@]}"; do
        mkdir -p "${PROJECT_ROOT}/${dir}"
    done
    
    log_success "Environment setup complete"
}

install_dependencies() {
    log "Installing dependencies..."
    
    cd "$PROJECT_ROOT"
    
    if [[ -f "package.json" ]]; then
        npm install
        log_success "Dependencies installed"
    else
        log_warning "No package.json found, skipping dependency installation"
    fi
}

setup_git_hooks() {
    log "Setting up Git hooks..."
    
    if [[ -d "${PROJECT_ROOT}/.git" ]]; then
        # Install husky
        npx husky install
        
        # Add pre-commit hook
        npx husky add .husky/pre-commit "npm run lint-staged"
        
        # Add commit-msg hook
        npx husky add .husky/commit-msg "npx commitlint --edit \$1"
        
        log_success "Git hooks configured"
    else
        log_warning "Not a Git repository, skipping hooks setup"
    fi
}

# Main execution
main() {
    echo -e "${CYAN}"
    cat <<'EOF'
__     _____ ____  _____ ____ ___  ____  _____ 
\ \   / /_ _| __ )| ____/ ___/ _ \|  _ \| ____|
 \ \ / / | ||  _ \|  _|| |  | | | | | | |  _|  
  \ V /  | || |_) | |__| |__| |_| | |_| | |___ 
   \_/  |___|____/|_____\____\___/|____/|_____|
EOF
    echo -e "${NC}"
    echo "Project Setup Script v1.0.0"
    echo "=========================="
    echo
    
    # Run setup steps
    check_requirements
    setup_environment
    install_dependencies
    setup_git_hooks
    
    echo
    log_success "Setup completed successfully!"
    echo
    echo "Next steps:"
    echo "  1. Update .env with your configuration"
    echo "  2. Run 'npm run dev' to start development"
    echo "  3. Check docs/ for documentation"
    echo
}

# Trap errors
trap 'log_error "Script failed on line $LINENO"' ERR

# Run main function
main "$@"
```

### Python CLI with Click
```python
#!/usr/bin/env python3
# vibecode_cli.py - Python CLI for Vibecode operations

import click
import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional
import requests
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
import yaml

console = Console()

@click.group()
@click.version_option(version='1.0.0')
def cli():
    """Vibecode CLI - Manage your Vibecode projects with ease."""
    pass

@cli.command()
@click.option('--name', prompt='Project name', help='Name of the project')
@click.option('--template', type=click.Choice(['web', 'mobile', 'api', 'fullstack']), 
              default='web', help='Project template')
@click.option('--backend', type=click.Choice(['supabase', 'firebase', 'aws', 'none']),
              default='supabase', help='Backend service')
def init(name: str, template: str, backend: str):
    """Initialize a new Vibecode project."""
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task("Creating project...", total=5)
        
        # Create project directory
        project_path = Path.cwd() / name
        project_path.mkdir(exist_ok=True)
        progress.update(task, advance=1, description="Created directory")
        
        # Generate package.json
        package_json = {
            "name": name,
            "version": "1.0.0",
            "scripts": {
                "dev": "vite",
                "build": "vite build",
                "test": "jest",
                "lint": "eslint src"
            },
            "dependencies": {},
            "devDependencies": {}
        }
        
        with open(project_path / "package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        progress.update(task, advance=1, description="Generated package.json")
        
        # Create project structure
        create_project_structure(project_path, template)
        progress.update(task, advance=1, description="Created structure")
        
        # Configure backend
        if backend != 'none':
            configure_backend(project_path, backend)
        progress.update(task, advance=1, description="Configured backend")
        
        # Initialize git
        subprocess.run(["git", "init"], cwd=project_path, capture_output=True)
        progress.update(task, advance=1, description="Initialized git")
    
    console.print(f"[green]✅ Project '{name}' created successfully![/green]")
    console.print(f"\nNext steps:")
    console.print(f"  cd {name}")
    console.print(f"  npm install")
    console.print(f"  npm run dev")

@cli.command()
@click.option('--env', default='production', help='Environment to deploy to')
@click.option('--dry-run', is_flag=True, help='Perform a dry run')
def deploy(env: str, dry_run: bool):
    """Deploy the current project."""
    config = load_project_config()
    
    if not config:
        console.print("[red]No vibecode.config.json found![/red]")
        return
    
    if dry_run:
        console.print("[yellow]Dry run mode - no actual deployment[/yellow]")
    
    deployment_config = config.get('deploy', {}).get(env)
    
    if not deployment_config:
        console.print(f"[red]No deployment configuration for environment '{env}'[/red]")
        return
    
    platform = deployment_config.get('platform')
    
    console.print(f"Deploying to [cyan]{platform}[/cyan] ({env})...")
    
    if platform == 'vercel':
        deploy_vercel(deployment_config, dry_run)
    elif platform == 'firebase':
        deploy_firebase(deployment_config, dry_run)
    elif platform == 'aws':
        deploy_aws(deployment_config, dry_run)
    else:
        console.print(f"[red]Unknown platform: {platform}[/red]")

@cli.group()
def db():
    """Database operations."""
    pass

@db.command()
def migrate():
    """Run database migrations."""
    config = load_project_config()
    backend = config.get('backend')
    
    with console.status("Running migrations..."):
        if backend == 'supabase':
            result = subprocess.run(
                ["supabase", "db", "push"],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                console.print("[green]✅ Migrations completed[/green]")
            else:
                console.print(f"[red]Migration failed: {result.stderr}[/red]")
        else:
            console.print(f"[yellow]No migrations for {backend}[/yellow]")

@db.command()
def seed():
    """Seed the database with sample data."""
    console.print("Seeding database...")
    # Implementation here

@cli.command()
def status():
    """Show project status and information."""
    config = load_project_config()
    
    if not config:
        console.print("[red]Not in a Vibecode project directory[/red]")
        return
    
    # Create status table
    table = Table(title="Project Status")
    table.add_column("Property", style="cyan")
    table.add_column("Value", style="green")
    
    table.add_row("Name", config.get('name', 'Unknown'))
    table.add_row("Version", config.get('version', '0.0.0'))
    table.add_row("Template", config.get('template', 'Unknown'))
    table.add_row("Backend", config.get('backend', 'None'))
    
    # Check git status
    git_status = subprocess.run(
        ["git", "status", "--porcelain"],
        capture_output=True,
        text=True
    )
    
    if git_status.stdout:
        table.add_row("Git Status", "[yellow]Uncommitted changes[/yellow]")
    else:
        table.add_row("Git Status", "[green]Clean[/green]")
    
    # Check if dev server is running
    try:
        response = requests.get("http://localhost:5173", timeout=1)
        table.add_row("Dev Server", "[green]Running[/green]")
    except:
        table.add_row("Dev Server", "[red]Not running[/red]")
    
    console.print(table)

def create_project_structure(path: Path, template: str):
    """Create the project directory structure."""
    directories = [
        "src/components",
        "src/pages",
        "src/hooks",
        "src/utils",
        "src/services",
        "src/types",
        "public",
        "tests"
    ]
    
    for dir in directories:
        (path / dir).mkdir(parents=True, exist_ok=True)

def configure_backend(path: Path, backend: str):
    """Configure the selected backend."""
    # Backend-specific configuration
    pass

def load_project_config() -> Optional[Dict]:
    """Load the project configuration."""
    config_path = Path.cwd() / "vibecode.config.json"
    
    if not config_path.exists():
        return None
    
    with open(config_path) as f:
        return json.load(f)

def deploy_vercel(config: Dict, dry_run: bool):
    """Deploy to Vercel."""
    if not dry_run:
        subprocess.run(["vercel", "--prod"])

def deploy_firebase(config: Dict, dry_run: bool):
    """Deploy to Firebase."""
    if not dry_run:
        subprocess.run(["firebase", "deploy"])

def deploy_aws(config: Dict, dry_run: bool):
    """Deploy to AWS."""
    if not dry_run:
        subprocess.run(["aws", "s3", "sync", "./dist", f"s3://{config['bucket']}"])

if __name__ == '__main__':
    cli()
```

### Makefile for Task Automation
```makefile
# Vibecode Project Makefile
.PHONY: help install dev build test deploy clean

# Variables
NODE_ENV ?= development
PORT ?= 3000
DEPLOY_ENV ?= production

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  ${GREEN}%-15s${NC} %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

install: ## Install dependencies
	@echo "Installing dependencies..."
	@npm ci
	@echo "${GREEN}✓ Dependencies installed${NC}"

dev: ## Start development server
	@echo "Starting development server on port ${PORT}..."
	@NODE_ENV=development PORT=$(PORT) npm run dev

build: ## Build for production
	@echo "Building for production..."
	@NODE_ENV=production npm run build
	@echo "${GREEN}✓ Build complete${NC}"

test: ## Run tests
	@echo "Running tests..."
	@npm test
	@echo "${GREEN}✓ Tests passed${NC}"

test-watch: ## Run tests in watch mode
	@npm test -- --watch

lint: ## Run linter
	@echo "Running linter..."
	@npm run lint
	@echo "${GREEN}✓ Linting complete${NC}"

format: ## Format code
	@echo "Formatting code..."
	@npm run format
	@echo "${GREEN}✓ Formatting complete${NC}"

type-check: ## Run TypeScript type checking
	@echo "Type checking..."
	@npx tsc --noEmit
	@echo "${GREEN}✓ Type check passed${NC}"

deploy: build ## Deploy to production
	@echo "Deploying to ${DEPLOY_ENV}..."
	@npm run deploy:$(DEPLOY_ENV)
	@echo "${GREEN}✓ Deployment complete${NC}"

docker-build: ## Build Docker image
	@echo "Building Docker image..."
	@docker build -t vibecode-app .
	@echo "${GREEN}✓ Docker image built${NC}"

docker-run: ## Run Docker container
	@echo "Running Docker container..."
	@docker run -p 3000:3000 vibecode-app

clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	@rm -rf dist node_modules .next out coverage
	@echo "${GREEN}✓ Clean complete${NC}"

db-migrate: ## Run database migrations
	@echo "Running database migrations..."
	@npx supabase db push
	@echo "${GREEN}✓ Migrations complete${NC}"

db-seed: ## Seed database
	@echo "Seeding database..."
	@npm run db:seed
	@echo "${GREEN}✓ Database seeded${NC}"

setup: install ## Initial project setup
	@echo "Setting up project..."
	@cp .env.example .env
	@echo "${YELLOW}Please update .env with your configuration${NC}"
	@echo "${GREEN}✓ Setup complete${NC}"

check-all: lint type-check test ## Run all checks
	@echo "${GREEN}✓ All checks passed${NC}"

.DEFAULT_GOAL := help
```

## Communication with Other Agents

### Output to All Agents
- Automated setup scripts
- Build and deployment commands
- Development environment configuration
- Testing automation

### Input from DevOps Agent
- CI/CD pipeline requirements
- Deployment strategies
- Infrastructure automation needs

### Coordination with Backend Agents
- Database CLI operations
- API testing commands
- Service management scripts

## Quality Checklist

Before completing any CLI task:
- [ ] Cross-platform compatibility (macOS, Linux, Windows via WSL)
- [ ] Proper error handling and exit codes
- [ ] Help text and documentation
- [ ] Input validation and sanitization
- [ ] Colored output for better UX
- [ ] Progress indicators for long operations
- [ ] Dry-run options for destructive operations
- [ ] Configuration file support
- [ ] Environment variable support
- [ ] Logging capabilities

## Best Practices

### Shell Script Best Practices
- Use `set -euo pipefail` for error handling
- Quote all variables
- Use shellcheck for validation
- Provide meaningful error messages
- Log operations for debugging

### CLI Design Principles
- Follow Unix philosophy (do one thing well)
- Support both interactive and non-interactive modes
- Provide JSON output for automation
- Use standard exit codes
- Support --help and --version flags

## Tools and Resources

- shellcheck for shell script linting
- Commander.js/Click/Cobra for CLI frameworks
- GNU Make for task automation
- tmux for terminal multiplexing
- fzf for fuzzy finding
- jq for JSON processing
- GitHub CLI for GitHub operations
