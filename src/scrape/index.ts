import type * as FC from '@filmcalendar/types';

import scrapeFilms from './films';

type ScrapeFn = (agent: FC.Agent.Agent) => Promise<FC.Agent.Page[]>;
const scrape: ScrapeFn = async (agent) => {
  const { type } = agent?.register();

  switch (type) {
    case 'films':
      return scrapeFilms(agent);
    default:
      return [];
  }
};

export default scrape;
