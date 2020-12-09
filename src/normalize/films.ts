import { schema } from 'normalizr';
import md5 from 'md5';
import slugify from '@sindresorhus/slugify';
import type * as FC from '@filmcalendar/types';

import { serializeObject, getFilmTitle } from './helpers';

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

const provider = new schema.Entity(
  'providers',
  {},
  { idAttribute: (input): string => md5(serializeObject(input)) }
);

const film = new schema.Entity(
  'films',
  {},
  { idAttribute: (input): string => slugify(getFilmTitle(input)) }
);

const sessionAttribute = new schema.Entity(
  'sessionAttributes',
  {},
  { idAttribute: (input): string => input.tag }
);

const session = new schema.Entity(
  'sessions',
  { attributes: [sessionAttribute] },
  {
    idAttribute: (item): string => md5(serializeSession(item)),
    processStrategy: (item): unknown => ({
      ...item,
      attributes: (item.attributes || []).map((attrib: string) => ({
        tag: attrib,
      })),
    }),
  }
);

const availability = new schema.Entity(
  'availability',
  { attributes: [sessionAttribute] },
  {
    idAttribute: (item): string => md5(serializeAvailability(item)),
    processStrategy: (item): unknown => ({
      ...item,
      attributes: (item.attributes || []).map((attrib: string) => ({
        tag: attrib,
      })),
    }),
  }
);

const page = new schema.Entity(
  'pages',
  { provider, films: [film], sessions: [session], availability },
  {
    idAttribute: (input): string =>
      md5(`${[input.provider.name, input.url].join('-')}`),
  }
);

export default [page];
