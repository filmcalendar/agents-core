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

type ValidateFn = (
  agent: FC.Agent.Agent,
  data: FC.Agent.Dispatch
) => boolean | never;
const validateReport: ValidateFn = (agent, report) => {
  const ajv = new AJV({ allErrors: true });
  addFormats(ajv);
  const { type } = agent.register();

  let isValid;
  let validate: ValidateFunction;
  switch (type) {
    case 'films':
    default:
      validate = ajv.compile(schemas.films);
      isValid = validate(report);
  }

  if (!isValid) {
    throw new ValidationError('Payload is not valid', validate.errors);
  }

  return true;
};

export default validateReport;
