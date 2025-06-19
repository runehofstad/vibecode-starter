# 🛠️ Installing Claude Code Setup

## Quick Installation (Recommended)

### 1. Open Terminal
Press `Cmd + Space`, type "Terminal" and press Enter

### 2. Run installation command
```bash
# Reload shell profile
source ~/.zshrc

# Test that the script works
claude-setup
```

If `claude-setup` works, you're ready! 🎉

---

## How it works

### Script location
The script is now located in two places:
1. **Original**: `~/Desktop/CLAUDE CODE STARTER/scripts/setup-project.sh`
2. **Installed**: `~/.local/bin/claude-setup`

### PATH explained
- `PATH` is a list of directories where the terminal looks for commands
- We added `~/.local/bin` to PATH
- Now you can run `claude-setup` from anywhere

---

## Practical usage

### Scenario: New project
```bash
# 1. Create directory anywhere
mkdir ~/Projects/my-new-app
cd ~/Projects/my-new-app

# 2. Run setup (works from any directory!)
claude-setup

# 3. Start Claude Code
claude
```

### From VS Code Terminal
1. Open VS Code
2. `Cmd + J` to open terminal
3. Navigate to project directory
4. Run `claude-setup`

### From macOS Finder
1. Right-click on folder in Finder
2. Select "New Terminal at Folder"
3. Run `claude-setup`

---

## Alternative: Alias (Simpler names)

If you prefer other names:

```bash
# Add to ~/.zshrc
alias setup-claude="claude-setup"
alias new-app="claude-setup"
alias claude-init="claude-setup"
```

Then you can use:
- `setup-claude`
- `new-app`
- `claude-init`

---

## Troubleshooting

### "command not found: claude-setup"
```bash
# Check that the file exists
ls ~/.local/bin/claude-setup

# Make it executable
chmod +x ~/.local/bin/claude-setup

# Reload shell
source ~/.zshrc
```

### Want to uninstall
```bash
# Remove the script
rm ~/.local/bin/claude-setup

# Remove PATH change from ~/.zshrc
# (Open the file and delete the line with export PATH="$HOME/.local/bin:$PATH")
```

---

## Tips

### See where the script is located
```bash
which claude-setup
# Output: /Users/runestudiox/.local/bin/claude-setup
```

### Update the script
```bash
# Copy new version
cp ~/Desktop/CLAUDE\ CODE\ STARTER/scripts/setup-project.sh ~/.local/bin/claude-setup
```

### Create shortcuts for other scripts
```bash
# Example: Create shortcut for git workflow
cp ~/Desktop/CLAUDE\ CODE\ STARTER/cheatsheets/git-workflow-cheatsheet.md ~/.local/bin/git-guide
chmod +x ~/.local/bin/git-guide
```

---

## Conclusion

Now you can:
- ✅ Run `claude-setup` from any directory
- ✅ Start new projects quickly
- ✅ Not worry about where the script is located

Happy coding! 🚀