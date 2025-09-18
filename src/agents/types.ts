export interface AgentSpecMeta {
  id: string;
  name: string;
  filename: string;
  path: string;
}

export interface AgentSpecContent {
  meta: AgentSpecMeta;
  rawMarkdown: string;
}

export interface RegisteredAgent extends AgentSpecMeta {
  summary?: string;
}

export interface AgentRegistry {
  agents: RegisteredAgent[];
  byId: Record<string, RegisteredAgent>;
}

export type Logger = (message: string) => void;
