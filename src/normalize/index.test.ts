import type * as FC from '@filmcalendar/types';

import mockPages from '../__data__/pages.json';
import mockReport from '../__data__/report.json';
import normalize from '.';

describe('normalize', () => {
  it('normalizes cinema pages', () => {
    expect.assertions(1);
    const agent = ({
      ref: 'agent-1',
      register: () => ({ type: 'cinemas' }),
    } as unknown) as FC.Agent.Agent;
    const result = normalize(agent, mockPages as FC.Agent.Page[]);

    expect(result).toStrictEqual((mockReport as unknown) as FC.Agent.Dispatch);
  });
});
