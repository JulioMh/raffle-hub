import { OAuthProvider } from '/opt/nodejs/raffle-hub/domain/user/Credentials';
import { User } from '/opt/nodejs/raffle-hub/domain/user/User';
import { OAuthServiceFactory } from '/opt/nodejs/raffle-hub/infra/providers/oauth/OAuthServiceFactory';
import { SocialMediaServiceFactory } from '/opt/nodejs/raffle-hub/infra/providers/socialMedia/SocialMediaServiceFactory';
import { OAuthRepository } from '/opt/nodejs/raffle-hub/infra/repositories/oauth/OAuthRepository';
import { UserRepository } from '/opt/nodejs/raffle-hub/infra/repositories/user/UserRepository';
import { NotFoundError } from '/opt/nodejs/raffle-hub/shared/errors/NotFoundError';

export interface RequestTokenUseCaseRunProps {
  provider: OAuthProvider;
  userUuid: string;
  code: string;
  state: string;
}

interface RequestTokenUseCaseProps {
  userRepository: UserRepository;
  oauthRepository: OAuthRepository;
}

export class RequestTokenUseCase {
  private userRepository: UserRepository;
  private oauthRepository: OAuthRepository;

  constructor({ userRepository, oauthRepository }: RequestTokenUseCaseProps) {
    this.oauthRepository = oauthRepository;
    this.userRepository = userRepository;
  }

  async run({ provider, userUuid, code, state }: RequestTokenUseCaseRunProps): Promise<User> {
    const user = await this.userRepository.getUser(userUuid);
    const savedVerification = await this.oauthRepository.getVerification(state);

    if (!savedVerification) {
      throw new NotFoundError('State is not found in database');
    }

    const oauthService = OAuthServiceFactory.createOAuthService(provider, {
      codeChallenge: savedVerification.codeChallenge,
    });

    const credentials = await oauthService.requestToken(code);

    user.credentials = credentials;

    const socialMediaService = SocialMediaServiceFactory.createSocialMediaService(provider);

    const socialMediaProfile = await socialMediaService.getUserData(credentials);

    user.profile = socialMediaProfile;

    await this.userRepository.update(user);

    return user;
  }
}
