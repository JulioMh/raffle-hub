import { OAuthProvider } from '/opt/nodejs/raffle-hub/domain/user/Credentials';
import { OAuthServiceFactory } from '/opt/nodejs/raffle-hub/infra/providers/oauth/OAuthServiceFactory';
import { OAuthRepository } from '/opt/nodejs/raffle-hub/infra/repositories/oauth/OAuthRepository';

export interface AuthorizeUseCaseRunProps {
  provider: OAuthProvider;
  userUuid: string;
}

export class AuthorizeUseCase {
  private oauthRepository: OAuthRepository;

  constructor(oauthRepository: OAuthRepository) {
    this.oauthRepository = oauthRepository;
  }

  async run({ provider, userUuid }: AuthorizeUseCaseRunProps): Promise<string> {
    const oauthService = OAuthServiceFactory.createOAuthService(provider);
    await this.oauthRepository.saveVerification({
      userUuid,
      state: oauthService.state,
      codeChallenge: oauthService.codeChallenge,
    });

    return oauthService.getAuthorizeUrl(userUuid);
  }
}
