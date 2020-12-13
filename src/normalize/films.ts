import { schema } from 'normalizr';
import md5 from 'md5';
import slugify from '@sindresorhus/slugify';

import {
  serializeObject,
  getFilmTitle,
  serializeSession,
  serializeAvailability,
} from './helpers';

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

const collection = new schema.Entity(
  'collections',
  {},
  {
    idAttribute: (input): string => slugify(input.name),
    processStrategy: (item): unknown => {
      const { programme, ...restOfItem } = item;
      return { ref: slugify(item.name), ...restOfItem };
    },
  }
);

const page = new schema.Entity(
  'pages',
  {
    provider,
    films: [film],
    sessions: [session],
    availability,
    collections: [collection],
  },
  {
    idAttribute: (input): string =>
      md5(`${[input.provider.name, input.url].join('-')}`),
  }
);

export default [page];
