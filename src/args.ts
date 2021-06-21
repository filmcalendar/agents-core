import parseArgs from 'yargs-parser';

import type * as FC from '@filmcalendar/types';

function args(argv: string[]): FC.Scraper.Options {
  const {
    _: [action],
    a: agent,
  } = parseArgs(argv.slice(2));

  return { action, agent } as FC.Scraper.Options;
}

export default args;
