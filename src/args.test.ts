import args from './args';

describe('program arguments', () => {
  it.each([
    [
      'list',
      // $ fc-agent list
      ['/usr/local/bin/node', '/usr/local/bin/fc-agent', 'list'],
      { action: 'list', agent: undefined },
    ],
    [
      'scrape with agent',
      // $ fc-agent scrape -a the-castle
      [
        '/usr/local/bin/node',
        '/usr/local/bin/fc-agent',
        'scrape',
        '-a',
        'the-castle',
      ],
      { action: 'scrape', agent: 'the-castle' },
    ],
  ])('parses command line arguments: %s', (_, argv, expected) => {
    const result = args(argv);
    expect(result).toStrictEqual(expected);
  });
});
