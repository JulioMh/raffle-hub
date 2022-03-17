export enum Categories {
  PFP,
  ART,
  GAME,
  METAVERSE,
  DEFI,
  GAMBLING,
}
export interface Collection {
  readonly updateAuthority: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly twitter: string;
  readonly discord: string;
  readonly website: string;
  readonly categories: Categories[];
}
