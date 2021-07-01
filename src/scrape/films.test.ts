import type * as FC from '@filmcalendar/types';

import mockPageRaw from './__data__/page.json';
import mockSeasonsRaw from './__data__/seasons.json';

import {
  refProvider,
  getSeasonsForPage,
  onlyFutureSessions,
  onlyFutureEndAvailability,
  isValidPage,
  removeTemporaryAttributes,
} from './films';

const mockPage = mockPageRaw as FC.Agent.Page;
const mockSeasons = mockSeasonsRaw as FC.Season[];

describe('cinema job', () => {
  it.each([
    [
      'single venue',
      {
        name: 'The Foo Cinema',
        type: 'cinema' as FC.ProviderType,
        url: 'https://thefoocinema.com',
      },
      {
        ref: 'the-foo-cinema',
        name: 'The Foo Cinema',
        type: 'cinema' as FC.ProviderType,
        url: 'https://thefoocinema.com',
      },
    ],
    [
      'venue on a chain',
      {
        name: 'Bar',
        url: 'https://bigchain.com/bar',
        chain: 'Big Chain',
        type: 'cinema' as FC.ProviderType,
      },
      {
        ref: 'big-chain-bar',
        name: 'Bar',
        url: 'https://bigchain.com/bar',
        chain: 'Big Chain',
        type: 'cinema' as FC.ProviderType,
      },
    ],
  ])('adds ref to provider: %s', (_, provider, expected) => {
    expect.assertions(1);
    const result = refProvider(provider);
    expect(result).toStrictEqual(expected);
  });

  it('removes sessions in the past', () => {
    expect.assertions(1);

    const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(1606072275000);
    const result = onlyFutureSessions(mockPage);

    const expected = JSON.parse(JSON.stringify(mockPage));
    expected.sessions = [
      {
        dateTime: '2020-11-30T12:30:00.000Z',
        tags: [],
        link: 'https:/foo.com/buy/2',
      },
    ];
    expect(result).toStrictEqual(expected);
    dateNowSpy.mockRestore();
  });

  it.each(['url', 'provider', 'films', 'sessions'])(
    'is valid page: no %s',
    (field) => {
      expect.assertions(1);

      const mockInvalidPage = JSON.parse(JSON.stringify(mockPage));
      delete mockInvalidPage[field];
      const result = isValidPage(mockInvalidPage);

      expect(result).toBe(false);
    }
  );

  it('removes temporary attributes', () => {
    expect.assertions(1);

    const result = removeTemporaryAttributes(mockPage);

    const expected = JSON.parse(JSON.stringify(mockPage));
    delete expected.provider._data;
    expect(result).toStrictEqual(expected);
  });

  it('filters out films with availability ending in the past', () => {
    expect.assertions(1);
    // 2020-12-09T12:40:26.000Z
    const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(1607517626000);

    const mockPageWithPastAvailability = JSON.parse(JSON.stringify(mockPage));
    delete mockPageWithPastAvailability.sessions;
    mockPageWithPastAvailability.availability = {
      start: '2019-12-09T12:34:12.000Z',
      end: '2020-06-09T12:34:12.000Z',
    };
    const result = onlyFutureEndAvailability(mockPageWithPastAvailability);

    expect(result).toBeNull();
    dateNowSpy.mockRestore();
  });

  it('gets seasons for a page', () => {
    expect.assertions(2);

    const result = getSeasonsForPage(mockSeasons)(mockPage);

    expect(result.seasons).toHaveLength(2);
    const [first] = result.seasons || [];
    expect(first).toStrictEqual(mockSeasons[0]);
  });
});
