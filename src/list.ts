import type { AgentsRecord, AgentsMap } from './agents-core.d';

function listAgents(agents: AgentsRecord): AgentsMap {
  return Object.values(agents as AgentsRecord).reduce((acc, Agent) => {
    const agent = new Agent();
    if (acc.has(agent.ref))
      throw new Error(`Agents: duplicate agent ref - ${agent.ref}`);
    acc.set(agent.ref, Agent);
    return acc;
  }, new Map() as AgentsMap);
}

export function serializeAgents(agents: AgentsRecord): string {
  const agentList = listAgents(agents);

  return [...agentList.keys()].join(',');
}

export default listAgents;
