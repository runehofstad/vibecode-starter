# Git Workflow Cheat Sheet

## Conventional Commits

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples
```bash
git commit -m "feat: add user authentication with Supabase"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify auth context logic"
git commit -m "test: add unit tests for auth service"
```

## Feature Branch Workflow

### Create Feature Branch
```bash
# Create and switch to new branch
git checkout -b feat/user-authentication

# Or from specific branch
git checkout -b fix/login-bug origin/develop
```

### Keep Branch Updated
```bash
# Update main branch
git checkout main
git pull origin main

# Rebase feature branch
git checkout feat/user-authentication
git rebase main

# Force push after rebase (if already pushed)
git push --force-with-lease origin feat/user-authentication
```

### Interactive Rebase
```bash
# Squash last 3 commits
git rebase -i HEAD~3

# Clean up commit history before PR
git rebase -i main
```

## Common Git Commands

### Status & History
```bash
# Check status
git status -s

# View commit history
git log --oneline --graph --all

# Show specific commit
git show <commit-hash>

# Search commits
git log --grep="authentication"
```

### Stashing
```bash
# Stash changes
git stash push -m "WIP: authentication form"

# List stashes
git stash list

# Apply stash
git stash pop

# Apply specific stash
git stash apply stash@{1}
```

### Undoing Changes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert specific commit
git revert <commit-hash>

# Discard local changes
git checkout -- <file>
git restore <file>  # newer syntax
```

## Pull Request Workflow

### Before Creating PR
```bash
# 1. Update and rebase
git checkout main
git pull origin main
git checkout feat/user-authentication
git rebase main

# 2. Run tests
npm test
npm run lint
npm run typecheck

# 3. Clean up commits
git rebase -i main

# 4. Push branch
git push origin feat/user-authentication
```

### Create PR via CLI (using gh)
```bash
# Install GitHub CLI
brew install gh  # macOS

# Authenticate
gh auth login

# Create PR
gh pr create --title "feat: add user authentication" \
  --body "## Summary
- Implemented Supabase authentication
- Added login/signup forms
- Protected routes

## Testing
- [x] Unit tests pass
- [x] Manual testing completed"

# Create draft PR
gh pr create --draft

# List PRs
gh pr list

# View PR
gh pr view <number>

# Check PR status
gh pr checks
```

### Review and Merge
```bash
# Checkout PR locally
gh pr checkout <number>

# Approve PR
gh pr review --approve

# Merge PR
gh pr merge --squash --delete-branch
```

## Git Aliases (add to ~/.gitconfig)
```ini
[alias]
  st = status -s
  co = checkout
  br = branch
  ci = commit
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = !gitk
  lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
  undo = reset --soft HEAD~1
  amend = commit --amend --no-edit
  
  # Feature branch workflow
  feature = checkout -b
  update = !git checkout main && git pull origin main
  sync = !git checkout main && git pull origin main && git checkout - && git rebase main
  
  # Cleanup
  cleanup = !git branch --merged | grep -v '\\*\\|main\\|develop' | xargs -n 1 git branch -d
```

## Best Practices

### Commit Messages
```bash
# Good
git commit -m "feat: implement user profile image upload with Supabase Storage"

# Bad
git commit -m "updated stuff"
git commit -m "fix"
```

### Branch Naming
```bash
# Good
feat/user-authentication
fix/login-redirect-issue
chore/update-dependencies
refactor/auth-service

# Bad
myfeature
test
fix-stuff
```

### Before Pushing
1. Run tests: `npm test`
2. Run linter: `npm run lint`
3. Check types: `npm run typecheck`
4. Review changes: `git diff --staged`
5. Write clear commit message

### Handling Merge Conflicts
```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Rebase feature branch
git checkout feat/user-authentication
git rebase main

# 3. Resolve conflicts
# Edit conflicted files
git add <resolved-files>
git rebase --continue

# 4. If things go wrong
git rebase --abort
```

## Emergency Commands

### When You Mess Up
```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Nuclear option - reset to remote
git fetch origin
git reset --hard origin/main

# Find lost commits
git reflog

# Recover lost commit
git checkout <commit-hash>
```

### Clean Working Directory
```bash
# Remove untracked files (dry run)
git clean -n

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd
```