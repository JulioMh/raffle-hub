import { BaseController, LambdaResponse } from '/opt/nodejs/sdk/infra/controllers/BaseController';
import { requestTokenVerification } from './constraints/requestTokenVerifier';
import { LambdaEventValidator } from '/opt/nodejs/sdk/infra/middleware/LambdaEventValidator';
import { requestTokenUseCase } from './useCase/requestToken';
import { RequestTokenUseCaseRunProps } from './useCase/requestToken/RequestTokenUseCase';
import { UserAdapter } from '/opt/nodejs/raffle-hub/infra/adapters/UserAdapter';

export class RequestTokenLambda {
  @LambdaEventValidator(requestTokenVerification)
  static async lambdaHandler(event: RequestTokenUseCaseRunProps): Promise<LambdaResponse> {
    const user = await requestTokenUseCase.run(event);

    return BaseController.ok(UserAdapter.toResponse(user));
  }
}

export const { lambdaHandler } = RequestTokenLambda;
