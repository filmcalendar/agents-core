import seriesWith from '@tuplo/series-with';
import slugify from '@sindresorhus/slugify';
import dtIsAfter from 'date-fns/isAfter';
import cleanDeep from 'clean-deep';

import type * as FC from '@filmcalendar/types';

type WithAgentFn<T> = (agent: FC.Agent.Agent) => T;

type RefVenueFn = (venue: FC.Agent.Venue) => FC.Agent.Venue;
export const refVenue: RefVenueFn = (venue) => ({
  ...venue,
  ref: [venue.chain, venue.name]
    .map((part) => (part ? slugify(part as string) : ''))
    .filter(Boolean)
    .join('-'),
});

type OnlyFutureSessionsFn = (page: FC.Agent.Page) => FC.Agent.Page;
export const onlyFutureSessions: OnlyFutureSessionsFn = (page) => ({
  ...page,
  sessions: page.sessions.filter(({ dateTime }) =>
    dtIsAfter(new Date(dateTime), Date.now())
  ),
});

type IsValidPageFn = (page?: FC.Agent.Page | null) => boolean;
export const isValidPage: IsValidPageFn = (page) =>
  Boolean(page) &&
  ['url', 'venue', 'films', 'sessions'].every((field) => field in (page || {}));

type ScrapeVenueFn = (venue: FC.Agent.Venue) => Promise<FC.Agent.Page[]>;
export const scrapeVenue: WithAgentFn<ScrapeVenueFn> = (agent) => async (
  vn
) => {
  const venue = refVenue(vn);
  const { programme, _data } = await agent.programme(venue);
  const pages = await seriesWith(programme, (url) =>
    agent.page(url, venue, _data)
  ).then((results) => results.filter(Boolean) as FC.Agent.Page[]);

  return pages
    .map(onlyFutureSessions)
    .map((page) => cleanDeep(page))
    .filter((page) => isValidPage(page as FC.Agent.Page)) as FC.Agent.Page[];
};

type ScrapeCinemaFn = (agent: FC.Agent.Agent) => Promise<FC.Agent.Page[]>;
const scrapeCinema: ScrapeCinemaFn = async (agent) => {
  const venues = await agent.venues();

  return seriesWith(venues, scrapeVenue(agent)).then((data) => data.flat());
};

export default scrapeCinema;
