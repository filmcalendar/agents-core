import seriesWith from '@tuplo/series-with';
import slugify from '@sindresorhus/slugify';
import dtIsAfter from 'date-fns/isAfter';
import cleanDeep from 'clean-deep';

import type * as FC from '@filmcalendar/types';

export function refProvider(provider: FC.Agent.Provider): FC.Agent.Provider {
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

async function getCollections(
  agent: FC.Agent.Agent,
  provider: FC.Agent.Provider
): Promise<FC.Agent.Collection[]> {
  if (!agent.collections) return [];

  const { collections: collectionsUrls, _data: _collectionsData } =
    await agent.collections(provider);

  const collectionFn =
    typeof agent.collection === 'undefined'
      ? async () => ({} as FC.Agent.Collection)
      : agent.collection;

  return seriesWith(collectionsUrls, (url) =>
    collectionFn(url, { _data: _collectionsData })
  );
}

type GetCollectionsForPageFn = (page: FC.Agent.Page) => FC.Agent.Page;
type GetCollectionsForPage = (
  collections: FC.Agent.Collection[]
) => GetCollectionsForPageFn;
export const getCollectionsForPage: GetCollectionsForPage =
  (collections) => (page) => ({
    ...page,
    collections: collections.filter((collection) =>
      collection.programme.includes(page.url)
    ),
  });

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
  const { end } = availability || ({} as FC.Agent.Availability);
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

type ScrapeProviderFn = (
  provider: FC.Agent.Provider
) => Promise<FC.Agent.Page[]>;

export function scrapeAgent(agent: FC.Agent.Agent): ScrapeProviderFn {
  return async function scrapeProvider(
    vn: FC.Agent.Provider
  ): Promise<FC.Agent.Page[]> {
    const provider = refProvider(vn);

    const featuredFn =
      typeof agent.featured === 'undefined' ? async () => [] : agent.featured;
    const featured = await featuredFn(provider);

    const collections = await getCollections(agent, provider);

    const { programme, _data } = await agent.programme(provider);
    const pages = await seriesWith(programme, (url) =>
      agent.page(url, provider, _data)
    ).then((results) => results.filter(Boolean) as FC.Agent.Page[]);

    return pages
      .map((page) => ({ ...page, isFeatured: featured.includes(page.url) }))
      .map(getCollectionsForPage(collections))
      .map(removeTemporaryAttributes)
      .map(onlyFutureSessions)
      .filter(onlyFutureEndAvailability)
      .map((page) => cleanDeep(page || {}))
      .filter((page) => isValidPage(page as FC.Agent.Page)) as FC.Agent.Page[];
  };
}

async function scrapeCinema(agent: FC.Agent.Agent): Promise<FC.Agent.Page[]> {
  const providers = await agent.providers();

  return seriesWith(providers, scrapeAgent(agent)).then((data) => data.flat());
}

export default scrapeCinema;
