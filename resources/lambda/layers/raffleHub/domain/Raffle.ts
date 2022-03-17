import { Prize } from './Prize';
import { Requirement } from './requirements/Requirement';

export enum RaffleType {
  CLASSIC = 'classic',
  SLOT_MACHINE = 'slot_machine',
}

export interface Raffle {
  readonly uuid: string;
  readonly creator: string;
  readonly name: string;
  readonly image: string;
  readonly prizes: Prize[];
  readonly type: RaffleType;
  readonly endDate: Date;
  readonly winners: string[];
  readonly requirements: Requirement[];
}
