import { BaseController, LambdaResponse } from '/opt/nodejs/sdk/infra/controllers/BaseController';
import { authorizeVerifier } from './constraints/authorizeVerifier';
import { LambdaEventValidator } from '/opt/nodejs/sdk/infra/middleware/LambdaEventValidator';
import { AuthorizeUseCaseRunProps } from './useCase/authorize/AuthorizeUseCase';
import { authorizeUseCase } from './useCase/authorize';

export class AuthorizeLambda {
  @LambdaEventValidator(authorizeVerifier)
  static async lambdaHandler(event: AuthorizeUseCaseRunProps): Promise<LambdaResponse> {
    const authorizeUrl = await authorizeUseCase.run(event);

    return BaseController.ok(authorizeUrl);
  }
}

export const { lambdaHandler } = AuthorizeLambda;
