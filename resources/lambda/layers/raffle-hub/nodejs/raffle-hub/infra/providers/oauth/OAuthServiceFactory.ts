import { OAuthProvider } from '../../../domain/user/Credentials';
import { TwitterOAuthService } from './imp/TwitterOAuthService';
import { DiscordOAuthService } from './imp/DiscordOAuthService';
import { OAuthService, OAuthServiceProps } from './OAuthService';
import { InvalidProviderError } from '../../../shared/errors/InvalidProviderError';

export class OAuthServiceFactory {
  static createOAuthService(
    oauthProvider: OAuthProvider,
    props?: Partial<OAuthServiceProps>
  ): OAuthService {
    if (oauthProvider === OAuthProvider.TWITTER) {
      return new TwitterOAuthService(props?.codeChallenge);
    }
    if (oauthProvider === OAuthProvider.DISCORD) {
      return new DiscordOAuthService();
    }
    throw new InvalidProviderError();
  }
}
