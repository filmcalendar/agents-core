/* eslint-disable no-console */
import type * as FC from '@filmcalendar/types';

import args from './args';
import { serializeAgents } from './list';
import job from './job';

type ProgramFn = (agents: Record<string, FC.Agent.Agent>) => Promise<void>;
const program: ProgramFn = async (agents) => {
  const options = args(process.argv);

  switch (options.action) {
    case 'list':
      console.log(serializeAgents(agents));
      break;
    case 'scrape': {
      const data = await job(options.agent, agents);
      console.log(JSON.stringify(data, undefined, 2));
      break;
    }
    default:
      throw new Error(`Program action ${options.action} not supported`);
  }
};

export default program;