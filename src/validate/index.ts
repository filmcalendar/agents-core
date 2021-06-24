import AJV from 'ajv';
import addFormats from 'ajv-formats';
import schemas from '@filmcalendar/schemas';

import type { ErrorObject, ValidateFunction } from 'ajv';
import type * as FC from '@filmcalendar/types';

class ValidationError extends Error {
  public body: string;

  constructor(message: string, errors?: ErrorObject[] | null) {
    super(message);
    this.name = 'ValidationError';
    this.body = JSON.stringify(errors, null, 2);
  }
}

function validateReport(
  agent: FC.Agent.Agent,
  report: FC.Agent.Dispatch
): boolean | never {
  const { jsonSchema } = schemas;
  const ajv = new AJV({ allErrors: true });
  addFormats(ajv);
  const { type } = agent.register();

  let isValid;
  let validate: ValidateFunction;
  switch (type) {
    case 'films':
    default:
      validate = ajv.compile(jsonSchema.films);
      isValid = validate(report);
  }

  if (!isValid) {
    throw new ValidationError('Payload is not valid', validate.errors);
  }

  return true;
}

export default validateReport;
