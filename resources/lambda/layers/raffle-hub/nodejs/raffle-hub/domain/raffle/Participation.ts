import { Prize } from './Prize';

export interface Participation {
  readonly wallet: string;
  readonly hasWon: boolean;
  readonly wonPrize: Prize;
  readonly raffleUuid: string;
}
