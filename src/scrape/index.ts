import type * as FC from '@filmcalendar/types';

import scrapeCinema from './cinema';

type ScrapeFn = (agent: FC.Agent.Agent) => Promise<FC.Agent.Page[]>;
const scrape: ScrapeFn = async (agent) => {
  const { type } = agent?.register();

  switch (type) {
    case 'cinemas':
      return scrapeCinema(agent);
    default:
      return [];
  }
};

export default scrape;
