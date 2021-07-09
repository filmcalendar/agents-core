/* eslint-disable import/first */
const fletchSpy = jest.fn().mockReturnValue({
  results: [
    {
      username: 'mock-user',
      password: 'mock-passwd',
      proxy_address: '80.0.0.9',
      ports: { http: 76 },
    },
  ],
});
jest.mock('@tuplo/fletch', () => ({
  __esModule: true,
  default: { json: fletchSpy },
}));

import getProxy from './proxy';

describe("agent's request proxy", () => {
  afterEach(() => {
    fletchSpy.mockClear();
    delete process.env.PROXY_API_KEY;
  });

  it("doesn't request a new proxy if PROXY_API_KEY isn't present", async () => {
    const result = await getProxy();

    expect(result).toBeUndefined();
    expect(fletchSpy).not.toHaveBeenCalled();
  });

  it('requests a new proxy if PROXY_API_KEY is present', async () => {
    process.env.PROXY_API_KEY = 'foobar';
    await getProxy();

    const expectedUrl = 'https://proxy.webshare.io/api/proxy/list';
    const expectedOptions = {
      headers: { Authorization: 'Token foobar' },
      urlSearchParams: { countries: 'UK' },
    };
    expect(fletchSpy).toHaveBeenCalledTimes(1);
    expect(fletchSpy).toHaveBeenCalledWith(expectedUrl, expectedOptions);
  });

  it('converts to fletch.proxyOptions', async () => {
    process.env.PROXY_API_KEY = 'foobar';
    const result = await getProxy();

    const expected = {
      host: '80.0.0.9',
      password: 'mock-passwd',
      port: 76,
      username: 'mock-user',
    };
    expect(result).toStrictEqual(expected);
  });
});
