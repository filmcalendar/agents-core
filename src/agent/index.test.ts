import getPort from 'get-port';
import http from 'http';

import Agent from './index';

jest.mock('./user-agents', () => ({
  __esModule: true,
  default: () => 'Mock user-agent',
}));

describe('base agent class', () => {
  const agent = new Agent();

  it('inits fletch with an user-agent', async () => {
    const port = await getPort();
    const spy = jest.fn((_, res) => res.end());
    const server = http.createServer(spy).listen(port);
    const url = `http://localhost:${port}/`;

    await agent.init();
    await agent.request.html(url);

    const expected = { 'user-agent': 'Mock user-agent' };
    expect(spy.mock.calls[0][0].headers).toMatchObject(expected);

    server.close();
  });
});
