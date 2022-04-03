export enum Categories {
  PFP,
  ART,
  GAME,
  METAVERSE,
  DEFI,
  GAMBLING,
}

interface Discord {
  guildId: string;
  holderRoleId: string;
}

export interface Collection {
  readonly updateAuthority: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly discord: Discord;
  readonly twitter_id: string;
  readonly website: string;
  readonly categories: Categories[];
}
