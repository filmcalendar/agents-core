import type * as FC from '@filmcalendar/types';

import mockReportFilmCinema from '../__data__/report-film-cinema.json';
import mockReportFilmLiveTv from '../__data__/report-film-live-tv.json';
import mockReportFilmStreaming from '../__data__/report-film-streaming.json';
import validate from '.';

const mockAgent = {
  ref: 'agent-1',
  register: () => ({ type: 'films' }),
} as unknown as FC.Agent.Agent;

describe('validate', () => {
  it('validates a cinema page', () => {
    expect.assertions(1);
    const result = validate(
      mockAgent,
      mockReportFilmCinema as FC.Agent.Dispatch
    );

    expect(result).toBe(true);
  });

  it('validates a live-tv page', () => {
    expect.assertions(1);
    const result = validate(
      mockAgent,
      mockReportFilmLiveTv as FC.Agent.Dispatch
    );

    expect(result).toBe(true);
  });

  it('validates a streaming page', () => {
    expect.assertions(1);
    const result = validate(
      mockAgent,
      mockReportFilmStreaming as FC.Agent.Dispatch
    );

    expect(result).toBe(true);
  });
});
