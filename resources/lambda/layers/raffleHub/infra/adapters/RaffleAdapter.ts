import { Raffle } from '../../domain/Raffle';

interface RaffleDB extends Raffle {
  readonly searchName: string;
}
export class RaffleAdapter {
  static toDb(raffle: Raffle): RaffleDB {
    return {
      ...raffle,
      searchName: raffle.name.toLocaleLowerCase(),
    };
  }

  static fromDb({ searchName, ...raffle }: RaffleDB): Raffle {
    return raffle;
  }
}
