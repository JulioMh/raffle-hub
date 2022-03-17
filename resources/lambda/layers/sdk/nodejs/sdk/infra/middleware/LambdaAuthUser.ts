import { LambdaResponse, BaseController } from '../controllers/BaseController';
import { authAndGetUserUuid } from '../../utils/auth';
/**
 * This MUST be called after the LambdaEventValidator middleware
 * @returns calls function decorated with the new arguments that includes userUuid
 */
export const LambdaAuthUser = () => {
  return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>): void => {
    const oldMethod = descriptor.value;
    descriptor.value = async (values: Record<string, any>): Promise<LambdaResponse> => {
      let newValues;
      try {
        const { authorization, ...rest } = values;

        newValues = { userUuid: await authAndGetUserUuid(authorization), authorization, ...rest };

        return oldMethod.apply(this, [newValues]);
      } catch (error: any) {
        return BaseController.buildErrorResponse(JSON.parse(error.message).error);
      }
    };
  };
};
