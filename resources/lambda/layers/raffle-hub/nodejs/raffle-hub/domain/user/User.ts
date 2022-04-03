import { Credentials, OAuth, OAuthProvider } from './Credentials';
import { DiscordProfile, Profile, SocialMediaProfile, TwitterProfile } from './Profile';

export class User {
  readonly uuid: string;
  readonly wallet: string;
  private _credentials: Credentials;
  private _profile: Profile;

  get username(): string {
    return this._profile.discord.username;
  }

  get avatar(): string {
    return this._profile.discord.avatar;
  }

  set credentials(credentials: OAuth) {
    if (credentials.type === OAuthProvider.TWITTER)
      this._credentials.twitter = { ...credentials, type: OAuthProvider.TWITTER };
    if (credentials.type === OAuthProvider.DISCORD)
      this._credentials.discord = { ...credentials, type: OAuthProvider.DISCORD };
  }

  set profile(profile: SocialMediaProfile) {
    if (profile.type === OAuthProvider.TWITTER) this._profile.twitter = profile as TwitterProfile;
    if (profile.type === OAuthProvider.DISCORD) this._profile.discord = profile as DiscordProfile;
  }
}
