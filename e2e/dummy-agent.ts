import type * as FC from '@filmcalendar/types';

export const ref = 'dummy-agent';

export const register: FC.Agent.RegisterFn = () => ({
  agent: ref,
  country: 'uk',
  language: 'en-GB',
  type: 'films',
});

export const providers: FC.Agent.ProvidersFn = async () => [
  {
    name: 'Dummy',
    type: 'cinema',
    url: 'https://foobar.com',
  },
];

export const featured: FC.Agent.FeaturedFn = async () => {
  return [];
};

export const programme: FC.Agent.ProgrammeFn = async () => {
  return {
    programme: [],
  };
};

export const page: FC.Agent.PageFn = async (url, provider) => {
  return {
    url,
    provider,
    films: [],
  };
};
