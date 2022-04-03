import { OAuthProvider } from './Credentials';

export interface SocialMediaProfile {
  readonly id: string;
  readonly username: string;
  readonly name?: string;
  readonly avatar?: string;
  readonly type: OAuthProvider;
}

export interface DiscordProfile extends Exclude<SocialMediaProfile, 'name'> {
  readonly avatar: string;
  readonly type: OAuthProvider.DISCORD;
}

export interface TwitterProfile extends Exclude<SocialMediaProfile, 'avatar'> {
  readonly name: string;
  readonly type: OAuthProvider.TWITTER;
}

export interface Profile {
  twitter: TwitterProfile;
  discord: DiscordProfile;
}
