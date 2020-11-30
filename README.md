# filmcalendar/agents-core

<p>
  <img src="https://img.shields.io/npm/v/@filmcalendar/agents-core">
  <a href="https://codecov.io/gh/filmcalendar/agents-core">
    <img src="https://codecov.io/gh/filmcalendar/agents-core/branch/main/graph/badge.svg?token=bpP3FyzgXg"/>
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

| Script                       |                                             |
| ---------------------------- | ------------------------------------------- |
| `fc-agents-init`             | Spawns agents on 10 sec interval            |
| `fc-agents-docker-build`     | Build country level docker image            |
| `fc-agents-docker-run-local` | Runs a country level docker image (locally) |

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
