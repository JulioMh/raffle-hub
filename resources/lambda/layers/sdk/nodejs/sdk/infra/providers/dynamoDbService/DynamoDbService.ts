/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DbService } from '../../DbService';

export class DynamoDbService extends DbService {
  private ddbClient: DocumentClient;

  constructor(ddbClient: DocumentClient) {
    super();
    this.ddbClient = ddbClient;
  }

  public async get(params: DocumentClient.GetItemInput): Promise<any> {
    const getRes = await this.ddbClient.get(params).promise();
    return getRes.Item;
  }

  public async put(params: DocumentClient.PutItemInput): Promise<any> {
    const putRes = await this.ddbClient.put(params).promise();
    return putRes.Attributes;
  }

  public async update(params: DocumentClient.UpdateItemInput): Promise<any> {
    const updateRes = await this.ddbClient.update(params).promise();
    return updateRes.Attributes;
  }

  public async delete(params: DocumentClient.DeleteItemInput): Promise<any> {
    const deleteRes = await this.ddbClient.delete(params).promise();
    return deleteRes.Attributes;
  }

  public async query(params: DocumentClient.QueryInput): Promise<any> {
    const queryRes = await this.ddbClient.query(params).promise();
    if (!queryRes.Items) {
      console.error(JSON.stringify(queryRes));
      throw new Error('Database Error');
    }
    return queryRes.Items;
  }

  public async scan(params: DocumentClient.ScanInput): Promise<any> {
    const scanRes = await this.ddbClient.scan(params).promise();
    if (!scanRes.Items) {
      console.error(JSON.stringify(scanRes));
      throw new Error('Database Error');
    }
    return scanRes.Items;
  }

  public async bigQuery(params: DocumentClient.QueryInput): Promise<any> {
    let queryRes: DocumentClient.QueryOutput;
    const itemList: Record<string, unknown>[] = [];

    do {
      queryRes = await this.ddbClient.query(params).promise();
      if (!queryRes.Items) {
        console.error(JSON.stringify(queryRes));
        throw new Error('Database Error');
      }
      itemList.push(...queryRes.Items);
      params.ExclusiveStartKey = queryRes.LastEvaluatedKey;
    } while (queryRes.LastEvaluatedKey);

    return itemList;
  }

  public async bigScan(params: DocumentClient.ScanInput): Promise<any> {
    let scanRes: DocumentClient.ScanOutput;
    const itemList: Record<string, unknown>[] = [];

    do {
      scanRes = await this.ddbClient.scan(params).promise();
      if (!scanRes.Items) {
        console.error(JSON.stringify(scanRes));
        throw new Error('Database Error');
      }
      itemList.push(...scanRes.Items);
      params.ExclusiveStartKey = scanRes.LastEvaluatedKey;
    } while (scanRes.LastEvaluatedKey);

    return itemList;
  }

  public async batchWrite(
    batchItems: DocumentClient.WriteRequests,
    tableName: string
  ): Promise<void> {
    const batchItemsShallowCopy = [...batchItems];
    while (batchItemsShallowCopy.length > 0) {
      const batchItems25 = batchItemsShallowCopy.splice(0, 25);
      const params = {
        RequestItems: {
          [tableName]: batchItems25,
        },
      };
      const batchRes = await this.ddbClient.batchWrite(params).promise();
      const { UnprocessedItems = {} } = batchRes;
      if (UnprocessedItems[tableName]) {
        console.error(
          'Unprocessed Items Batch Write: ',
          JSON.stringify(UnprocessedItems[tableName])
        );
        batchItemsShallowCopy.splice(1, 0, ...UnprocessedItems[tableName]);
      }
    }
  }

  public async batchGet({
    TableName,
    Keys,
    ProjectionExpression,
    ExpressionAttributeNames,
  }: {
    TableName: string;
    Keys: DocumentClient.KeyList;
    ProjectionExpression?: string;
    ExpressionAttributeNames?: DocumentClient.ExpressionAttributeNameMap;
  }): Promise<any> {
    const keysCopied = [...Keys];
    const results: DocumentClient.ItemList = [];

    while (keysCopied.length > 0) {
      const subKeys = keysCopied.splice(0, 100);

      const { Responses, UnprocessedKeys } = await this.ddbClient
        .batchGet({
          RequestItems: {
            [TableName]: {
              Keys: subKeys,
              ProjectionExpression,
              ExpressionAttributeNames,
            },
          },
        })
        .promise();

      if (UnprocessedKeys![TableName]) {
        console.error('Unprocessed Keys Batch Get: ', JSON.stringify(UnprocessedKeys![TableName]));
        keysCopied.push(...UnprocessedKeys![TableName].Keys);
      }
      results.push(...Responses![TableName]);
    }

    return results;
  }

  public createSet(array: string[] | number[]): DocumentClient.DynamoDbSet {
    return this.ddbClient.createSet(array);
  }
}
