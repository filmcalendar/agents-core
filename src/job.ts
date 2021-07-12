import type * as FC from '@filmcalendar/types';

import type { AgentsRecord } from './agents-core.d';

import list from './list';
import scrape from './scrape';
import normalize from './normalize';
import validate from './validate';

function getMetadata(
  metadata: Partial<FC.Dispatch.Metadata>
): FC.Dispatch.Metadata {
  return {
    ...metadata,
    timeEnd: Date.now(),
    memoryUsage: process.memoryUsage().rss,
  } as FC.Dispatch.Metadata;
}

async function job(
  agentRef: string,
  agents: AgentsRecord
): Promise<FC.Dispatch.Dispatch> {
  const timeStart = Date.now();

  const agentsMap = list(agents);
  const Agent = agentsMap.get(agentRef);
  if (!Agent) throw new Error(`job: agent ${agentRef} not found`);

  const agent = new Agent();
  await agent.init();

  const pages = await scrape(agent);
  const { entities: data } = normalize(agent, pages);
  const isValid = await validate(agent, data);

  data.metadata = getMetadata({ agent: agentRef, timeStart, valid: isValid });

  return data;
}

export default job;
