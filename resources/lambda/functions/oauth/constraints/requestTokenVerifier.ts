import { isEmpty } from '/opt/nodejs/sdk/utils/validate/validation/isEmpty';
import isUUID from 'validator/lib/isUUID';
import { ErrorDetails } from '/opt/nodejs/sdk/infra/controllers/BaseController';
import { validate } from '/opt/nodejs/sdk/utils/validate';
import { getOAuthProvider } from './utils';

export const requestTokenVerification = (
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
    state: {
      value: event.queryParameters.state,
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'is not valid state',
      },
    },
    code: {
      value: event.queryParameters.code,
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'has one or more not valid UUIDs',
      },
    },
  });
};
