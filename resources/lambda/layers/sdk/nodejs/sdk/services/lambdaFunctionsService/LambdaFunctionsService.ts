import { LambdaFunctionsRepository } from '../../infra/repositories/lambdaFunctionsRepository/LambdaFunctionsRepository';

export class LambdaFunctionsService {
  private lambdaFunctionsRepository: LambdaFunctionsRepository;

  constructor(lambdaFunctionsRepository: LambdaFunctionsRepository) {
    this.lambdaFunctionsRepository = lambdaFunctionsRepository;
  }

  async invokeSendMessageToClients(userUuids: string[], context: string, data: any): Promise<any> {
    return this.lambdaFunctionsRepository.invokeSendMessageToClients(userUuids, context, data);
  }
}
