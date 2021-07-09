/* eslint-disable max-classes-per-file */
import BaseAgent from 'src/agent';
import type { IAgent } from 'src/agent';
import list, { serializeAgents } from './list';

class A extends BaseAgent {
  ref = 'ref-a';
}
class B extends BaseAgent {
  ref = 'ref-b';
}
class C extends BaseAgent {
  ref = 'ref-c';
}

describe('list agents', () => {
  it('list agents using ref field', () => {
    const agents = {
      RefA: A as IAgent,
      RefB: B as IAgent,
    };
    const result = list(agents);

    const expected = new Map([
      ['ref-a', A],
      ['ref-b', B],
    ]);
    expect(result).toStrictEqual(expected);
  });

  it('throws an exception if it finds duplicate ref', () => {
    const agents = {
      RefA: A as IAgent,
      RefB: B as IAgent,
      RefC: A as IAgent,
    };
    const result = () => list(agents);

    const expected = new Error('Agents: duplicate agent ref - ref-a');
    expect(result).toThrow(expected);
  });

  it("formats the agent's list to be printed on the command line", () => {
    const agents = {
      RefA: A as IAgent,
      RefB: B as IAgent,
      RefC: C as IAgent,
    };
    const result = serializeAgents(agents);

    const expected = 'ref-a,ref-b,ref-c';
    expect(result).toBe(expected);
  });
});
