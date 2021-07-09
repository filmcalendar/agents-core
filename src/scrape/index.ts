import type * as FC from '@filmcalendar/types';

import type Agent from 'src/agent';

import scrapeFilms from './films';

async function scrape(agent: Agent): Promise<FC.Agent.Page[]> {
  const { type } = agent.register();

  switch (type) {
    case 'films':
      return scrapeFilms(agent);
    default:
      return [];
  }
}

export default scrape;
