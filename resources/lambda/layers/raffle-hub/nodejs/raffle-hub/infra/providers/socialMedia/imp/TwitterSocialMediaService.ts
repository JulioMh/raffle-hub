import { TwitterProfile } from '../../../../domain/user/Profile';
import { OAuth, OAuthProvider } from '../../../../domain/user/Credentials';
import { SocialMediaService } from '../SocialMediaService';
import config from '../../../../config';

const { baseUrl } = config.twitter;

export class TwitterSocialMediaService implements SocialMediaService {
  async getUserData({ accessToken }: OAuth): Promise<TwitterProfile> {
    const response = await fetch(`${baseUrl}/2/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { id, name, username } = await response.json();

    return { id, name, username, type: OAuthProvider.TWITTER };
  }
}
