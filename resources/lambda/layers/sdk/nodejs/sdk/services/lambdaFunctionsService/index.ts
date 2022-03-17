import { lambdaFunctionsRepository } from '../../infra/repositories/lambdaFunctionsRepository';
import { LambdaFunctionsService } from './LambdaFunctionsService';

export { LambdaFunctionsService } from './LambdaFunctionsService';
export const lambdaFunctionsService = new LambdaFunctionsService(lambdaFunctionsRepository);
