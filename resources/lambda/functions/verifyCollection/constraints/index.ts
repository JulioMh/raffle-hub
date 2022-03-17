import { ErrorDetails } from '/opt/nodejs/sdk/infra/controllers/BaseController';
import { isEmpty } from '/opt/nodejs/sdk/utils/validate/validation/isEmpty';
import { validate } from '/opt/nodejs/sdk/utils/validate';

const parseRequestBody = (event: any): any | undefined => {
  try {
    return JSON.parse(event.body);
  } catch (error) {
    console.error(`Cannot parse body with Request: ${JSON.stringify(event)}`, error);
    return undefined;
  }
};

export const createTransactionVerifier = (
  event: any
): {
  errors: ErrorDetails[];
  values: Record<string, any>;
} =>
  validate({
    updateAuthority: {
      value: parseRequestBody(event)?.updateAuthority,
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'invalid update authority',
      },
    },
    name: {
      value: parseRequestBody(event)?.name,
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'invalid name',
      },
    },
    description: {
      value: parseRequestBody(event)?.description,
      optional: true,
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'invalid description',
      },
    },
    image: {
      value: parseRequestBody(event)?.image,
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'invalid image',
      },
    },
    twitter: {
      value: parseRequestBody(event)?.twitter,
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'invalid twitter',
      },
    },
    discord: {
      value: parseRequestBody(event)?.discord,
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'invalid discord',
      },
    },
    website: {
      value: parseRequestBody(event)?.website,
      validator: {
        validate: (value: string) => !isEmpty(value),
        errorMessage: 'invalid website',
      },
    },
    categories: {
      value: parseRequestBody(event)?.categories,
      validator: {
        validate: (value: string[]) => !value.length,
        errorMessage: 'invalid categories',
      },
    },
  });
