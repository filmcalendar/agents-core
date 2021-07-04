# @filmcalendar/agents-core

<p>
  <img src="https://img.shields.io/npm/v/@filmcalendar/agents-core">
  <a href="https://codeclimate.com/github/filmcalendar/agents-core/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/ff91dc7fd2576f0d4bc7/maintainability" />
  </a>
  <a href="https://codeclimate.com/github/filmcalendar/agents-core/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/ff91dc7fd2576f0d4bc7/test_coverage" />
  </a>
  <img src="https://github.com/filmcalendar/agents-core/workflows/Build/badge.svg">
</p>

> Agent's core engine - operation, normalization and validation

## Usage

```typescript
import program from '@filmcalendar/agents-core"
import agents from "./agents"

program(agents)
```

| Script                         |                                                  |
| ------------------------------ | ------------------------------------------------ |
| `fc-agents-docker-build-local` | Build a country level docker image (locally)     |
| `fc-agents-docker-run-local`   | Run a country level docker image (locally)       |
| `fc-agents-docker-build-prod`  | Run a country level docker image (from registry) |

## Install

```bash
$ npm install @filmcalendar/agents-core

# or with yarn
$ yarn add @filmcalendar/agents-core
```

## Contribute

Contributions are always welcome!

## License

MIT
