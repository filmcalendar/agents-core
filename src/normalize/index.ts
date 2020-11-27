import { normalize } from 'normalizr';
import type * as FC from '@filmcalendar/types';

import cinemaSchema from './cinema';

type NormalizeDataFn = (
  agent: FC.Agent.Agent,
  data: FC.Agent.Page[]
) => FC.Agent.Dispatch;

const normalizePages: NormalizeDataFn = (agent, data) => {
  const { type } = agent.register();

  switch (type) {
    case 'cinemas':
    default:
      return normalize(data, cinemaSchema);
  }
};

export default normalizePages;
