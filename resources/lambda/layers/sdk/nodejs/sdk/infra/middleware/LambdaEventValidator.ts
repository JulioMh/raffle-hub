import { hideUserToken } from '../../utils/auth';
import { LambdaResponse, BaseController, ErrorDetails } from '../controllers/BaseController';

/**
 * It verifies all the attributes specified in the validatorFunction
 * @param validatorFunction The function that returns the correct values and errors
 * @returns calls function decorated with the new arguments validated
 */
export const LambdaEventValidator = (
  validatorFunction: (event: any) => { values: Record<string, any>; errors: ErrorDetails[] }
) => {
  return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) => {
    const oldMethod = descriptor.value;
    descriptor.value = async (event: any): Promise<LambdaResponse> => {
      console.log(JSON.stringify(hideUserToken(event)));
      if (!event.queryStringParameters) event.queryStringParameters = {};
      if (!event.headers) event.headers = {};
      if (!event.body) event.body = '';
      const { values, errors } = validatorFunction(event);

      if (errors.length > 0) {
        return BaseController.validationFailed(errors);
      }

      return oldMethod.apply(this, [values]);
    };
  };
};
