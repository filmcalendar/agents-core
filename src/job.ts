import type * as FC from '@filmcalendar/types';

import list from './list';
import scrape from './scrape';
import normalize from './normalize';
import validate from './validate';

type Agents = Record<string, FC.Agent.Agent>;

async function job(
  agentRef: string,
  agents: Agents
): Promise<FC.Agent.Dispatch> {
  const agentList = list(agents);
  const agent = agentList.get(agentRef);
  if (!agent) throw new Error(`job: agent ${agentRef} not found`);

  const pages = await scrape(agent);
  const data = normalize(agent, pages);
  validate(agent, data);

  return data;
}

export default job;
