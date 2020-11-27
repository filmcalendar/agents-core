import parseArgs from 'yargs-parser';

import type * as FC from '@filmcalendar/types';

type ArgsFn = (argv: string[]) => FC.Scraper.Options;
const args: ArgsFn = (argv) => {
  const {
    _: [action],
    a: agent,
  } = parseArgs(argv.slice(2));

  return { action, agent } as FC.Scraper.Options;
};

export default args;
