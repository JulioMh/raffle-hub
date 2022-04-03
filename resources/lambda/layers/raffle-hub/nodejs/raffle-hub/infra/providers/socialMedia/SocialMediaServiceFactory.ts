import { OAuthProvider } from '../../../domain/user/Credentials';
import { SocialMediaService } from './SocialMediaService';
import { TwitterSocialMediaService } from './imp/TwitterSocialMediaService';
import { DiscordSocialMediaService } from './imp/DiscordSocialMediaService';
import { InvalidProviderError } from '../../../shared/errors/InvalidProviderError';

export class SocialMediaServiceFactory {
  static createSocialMediaService(provider: OAuthProvider): SocialMediaService {
    if (provider === OAuthProvider.TWITTER) {
      return new TwitterSocialMediaService();
    }
    if (provider === OAuthProvider.DISCORD) {
      return new DiscordSocialMediaService();
    }
    throw new InvalidProviderError();
  }
}
