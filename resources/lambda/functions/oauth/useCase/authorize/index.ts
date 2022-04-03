import { AuthorizeUseCase } from './AuthorizeUseCase';
import { oauthRepository } from '/opt/nodejs/raffle-hub/infra/repositories/oauth';

export const authorizeUseCase = new AuthorizeUseCase(oauthRepository);
