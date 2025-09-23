#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Install Vibecode agents globally for Claude Code
 * This enables the Task tool to actually use the agents
 */
async function installGlobalAgents() {
  console.log(chalk.blue.bold('\n🚀 Installing Vibecode Agents Globally for Claude Code\n'));

  // Paths
  const sourceAgentsPath = join(__dirname, '..', 'agents');
  const globalClaudePath = join(homedir(), '.claude');
  const globalAgentsPath = join(globalClaudePath, 'agents');

  // Create .claude/agents directory if it doesn't exist
  try {
    await fs.mkdir(globalAgentsPath, { recursive: true });
    console.log(chalk.green('✅ Created/verified ~/.claude/agents/ directory'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to create ~/.claude/agents/'), error);
    return;
  }

  // Get list of agent files
  const agentFiles = await fs.readdir(sourceAgentsPath);
  const mdFiles = agentFiles.filter(f => f.endsWith('.md'));

  console.log(chalk.yellow(`\n📦 Installing ${mdFiles.length} agents to global Claude directory...\n`));

  // Copy each agent file
  for (const file of mdFiles) {
    const sourcePath = join(sourceAgentsPath, file);
    const targetPath = join(globalAgentsPath, file);

    try {
      // Read the original content
      const content = await fs.readFile(sourcePath, 'utf8');

      // Add Vibecode header to identify our agents
      const enhancedContent = `# [VIBECODE] ${file.replace('.md', '').replace(/-/g, ' ').toUpperCase()}
<!-- Installed by Vibecode Claude Code Edition -->
<!-- Source: https://github.com/runehofstad/vibecode-claude-code -->

${content}`;

      // Write to global location
      await fs.writeFile(targetPath, enhancedContent);
      console.log(chalk.green('  ✓'), file);
    } catch (error) {
      console.error(chalk.red('  ✗'), file, error.message);
    }
  }

  // Create agent mapping for Claude Code
  const agentMapping = {};
  for (const file of mdFiles) {
    const agentName = file.replace('.md', '');
    agentMapping[agentName] = {
      file: file,
      path: join(globalAgentsPath, file),
      name: agentName.replace(/-agent$/, ''),
      type: 'vibecode'
    };
  }

  // Save mapping for reference
  const mappingPath = join(globalAgentsPath, 'vibecode-mapping.json');
  await fs.writeFile(mappingPath, JSON.stringify(agentMapping, null, 2));

  console.log(chalk.green('\n✅ Global installation complete!'));
  console.log(chalk.cyan('\n📍 Agents installed to:'), globalAgentsPath);
  console.log(chalk.cyan('📄 Mapping saved to:'), mappingPath);

  // Install Master Agent
  console.log(chalk.blue('\n🎯 Installing Master Agent...'));
  const masterAgentSource = join(__dirname, '..', 'MASTER_AGENT.md');
  const masterAgentTarget = join(globalAgentsPath, 'VIBECODE_MASTER_AGENT.md');

  if (await fs.access(masterAgentSource).then(() => true).catch(() => false)) {
    await fs.copyFile(masterAgentSource, masterAgentTarget);
    console.log(chalk.green('✅ Master Agent installed!'));
  }

  // Create CLAUDE.md with agent references
  await updateClaudeMdWithAgents(agentMapping);

  console.log(chalk.blue.bold('\n✨ Claude Code can now use all Vibecode agents!\n'));
  console.log('Usage in Claude Code:');
  console.log(chalk.yellow('  • Agents are available in ~/.claude/agents/'));
  console.log(chalk.yellow('  • Claude will read them as context'));
  console.log(chalk.yellow('  • Reference them in your prompts'));

  return agentMapping;
}

/**
 * Update CLAUDE.md to reference global agents
 */
async function updateClaudeMdWithAgents(agentMapping) {
  const projectRoot = process.cwd();
  const claudeMdPath = join(projectRoot, 'CLAUDE.md');

  let claudeMdContent = `# Claude Code Configuration - Vibecode Master Agent Active

## 🎯 MASTER AGENT ORCHESTRATION ENABLED

**IMPORTANT: The Vibecode Master Agent is installed and will orchestrate all agent interactions.**

You MUST read and follow the instructions in:
\`~/.claude/agents/VIBECODE_MASTER_AGENT.md\`

This file contains critical orchestration rules that you MUST follow for ALL tasks.

## Automatic Agent Selection

The Master Agent will automatically select and use these agents based on your work:

### File-Based Triggers
- \`*.tsx, *.jsx\` → frontend-agent + design-agent
- \`api/*, server/*\` → backend-agent + api-graphql-agent
- \`*.test.*, *.spec.*\` → testing-agent
- \`auth/*, security/*\` → security-agent + backend-agent

### Task-Based Triggers
- "authentication" → security-agent + backend-agent + frontend-agent
- "database" → data-agent + database-migration-agent
- "UI/component" → frontend-agent + design-agent
- "testing" → testing-agent
- "deployment" → devops-agent

## Installed Agents

The following specialized agents are available in ~/.claude/agents/:

`;

  for (const [key, agent] of Object.entries(agentMapping)) {
    claudeMdContent += `- **${agent.name}**: ~/.claude/agents/${agent.file}\n`;
  }

  claudeMdContent += `
## Expected Behavior

For EVERY task, you should:
1. Start with: "🤖 Vibecode Agent Orchestration: [agents being used]"
2. Read the relevant agent files from ~/.claude/agents/
3. Apply their patterns and guidelines
4. Mention which agent patterns you're following in your code

## Example

User: "Create a login form"

Your response should start with:
\`\`\`
🤖 Vibecode Agent Orchestration:
- Primary: frontend-agent
- Supporting: security-agent, testing-agent
- Reading agent instructions from ~/.claude/agents/
\`\`\`

Then implement following those agent patterns.

## Critical Reminder

**ALWAYS consult the Master Agent instructions at ~/.claude/agents/VIBECODE_MASTER_AGENT.md**

This is not optional - it's your primary operating instruction set.

---

*Powered by Vibecode Starter with Master Agent Orchestration*
`;

  await fs.writeFile(claudeMdPath, claudeMdContent);
  console.log(chalk.green('✅ Updated CLAUDE.md with Master Agent configuration'));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  installGlobalAgents().catch(console.error);
}

export { installGlobalAgents };