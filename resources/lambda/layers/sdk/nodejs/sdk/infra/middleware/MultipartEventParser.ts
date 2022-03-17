/* eslint-disable security/detect-object-injection */
import parser from 'lambda-multipart-parser';
import { BaseController, LambdaResponse } from '../controllers/BaseController';

export const MultipartEventParser = () => {
  return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) => {
    const oldMethod = descriptor.value;
    descriptor.value = async (event: any): Promise<LambdaResponse> => {
      try {
        if (!event.headers['content-type']?.includes('multipart/form-data')) {
          return oldMethod.apply(this, [event]);
        }
        const { files, ...fields } = await parser.parse(event);
        return oldMethod.apply(this, [
          {
            files,
            fields,
            ...event,
          },
        ]);
      } catch (error) {
        console.error(error);
        return BaseController.fail();
      }
    };
  };
};
