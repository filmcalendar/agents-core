import type * as FC from '@filmcalendar/types';

type SerializeObjectFn = (obj: Record<string, unknown>) => string;
export const serializeObject: SerializeObjectFn = (obj) =>
  Object.entries(obj)
    .map(([key, value]) => [
      key.toLowerCase(),
      encodeURI(`${value}`).toLowerCase(),
    ])
    .map(([key, value]) => `${key}=${value}`)
    .sort((a, b) => a.localeCompare(b))
    .join(',');

type GetFilmTitleFn = (film: FC.Agent.Film) => string;
export const getFilmTitle: GetFilmTitleFn = (film) => {
  return film?.title || film?.titleTranslated || '';
};
