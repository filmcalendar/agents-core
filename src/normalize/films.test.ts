import type * as FC from '@filmcalendar/types';

import { serializeBookingLink, serializeSession } from './films';

describe('normalize films', () => {
  it.each([
    ['https://venue.com/buy/film-a', 'https://venue.com/buy/film-a'],
    ['https://venue.com/buy/film a', 'https://venue.com/buy/film%20a'],
    [
      {
        method: 'POST',
        formUrlEncoded: {
          'BOset::WSmap::seatmap::performance_ids':
            '6E7397CD-AC2A-43AE-9AF7-5DDBD6FE2D7B',
          'createBO::WSmap': '1',
        },
        url: 'https://whatson.bfi.org.uk/Online/mapSelect.asp',
      } as FC.Agent.BookingRequest,
      'post|https://whatson.bfi.org.uk/Online/mapSelect.asp|boset::wsmap::seatmap::performance_ids=6e7397cd-ac2a-43ae-9af7-5ddbd6fe2d7b,createbo::wsmap=1|',
    ],
  ])('serializes bookingLink: %s', (bookingLink, expected) => {
    const result = serializeBookingLink(bookingLink);
    expect(result).toBe(expected);
  });

  it.each([
    [
      'simple',
      {
        dateTime: '2019-02-18T21:30:00.000Z',
        link: 'https://venue.com/buy/film-a',
        attributes: [],
      },
      '2019-02-18T21:30:00.000Z|https://venue.com/buy/film-a|',
    ],
    [
      'with attributes',
      {
        dateTime: '2020-02-18T21:30:00.000Z',
        link: 'https://venue.com/buy/film-a',
        attributes: ['3D', 'parent-and-baby', 'kids', 'parent & baby', 'HOH'],
      },
      '2020-02-18T21:30:00.000Z|https://venue.com/buy/film-a|3d,hoh,kids,parent-and-baby,parent%20%26%20baby',
    ],
    [
      'with booking link',
      {
        attributes: ['audio-description'],
        link: {
          method: 'POST',
          formUrlEncoded: {
            'BOset::WSmap::seatmap::performance_ids':
              '6E7397CD-AC2A-43AE-9AF7-5DDBD6FE2D7B',
            'createBO::WSmap': '1',
          },
          url: 'https://whatson.bfi.org.uk/Online/mapSelect.asp',
        },
        dateTime: '2020-01-13T18:10:00.000Z',
      },
      '2020-01-13T18:10:00.000Z|post|https://whatson.bfi.org.uk/Online/mapSelect.asp|boset::wsmap::seatmap::performance_ids=6e7397cd-ac2a-43ae-9af7-5ddbd6fe2d7b,createbo::wsmap=1||audio-description',
    ],
  ])('serializes session: %s', (_, session, expected) => {
    const result = serializeSession(session as FC.Agent.Session);
    expect(result).toBe(expected);
  });
});
