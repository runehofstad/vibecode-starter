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

  let claudeMdContent = '# Claude Code Configuration\n\n';

  claudeMdContent += '## Vibecode Agents Installed\n\n';
  claudeMdContent += 'The following agents are globally available in ~/.claude/agents/:\n\n';

  for (const [key, agent] of Object.entries(agentMapping)) {
    claudeMdContent += `- **${agent.name}**: ~/.claude/agents/${agent.file}\n`;
  }

  claudeMdContent += `\n## How to Use Agents\n\n`;
  claudeMdContent += `Claude Code will automatically read these agents as context.\n`;
  claudeMdContent += `Reference them in your prompts:\n\n`;
  claudeMdContent += `\`\`\`\n`;
  claudeMdContent += `"Use the frontend-agent approach for this component"\n`;
  claudeMdContent += `"Follow backend-agent patterns for the API"\n`;
  claudeMdContent += `"Apply testing-agent standards"\n`;
  claudeMdContent += `\`\`\`\n\n`;
  claudeMdContent += `## Agent Orchestration\n\n`;
  claudeMdContent += `The Vibecode orchestrator will suggest agent combinations for tasks.\n`;
  claudeMdContent += `While Claude can't directly invoke custom agents via Task tool,\n`;
  claudeMdContent += `it will read and apply their patterns from ~/.claude/agents/\n\n`;
  claudeMdContent += `---\n\n`;
  claudeMdContent += `*Powered by Vibecode Claude Code Edition*\n`;

  await fs.writeFile(claudeMdPath, claudeMdContent);
  console.log(chalk.green('✅ Updated CLAUDE.md with agent references'));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  installGlobalAgents().catch(console.error);
}

export { installGlobalAgents };