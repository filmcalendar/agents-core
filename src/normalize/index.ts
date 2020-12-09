import { normalize } from 'normalizr';
import type * as FC from '@filmcalendar/types';

import filmsSchema from './films';

type NormalizeDataFn = (
  agent: FC.Agent.Agent,
  data: FC.Agent.Page[]
) => FC.Agent.Dispatch;

const normalizePages: NormalizeDataFn = (agent, data) => {
  const { type } = agent.register();

  switch (type) {
    case 'films':
    default:
      return normalize(data, filmsSchema);
  }
};

export default normalizePages;
