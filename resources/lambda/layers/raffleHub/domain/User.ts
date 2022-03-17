import { Collection } from './Collection';

export class User {
  readonly wallet: string;
  readonly collections: Collection[];
  readonly twitter: string;
  readonly discordId: string;
}
