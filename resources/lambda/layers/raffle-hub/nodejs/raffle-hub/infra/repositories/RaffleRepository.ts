import { DynamoDbService } from '../../../sdk/nodejs/sdk/infra/providers/dynamoDbService/DynamoDbService';
import { Collection } from '../../domain/Collection';
import { Raffle } from '../../domain/Raffle';

const { DYNAMO_TABLE_NAME_RAFFLES } = <
  {
    DYNAMO_TABLE_NAME_RAFFLES: string;
  }
>process.env;

export class CollectionRepository {
  private dbService: DynamoDbService;

  constructor(dbService: DynamoDbService) {
    this.dbService = dbService;
  }

  async getByCreator(address: string): Promise<Collection> {
    return this.dbService.query({
      TableName: DYNAMO_TABLE_NAME_RAFFLES,
      KeyConditionExpression: 'address = :address',
      ExpressionAttributeValues: {
        ':address': address,
      },
    });
  }

  async getByUpdateAuthority(updateAuthority: string): Promise<Raffle> {
    return this.dbService.query({
      TableName: DYNAMO_TABLE_NAME_RAFFLES,
      IndexName: 'UpdateAuthority',
      KeyConditionExpression: 'updateAuthority = :updateAuthority',
      ExpressionAttributeValues: {
        ':updateAuthority': updateAuthority,
      },
    });
  }
}
