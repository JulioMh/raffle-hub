export enum OAuthProvider {
  TWITTER = 'twitter',
  DISCORD = 'discord',
}

export interface OAuth {
  expireDate: Date;
  accessToken: string;
  refreshToken: string;
  type: OAuthProvider;
}

export interface TwitterOAuth extends OAuth {
  type: OAuthProvider.TWITTER;
}

export interface DiscordOAuth extends OAuth {
  type: OAuthProvider.DISCORD;
}

export interface Credentials {
  twitter: TwitterOAuth;
  discord: DiscordOAuth;
}
