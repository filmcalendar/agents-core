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
export const getFilmTitle: GetFilmTitleFn = (film) =>
  film?.title || film?.titleTranslated || '';

type SerializeBookingLinkFn = (
  link: string | FC.Agent.BookingRequest | null
) => string;
export const serializeBookingLink: SerializeBookingLinkFn = (link) => {
  if (!link) return '';
  if (typeof link === 'string') return encodeURI(link);
  const { url, method, formUrlEncoded = {}, jsonData = {} } = link;

  return [
    method.toLowerCase(),
    encodeURI(url),
    serializeObject(formUrlEncoded),
    serializeObject(jsonData),
  ].join('|');
};

type SerializeSessionFn = (session: FC.Agent.Session) => string;
export const serializeSession: SerializeSessionFn = (session) => {
  const { dateTime, link, attributes } = session;

  return [
    dateTime,
    serializeBookingLink(link),
    (attributes || [])
      .map((a) => a.toLowerCase())
      .map((a) => encodeURIComponent(a))
      .sort((a, b) => a.localeCompare(b))
      .join(','),
  ].join('|');
};

type SerializeAvailabilityFn = (availability: FC.Agent.Availability) => string;
export const serializeAvailability: SerializeAvailabilityFn = (
  availability
) => {
  const { start, end, attributes = [] } = availability;
  return [
    start,
    end,
    (attributes || [])
      .map((a) => a.toLowerCase())
      .map((a) => encodeURIComponent(a))
      .sort((a, b) => a.localeCompare(b))
      .join(','),
  ].join('|');
};
