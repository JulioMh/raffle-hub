import { isEmpty } from './validation/isEmpty';
import { Constraints } from './Constraints';
import { ErrorDetails } from '../../infra/controllers/BaseController';

export * from './validation';
export * from './Constraints';
export const validate = (constraints: Constraints) => {
  try {
    const invalidFields: ErrorDetails[] = [];
    const validFields: Record<string, any> = {};

    Object.keys(constraints).forEach((name: string) => {
      const { optional, validator, value } = constraints[name];

      if (optional && isEmpty(value)) {
        return;
      }

      const { errorMessage } = validator;

      if (!optional && isEmpty(value)) {
        invalidFields.push({ field: name, error_msg: errorMessage });
        return;
      }

      if (!validator.validate) {
        validFields[name] = value;
        return;
      }

      if (!validator.validate(value)) {
        invalidFields.push({ field: name, error_msg: errorMessage });
      } else {
        validFields[name] = value;
      }
    });

    return { errors: invalidFields, values: validFields };
  } catch (error) {
    console.error(error);
    return {
      errors: [{ field: '', error_msg: 'error in validation' }],
      values: [],
    };
  }
};
