/* eslint-disable @typescript-eslint/lines-between-class-members */
import type * as FC from '@filmcalendar/types';

import BaseAgent from 'src/agent';

import mockReportFilmCinema from './__data__/report-film-cinema.json';
import mockReportFilmLiveTv from './__data__/report-film-live-tv.json';
import mockReportFilmStreaming from './__data__/report-film-streaming.json';
import validate from '.';

class MockAgent extends BaseAgent {
  ref = 'agent-1';
  register = () => ({ type: 'films' } as FC.Agent.Registration);
}

describe('validate', () => {
  const agent = new MockAgent();

  it('validates a cinema page', async () => {
    const result = await validate(
      agent,
      mockReportFilmCinema as FC.Dispatch.Dispatch
    );

    expect(result).toBe(true);
  });

  it('validates a live-tv page', async () => {
    const result = await validate(
      agent,
      mockReportFilmLiveTv as FC.Dispatch.Dispatch
    );

    expect(result).toBe(true);
  });

  it('validates a streaming page', async () => {
    const result = await validate(
      agent,
      mockReportFilmStreaming as FC.Dispatch.Dispatch
    );

    expect(result).toBe(true);
  });
});
