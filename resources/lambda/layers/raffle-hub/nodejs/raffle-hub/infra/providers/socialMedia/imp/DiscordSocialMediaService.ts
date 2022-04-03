import { DiscordProfile } from '../../../../domain/user/Profile';
import { OAuth, OAuthProvider } from '../../../../domain/user/Credentials';
import { SocialMediaService } from '../SocialMediaService';
import config from '../../../../config';

const { baseUrl } = config.discord;

export class DiscordSocialMediaService implements SocialMediaService {
  async getUserData({ accessToken }: OAuth): Promise<DiscordProfile> {
    const response = await fetch(`${baseUrl}/api/v8/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { id, avatar, username } = await response.json();

    return { id, avatar, username, type: OAuthProvider.DISCORD };
  }
}
