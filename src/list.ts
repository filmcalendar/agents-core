import type * as FC from '@filmcalendar/types';

type ListAgentsFn = (
  agents: Record<string, FC.Agent.Agent>
) => Map<string, FC.Agent.Agent>;
const listAgents: ListAgentsFn = (agents) =>
  Object.values(agents as Record<string, FC.Agent.Agent>).reduce(
    (acc, agent) => {
      if (acc.has(agent.ref))
        throw new Error(`Agents: duplicate agent ref - ${agent.ref}`);
      acc.set(agent.ref, agent);
      return acc;
    },
    new Map() as Map<string, FC.Agent.Agent>
  );

type SerializeAgentsFn = (agents: Record<string, FC.Agent.Agent>) => string;
export const serializeAgents: SerializeAgentsFn = (agents) => {
  const agentList = listAgents(agents);
  return [...agentList.keys()].join(',');
};

export default listAgents;
