import { normalize } from 'normalizr';
import type * as FC from '@filmcalendar/types';
import schemas from '@filmcalendar/schemas';
import type { NormalizedSchema } from 'normalizr';

import type Agent from 'src/agent';

function normalizePages(
  agent: Agent,
  data: FC.Agent.Page[]
): NormalizedSchema<FC.Dispatch.Dispatch, unknown> {
  const { normalizr: schema } = schemas;
  const { type } = agent.register();

  switch (type) {
    case 'films':
    default:
      return normalize(data, schema.films);
  }
}

export default normalizePages;
