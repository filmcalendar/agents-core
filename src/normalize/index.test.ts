import type * as FC from '@filmcalendar/types';

import mockPageFilmCinema from '../__data__/page-film-cinema.json';
import mockReportFilmCinema from '../__data__/report-film-cinema.json';
import mockPageFilmLiveTv from '../__data__/page-film-live-tv.json';
import mockReportFilmLiveTv from '../__data__/report-film-live-tv.json';
import mockPageFilmStreaming from '../__data__/page-film-streaming.json';
import mockReportFilmStreaming from '../__data__/report-film-streaming.json';

import normalize from '.';

const mockAgent = ({
  ref: 'agent-1',
  register: () => ({ type: 'films' }),
} as unknown) as FC.Agent.Agent;

describe('normalize', () => {
  it('normalizes a cinema page', () => {
    expect.assertions(1);
    const result = normalize(mockAgent, [
      mockPageFilmCinema,
    ] as FC.Agent.Page[]);

    expect(result).toStrictEqual(mockReportFilmCinema as FC.Agent.Dispatch);
  });

  it('normalizes a live-tv page', () => {
    expect.assertions(1);
    const result = normalize(mockAgent, [
      mockPageFilmLiveTv,
    ] as FC.Agent.Page[]);

    expect(result).toStrictEqual(mockReportFilmLiveTv as FC.Agent.Dispatch);
  });

  it('normalizes a streaming page', () => {
    expect.assertions(1);
    const result = normalize(mockAgent, [
      mockPageFilmStreaming,
    ] as FC.Agent.Page[]);

    expect(result).toStrictEqual(
      (mockReportFilmStreaming as unknown) as FC.Agent.Dispatch
    );
  });
});
