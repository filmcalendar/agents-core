import seriesWith from '@tuplo/series-with';
import dtIsAfter from 'date-fns/isAfter';
import cleanDeep from 'clean-deep';

import type * as FC from '@filmcalendar/types';
import slugify from 'src/helpers/slugify';
import type Agent from 'src/agent';

export function refProvider(provider: FC.Provider): FC.Provider {
  return {
    ...provider,
    ref: [provider.chain, provider.name]
      .map((part) => (part ? slugify(part as string) : ''))
      .filter(Boolean)
      .join('-'),
  };
}

export function removeTemporaryAttributes(page: FC.Agent.Page): FC.Agent.Page {
  return JSON.parse(
    JSON.stringify(page, (key, value) => (/^_/.test(key) ? undefined : value))
  );
}

async function getSeasons(
  agent: Agent,
  provider: FC.Provider
): Promise<FC.Season[]> {
  if (!agent.seasons) return [];

  const { seasonUrls, _data: _seasonsData } = await agent.seasons(provider);

  const seasonFn =
    typeof agent.season === 'undefined'
      ? async () => ({} as FC.Season)
      : agent.season;

  return seriesWith(seasonUrls, (url) =>
    seasonFn(url, { _data: _seasonsData })
  );
}

type GetSeasonsForPageFn = (page: FC.Agent.Page) => FC.Agent.Page;
export function getSeasonsForPage(seasons: FC.Season[]): GetSeasonsForPageFn {
  return (page: FC.Agent.Page) => {
    // seasons picked up by scraping the seasons pages
    const agentSeasons = seasons.filter((season) =>
      (season.programme || []).includes(page.url)
    );

    // seasons picked up by analyzing the page heading
    // ex: The Film - London Film Festival
    const { seasons: pageSeasonsNames = [] } = page;
    const pageSeasons = pageSeasonsNames.map((pageSeasonName) => ({
      ref: slugify(pageSeasonName as string),
      name: pageSeasonName,
    })) as FC.Season[];

    return {
      ...page,
      seasons: [...agentSeasons, ...pageSeasons],
    };
  };
}

export function onlyFutureSessions(page: FC.Agent.Page): FC.Agent.Page {
  return {
    ...page,
    sessions: (page.sessions || []).filter(({ dateTime }) =>
      dtIsAfter(new Date(dateTime), Date.now())
    ),
  };
}

export function onlyFutureEndAvailability(
  page: FC.Agent.Page
): FC.Agent.Page | null {
  const { availability } = page;
  const { end } = availability || ({} as FC.Availability);
  const dtEnd = new Date(end);

  return dtIsAfter(new Date(Date.now()), dtEnd) ? null : page;
}

export function isValidPage(page?: FC.Agent.Page | null): boolean {
  return (
    Boolean(page) &&
    ['url', 'provider', 'films'].every((field) => field in (page || {})) &&
    ['sessions', 'availability'].some((field) => field in (page || {}))
  );
}

type ScrapeProviderFn = (provider: FC.Provider) => Promise<FC.Agent.Page[]>;

export function scrapeAgent(agent: Agent): ScrapeProviderFn {
  return async function scrapeProvider(
    vn: FC.Provider
  ): Promise<FC.Agent.Page[]> {
    const provider = refProvider(vn);

    const featuredFn =
      typeof agent.featured === 'undefined' ? async () => [] : agent.featured;
    const featured = await featuredFn(provider);

    const seasons = await getSeasons(agent, provider);

    const { programme, _data } = await agent.programme(provider);
    const pages = (await seriesWith(programme, async (url) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        console.log(url);
      }

      return agent.page(url, provider, _data);
    }).then((results) => results.filter(Boolean))) as FC.Agent.Page[];

    return pages
      .map((page) => ({ ...page, isFeatured: featured.includes(page.url) }))
      .map(getSeasonsForPage(seasons))
      .map(removeTemporaryAttributes)
      .map(onlyFutureSessions)
      .filter(onlyFutureEndAvailability)
      .map((page) => cleanDeep(page || {}))
      .filter((page) => isValidPage(page as FC.Agent.Page)) as FC.Agent.Page[];
  };
}

async function scrapeCinema(agent: Agent): Promise<FC.Agent.Page[]> {
  const providers = await agent.providers();

  return seriesWith(providers, scrapeAgent(agent)).then((data) => data.flat());
}

export default scrapeCinema;
