/* eslint-disable no-console */
import { unhandler } from '@tuplo/unhandler';

import type { AgentsRecord } from './agents-core.d';

import args from './args';
import { serializeAgents } from './list';
import job from './job';
import AgentDef from './agent';

async function program(agents: AgentsRecord): Promise<void> {
  const options = args(process.argv);

  process.env.TZ = 'utc';

  if (process.env.NODE_ENV !== 'development') {
    unhandler({
      appName: options.agent,
      providers: {
        github: {
          user: process.env.GIT_USER as string,
          repo: process.env.GIT_REPO_SRC as string,
          token: process.env.GIT_PASSWORD as string,
        },
      },
    });
  }

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
}

export default program;
export { AgentDef as BaseAgent };
