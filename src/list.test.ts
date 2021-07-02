import type * as FC from '@filmcalendar/types';

import list, { serializeAgents } from './list';

const mockAgent = {
  register: (): FC.Agent.Registration => ({} as FC.Agent.Registration),
  providers: async (): Promise<FC.Provider[]> => [],
  featured: async (): Promise<string[]> => [],
  programme: async (): Promise<FC.Agent.Programme> =>
    ({} as FC.Agent.Programme),
  page: async (): Promise<FC.Agent.Page> => ({} as FC.Agent.Page),
};

describe('list agents', () => {
  it('list agents using ref field', () => {
    const agents = {
      RefA: { ref: 'ref-a', ...mockAgent },
      RefB: { ref: 'ref-b', ...mockAgent },
    } as Record<string, FC.Agent.Agent>;
    const result = list(agents);

    const expected = new Map([
      ['ref-a', { ref: 'ref-a', ...mockAgent }],
      ['ref-b', { ref: 'ref-b', ...mockAgent }],
    ]);
    expect(result).toStrictEqual(expected);
  });

  it('throws an exception if it finds duplicate ref', () => {
    const agents = {
      RefA: { ref: 'ref-a', ...mockAgent },
      RefB: { ref: 'ref-b', ...mockAgent },
      RefC: { ref: 'ref-a', ...mockAgent },
    } as Record<string, FC.Agent.Agent>;
    const result = () => list(agents);

    const expected = new Error('Agents: duplicate agent ref - ref-a');
    expect(result).toThrow(expected);
  });

  it("formats the agent's list to be printed on the command line", () => {
    const agents = {
      RefA: { ref: 'ref-a', ...mockAgent },
      RefB: { ref: 'ref-b', ...mockAgent },
      RefC: { ref: 'ref-c', ...mockAgent },
    } as Record<string, FC.Agent.Agent>;
    const result = serializeAgents(agents);

    const expected = 'ref-a,ref-b,ref-c';
    expect(result).toBe(expected);
  });
});
