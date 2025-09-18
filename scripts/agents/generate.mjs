import { promises as fs } from 'fs';
import path from 'path';

const cwd = process.cwd();
const agentsDir = path.resolve(cwd, 'claude-starter', 'docs', 'agents');
const outDir = path.resolve(cwd, 'src', 'agents');
const outFile = path.resolve(outDir, 'registry.json');

async function listAgentFiles() {
  const entries = await fs.readdir(agentsDir);
  return entries.filter((e) => e.endsWith('-agent.md')).sort();
}

function toDisplayName(filename) {
  return filename
    .replace(/-agent\.md$/, '')
    .split('-')
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ')
    .replace(/Aws/g, 'AWS');
}

function extractSummary(markdown) {
  const lines = markdown.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#')) continue;
    return line.length > 180 ? line.slice(0, 177) + '...' : line;
  }
  return undefined;
}

async function generate() {
  const files = await listAgentFiles();
  const agents = [];
  for (const filename of files) {
    const fullPath = path.join(agentsDir, filename);
    const raw = await fs.readFile(fullPath, 'utf8');
    const id = filename.replace(/\.md$/, '');
    const name = toDisplayName(filename);
    const summary = extractSummary(raw);
    agents.push({ id, name, filename, path: fullPath, summary });
  }

  const registry = {
    generatedAt: new Date().toISOString(),
    agents,
  };

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(registry, null, 2));
  console.log(`Generated ${agents.length} agents → ${path.relative(cwd, outFile)}`);
}

generate().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

