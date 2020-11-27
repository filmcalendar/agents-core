import { schema } from 'normalizr';
import md5 from 'md5';
import slugify from '@sindresorhus/slugify';
import type * as FC from '@filmcalendar/types';

import { serializeObject, getFilmTitle } from './helpers';

type SerializeBookingLinkFn = (
  bookingLink: string | FC.Agent.BookingRequest | null
) => string;
export const serializeBookingLink: SerializeBookingLinkFn = (bookingLink) => {
  if (!bookingLink) return '';
  if (typeof bookingLink === 'string') return encodeURI(bookingLink);
  const { url, method, formUrlEncoded = {}, jsonData = {} } = bookingLink;

  return [
    method.toLowerCase(),
    encodeURI(url),
    serializeObject(formUrlEncoded),
    serializeObject(jsonData),
  ].join('|');
};

type SerializeSessionFn = (session: FC.Agent.Session) => string;
export const serializeSession: SerializeSessionFn = (session) => {
  const { dateTime, bookingLink, attributes } = session;

  return [
    dateTime,
    serializeBookingLink(bookingLink),
    (attributes || [])
      .map((a) => a.toLowerCase())
      .map((a) => encodeURIComponent(a))
      .sort((a, b) => a.localeCompare(b))
      .join(','),
  ].join('|');
};

const venue = new schema.Entity(
  'venues',
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
    processStrategy: (item): unknown => ({
      ...item,
      attributes: (item.attributes || []).map((attrib: string) => ({
        tag: attrib,
      })),
    }),
    idAttribute: (item): string => md5(serializeSession(item)),
  }
);

const page = new schema.Entity(
  'pages',
  { venue, films: [film], sessions: [session] },
  {
    idAttribute: (input): string =>
      md5(`${[input.venue.name, input.url].join('-')}`),
  }
);

export default [page];
