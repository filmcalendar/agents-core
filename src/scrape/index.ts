import type * as FC from '@filmcalendar/types';

import scrapeFilms from './films';

async function scrape(agent: FC.Agent.Agent): Promise<FC.Agent.Page[]> {
  const { type } = agent?.register();

  switch (type) {
    case 'films':
      return scrapeFilms(agent);
    default:
      return [];
  }
}

export default scrape;
