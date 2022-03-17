import { Collection } from '../../domain/Collection';

interface CollectionDB extends Collection {
  readonly searchName: string;
}
export class CollectionAdapter {
  static toDb(collection: Collection): CollectionDB {
    return {
      ...collection,
      searchName: collection.name.toLocaleLowerCase(),
    };
  }

  static fromDb({ searchName, ...collection }: CollectionDB): Collection {
    return collection;
  }
}
