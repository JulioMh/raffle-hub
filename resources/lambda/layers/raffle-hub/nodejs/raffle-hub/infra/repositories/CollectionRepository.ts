import { DynamoDbService } from '../../../sdk/nodejs/sdk/infra/providers/dynamoDbService/DynamoDbService';
import { Collection } from '../../domain/Collection';

const { DYNAMO_TABLE_NAME_COLLECTIONS } = <
  {
    DYNAMO_TABLE_NAME_COLLECTIONS: string;
  }
>process.env;

export class CollectionRepository {
  private dbService: DynamoDbService;

  constructor(dbService: DynamoDbService) {
    this.dbService = dbService;
  }

  // THIS NEEDS TO BE ORDERED AND PAGINATED
  async getCollections(): Promise<Collection> {
    return this.dbService.scan({
      TableName: DYNAMO_TABLE_NAME_COLLECTIONS,
    });
  }
}
