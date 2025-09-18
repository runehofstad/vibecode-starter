import { promises as fs } from 'fs';
import path from 'path';

const registryPath = path.resolve(process.cwd(), 'src', 'agents', 'registry.json');

async function listAgents() {
  const raw = await fs.readFile(registryPath, 'utf8');
  const data = JSON.parse(raw);
  for (const agent of data.agents) {
    console.log(`${agent.id}\t${agent.name}\t${agent.filename}`);
  }
}

listAgents().catch((err) => {
  console.error('Unable to list agents. Have you generated the registry?');
  console.error(err.message || err);
  process.exitCode = 1;
});

