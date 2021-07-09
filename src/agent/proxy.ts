import fletch from '@tuplo/fletch';

function getRandomInt(minimum: number, maximum: number): number {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

type ProxyConfig = {
  username: string;
  password: string;
  host: string;
  port: number;
};

type WebShareProxy = {
  username: string;
  password: string;
  proxy_address: string;
  ports: { http: number };
};

type WebShareResponse = {
  results: WebShareProxy[];
};

async function getProxy(): Promise<ProxyConfig | undefined> {
  if (typeof process.env.PROXY_API_KEY === 'undefined') return undefined;

  const { results } = await fletch.json<WebShareResponse>(
    'https://proxy.webshare.io/api/proxy/list',
    {
      headers: {
        Authorization: `Token ${process.env.PROXY_API_KEY}`,
      },
      urlSearchParams: {
        countries: 'UK',
      },
    }
  );

  const randomProxy = results[getRandomInt(0, results.length - 1)];
  const { username, password, proxy_address, ports } = randomProxy;

  return { username, password, host: proxy_address, port: ports.http };
}

export default getProxy;
