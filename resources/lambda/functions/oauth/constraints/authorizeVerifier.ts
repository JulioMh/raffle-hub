import { isEmpty } from '/opt/nodejs/sdk/utils/validate/validation/isEmpty';
import { ErrorDetails } from '/opt/nodejs/sdk/infra/controllers/BaseController';
import { validate } from '/opt/nodejs/sdk/utils/validate';
import isUUID from 'validator/lib/isUUID';
import { getOAuthProvider } from './utils';

export const authorizeVerifier = (
  event: any
): {
  errors: ErrorDetails[];
  values: Record<string, any>;
} => {
  return validate({
    provider: {
      value: getOAuthProvider(event.rawPath),
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'is not valid oauth provider',
      },
    },
    userUuid: {
      value: event.pathParameters.userUuid,
      validator: {
        validate: (value: string) => isUUID(value),
        errorMessage: 'is not valid user UUID',
      },
    },
  });
};
