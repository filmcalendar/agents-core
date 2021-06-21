import type * as FC from '@filmcalendar/types';

type Agents = Record<string, FC.Agent.Agent>;
function listAgents(agents: Agents): Map<string, FC.Agent.Agent> {
  return Object.values(agents as Record<string, FC.Agent.Agent>).reduce(
    (acc, agent) => {
      if (acc.has(agent.ref))
        throw new Error(`Agents: duplicate agent ref - ${agent.ref}`);
      acc.set(agent.ref, agent);
      return acc;
    },
    new Map() as Map<string, FC.Agent.Agent>
  );
}

export function serializeAgents(agents: Agents): string {
  const agentList = listAgents(agents);

  return [...agentList.keys()].join(',');
}

export default listAgents;
