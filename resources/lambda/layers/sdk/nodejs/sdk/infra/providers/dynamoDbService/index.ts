import AWSXRay from 'aws-xray-sdk-core';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DynamoDbService } from './DynamoDbService';

const { MOCK_DYNAMODB_ENDPOINT, AWS_XRAY_CAPTURE_ENABLED } = <
  {
    MOCK_DYNAMODB_ENDPOINT: string;
    AWS_XRAY_CAPTURE_ENABLED: string;
  }
>process.env;

let client: any = new DynamoDB({
  apiVersion: '2012-08-10',
  ...(MOCK_DYNAMODB_ENDPOINT && {
    endpoint: MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: 'local',
  }),
});

client = AWS_XRAY_CAPTURE_ENABLED === 'true' ? AWSXRay.captureAWSClient(client) : client;

const ddbClient: any = new DynamoDB.DocumentClient({
  service: client,
});
ddbClient.service = client;

export { DynamoDbService } from './DynamoDbService';
export const dynamoDbService: DynamoDbService = new DynamoDbService(ddbClient);
