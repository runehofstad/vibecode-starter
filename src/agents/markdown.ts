import { promises as fs } from 'fs';
import path from 'path';
import { AgentSpecContent, AgentSpecMeta } from './types';

const AGENTS_DIR = path.resolve(process.cwd(), 'claude-starter', 'docs', 'agents');

export async function listAgentFiles(): Promise<string[]> {
  const entries = await fs.readdir(AGENTS_DIR);
  return entries.filter((entry) => entry.endsWith('-agent.md'));
}

export async function readAgentFile(filename: string): Promise<AgentSpecContent> {
  const fullPath = path.join(AGENTS_DIR, filename);
  const rawMarkdown = await fs.readFile(fullPath, 'utf8');
  const id = filename.replace(/\.md$/, '');
  const name = filename
    .replace(/-agent\.md$/, '')
    .split('-')
    .map((s) => (s.length ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ');

  const meta: AgentSpecMeta = {
    id,
    name: name.replace(/\bAws\b/, 'AWS'),
    filename,
    path: fullPath,
  };

  return { meta, rawMarkdown };
}

export function extractSummary(markdown: string): string | undefined {
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    return trimmed.length > 180 ? trimmed.slice(0, 177) + '...' : trimmed;
  }
  return undefined;
}
