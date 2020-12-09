import seriesWith from '@tuplo/series-with';
import slugify from '@sindresorhus/slugify';
import dtIsAfter from 'date-fns/isAfter';
import cleanDeep from 'clean-deep';

import type * as FC from '@filmcalendar/types';

type WithAgentFn<T> = (agent: FC.Agent.Agent) => T;

type RefProviderFn = (provider: FC.Agent.Provider) => FC.Agent.Provider;
export const refProvider: RefProviderFn = (provider) => ({
  ...provider,
  ref: [provider.chain, provider.name]
    .map((part) => (part ? slugify(part as string) : ''))
    .filter(Boolean)
    .join('-'),
});

type RemoveTemporaryAttributesFn = (page: FC.Agent.Page) => FC.Agent.Page;
export const removeTemporaryAttributes: RemoveTemporaryAttributesFn = (page) =>
  JSON.parse(
    JSON.stringify(page, (key, value) => (/^_/.test(key) ? undefined : value))
  );

type OnlyFutureSessionsFn = (page: FC.Agent.Page) => FC.Agent.Page;
export const onlyFutureSessions: OnlyFutureSessionsFn = (page) => ({
  ...page,
  sessions: (page.sessions || []).filter(({ dateTime }) =>
    dtIsAfter(new Date(dateTime), Date.now())
  ),
});

type OnlyFutureEndAvailabilityFn = (
  page: FC.Agent.Page
) => FC.Agent.Page | null;
export const onlyFutureEndAvailability: OnlyFutureEndAvailabilityFn = (
  page
) => {
  const { availability } = page;
  const { end } = availability || ({} as FC.Agent.Availability);
  const dtEnd = new Date(end);
  return dtIsAfter(new Date(Date.now()), dtEnd) ? null : page;
};

type IsValidPageFn = (page?: FC.Agent.Page | null) => boolean;
export const isValidPage: IsValidPageFn = (page) =>
  Boolean(page) &&
  ['url', 'provider', 'films'].every((field) => field in (page || {})) &&
  ['sessions', 'availability'].some((field) => field in (page || {}));

type ScrapeProviderFn = (
  provider: FC.Agent.Provider
) => Promise<FC.Agent.Page[]>;
export const scrapeProvider: WithAgentFn<ScrapeProviderFn> = (agent) => async (
  vn
) => {
  const provider = refProvider(vn);
  const { programme, _data } = await agent.programme(provider);
  const pages = await seriesWith(programme, (url) =>
    agent.page(url, provider, _data)
  ).then((results) => results.filter(Boolean) as FC.Agent.Page[]);

  return pages
    .map(removeTemporaryAttributes)
    .map(onlyFutureSessions)
    .filter(onlyFutureEndAvailability)
    .map((page) => cleanDeep(page || {}))
    .filter((page) => isValidPage(page as FC.Agent.Page)) as FC.Agent.Page[];
};

type ScrapeCinemaFn = (agent: FC.Agent.Agent) => Promise<FC.Agent.Page[]>;
const scrapeCinema: ScrapeCinemaFn = async (agent) => {
  const providers = await agent.providers();

  return seriesWith(providers, scrapeProvider(agent)).then((data) =>
    data.flat()
  );
};

export default scrapeCinema;
