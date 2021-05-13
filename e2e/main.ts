import program from '@filmcalendar/agents-core';

import * as DummyAgent from './dummy-agent';

const agents = { dummy: DummyAgent };

program(agents);
