import type * as FC from '@filmcalendar/types';
import fletch from '@tuplo/fletch';
import type { FletchInstance } from '@tuplo/fletch';

import getRandomUserAgent from './user-agents';

export interface IAgent {
  new (): Agent;
  init: () => Promise<void>;
  request: FletchInstance;
}

class Agent {
  ref = 'base-agent';

  request: FletchInstance;

  constructor() {
    this.request = fletch.create({});
  }

  async init(): Promise<void> {
    this.request = fletch.create({
      headers: {
        // TODO: when project more mature, change this to FC signature
        'user-agent': getRandomUserAgent(),
      },
    });
  }

  register: FC.Agent.RegisterFn = () => ({} as FC.Agent.Registration);

  providers: FC.Agent.ProvidersFn = async () => [];

  featured: FC.Agent.FeaturedFn = async () => [];

  seasons: FC.Agent.SeasonsFn = async () => ({ seasonUrls: [] });

  season: FC.Agent.SeasonFn = async () => ({} as FC.Season);

  programme: FC.Agent.ProgrammeFn = async () => ({ programme: [] });

  page: FC.Agent.PageFn = async () => null;
}

export default Agent;
