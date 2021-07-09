import type * as FC from '@filmcalendar/types';

import type { AgentsRecord } from './agents-core.d';

import list from './list';
import scrape from './scrape';
import normalize from './normalize';
import validate from './validate';

async function job(
  agentRef: string,
  agents: AgentsRecord
): Promise<FC.Dispatch.Dispatch> {
  const agentsMap = list(agents);
  const Agent = agentsMap.get(agentRef);
  if (!Agent) throw new Error(`job: agent ${agentRef} not found`);

  const agent = new Agent();
  await agent.init();

  const pages = await scrape(agent);
  const data = normalize(agent, pages);
  validate(agent, data);

  return data;
}

export default job;
