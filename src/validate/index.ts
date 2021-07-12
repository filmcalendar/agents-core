import AJV from 'ajv';
import addFormats from 'ajv-formats';
import schemas from '@filmcalendar/schemas';
import { submitError } from '@tuplo/unhandler';

import type { ErrorObject, ValidateFunction } from 'ajv';
import type * as FC from '@filmcalendar/types';

import type Agent from 'src/agent';

class ValidationError extends Error {
  public body: string;

  constructor(message: string, errors?: ErrorObject[] | null) {
    super(message);
    this.name = 'ValidationError';
    this.body = JSON.stringify(errors, null, 2);
  }
}

async function validateReport(
  agent: Agent,
  report: FC.Dispatch.Dispatch
): Promise<boolean> {
  const { jsonSchema } = schemas;
  const ajv = new AJV({ allErrors: true });
  addFormats(ajv);
  const { agent: agentRef, type } = agent.register();

  let isValid;
  let validate: ValidateFunction;
  switch (type) {
    case 'films':
    default:
      validate = ajv.compile(jsonSchema.films);
      isValid = validate(report);
  }

  if (process.env.NODE_ENV !== 'development' && !isValid) {
    const error = new ValidationError('Payload is not valid', validate.errors);
    await submitError(error, {
      appName: agentRef,
      providers: {
        github: {
          user: process.env.FC_GIT_USER as string,
          repo: process.env.FC_GIT_REPO_SRC as string,
          token: process.env.FC_GIT_PASSWORD as string,
        },
      },
    });
  }

  return Boolean(isValid);
}

export default validateReport;
