import type * as FC from '@filmcalendar/types';
import fletch from '@tuplo/fletch';
import type { FletchInstance } from '@tuplo/fletch';

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
    this.request = fletch.create({ delay: 1_000 });
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
