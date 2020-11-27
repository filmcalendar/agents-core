import type * as FC from '@filmcalendar/types';

import list from './list';
import scrape from './scrape';
import normalize from './normalize';
import validate from './validate';

type JobFn = (
  agentRef: string,
  agents: Record<string, FC.Agent.Agent>
) => Promise<FC.Agent.Dispatch>;
const job: JobFn = async (agentRef, agents) => {
  const agentList = list(agents);
  const agent = agentList.get(agentRef);
  if (!agent) throw new Error(`job: agent ${agentRef} not found`);

  const pages = await scrape(agent);
  const data = normalize(agent, pages);
  validate(agent, data);

  return data;
};

export default job;
