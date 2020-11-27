import AJV from 'ajv';
import type * as FC from '@filmcalendar/types';
import schemas from '@filmcalendar/schemas';

class ValidationError extends Error {
  public body: string;

  constructor(message: string, errors?: AJV.ErrorObject[] | null) {
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
  const { type } = agent.register();

  let isValid;
  let validate: AJV.ValidateFunction;
  switch (type) {
    case 'cinemas':
    default:
      validate = ajv.compile(schemas.cinemas);
      isValid = validate(report);
  }

  if (!isValid) {
    throw new ValidationError('Payload is not valid', validate.errors);
  }

  return true;
};

export default validateReport;
