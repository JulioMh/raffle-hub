import { RequestTokenUseCase } from './RequestTokenUseCase';
import { oauthRepository } from '/opt/nodejs/raffle-hub/infra/repositories/oauth';
import { userRepository } from '/opt/nodejs/raffle-hub/infra/repositories/user';

export const requestTokenUseCase = new RequestTokenUseCase({ userRepository, oauthRepository });
