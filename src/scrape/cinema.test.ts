import type * as FC from '@filmcalendar/types';

import { refVenue, onlyFutureSessions, isValidPage } from './cinema';

const mockPage: FC.Agent.Page = {
  url: 'https://foo.com/film-1',
  venue: { ref: 'foo', name: 'Foo Cinema' },
  films: [{ title: 'The Film II' }],
  sessions: [
    {
      dateTime: '2020-11-20T12:30:00.000Z',
      attributes: [],
      bookingLink: 'https:/foo.com/buy/1',
    },
    {
      dateTime: '2020-11-30T12:30:00.000Z',
      attributes: [],
      bookingLink: 'https:/foo.com/buy/2',
    },
  ],
};

describe('cinema job', () => {
  it.each([
    [
      'single venue',
      { name: 'The Foo Cinema', url: 'https://thefoocinema.com' },
      {
        ref: 'the-foo-cinema',
        name: 'The Foo Cinema',
        url: 'https://thefoocinema.com',
      },
    ],
    [
      'venue on a chain',
      { name: 'Bar', url: 'https://bigchain.com/bar', chain: 'Big Chain' },
      {
        ref: 'big-chain-bar',
        name: 'Bar',
        url: 'https://bigchain.com/bar',
        chain: 'Big Chain',
      },
    ],
  ])('adds ref to venue: %s', (_, venue, expected) => {
    const result = refVenue(venue);
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
        attributes: [],
        bookingLink: 'https:/foo.com/buy/2',
      },
    ];
    expect(result).toStrictEqual(expected);
    dateNowSpy.mockRestore();
  });

  it.each([['url'], ['venue'], ['films'], ['sessions']])(
    'is valid page: no %s',
    (field) => {
      const mockInvalidPage = JSON.parse(JSON.stringify(mockPage));
      delete mockInvalidPage[field];
      const result = isValidPage(mockInvalidPage);
      expect(result).toBe(false);
    }
  );
});
