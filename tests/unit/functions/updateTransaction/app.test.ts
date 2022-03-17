import { lambdaHandler } from '../../../../resources/lambda/functions/ackTransaction/AckTransactionLambda';
import { withWebhook, withoutWebhook } from './fixture/transaction.json';
import { dynamoDbService } from '/opt/nodejs/syncSdk/infra/providers/dynamoDbService';
import { sqsService } from '/opt/nodejs/syncSdk/infra/providers/sqsService';
import TransactionAdapter from '/opt/nodejs/ledger/infrastructure/adapters/TransactionAdapter';
import { Status, Transaction } from '/opt/nodejs/ledger/domain/Transaction';
import { httpRequest } from '/opt/nodejs/syncSdk/infra/httpRequest';

const { DYNAMO_LEDGER_MANAGER_TABLE_NAME, SQS_NEW_TRANSACTION_QUEUE_URL } = <
  { DYNAMO_LEDGER_MANAGER_TABLE_NAME: string; SQS_NEW_TRANSACTION_QUEUE_URL: string }
>process.env;

jest.mock('/opt/nodejs/syncSdk/infra/httpRequest', () => ({
  httpRequest: jest.fn().mockImplementation((url) => {
    if (url === withWebhook.webhook.url) {
      return Promise.reject(new Error());
    }
    return Promise.resolve({
      kycStatus: 'DONE',
      userUuid: '414bcf25-8a73-4da4-ba33-c98fc82e4e80',
    });
  }),
}));

jest.mock('/opt/nodejs/syncSdk/infra/providers/sqsService', () => ({
  sqsService: {
    ackMessage: jest.fn(),
  },
}));

describe('Lambda :: Ack transaction', () => {
  beforeEach(async () => {
    await dynamoDbService.put({
      TableName: DYNAMO_LEDGER_MANAGER_TABLE_NAME,
      Item: TransactionAdapter.toDb({ ...withoutWebhook, status: Status.PENDING } as Transaction),
    });
    await dynamoDbService.put({
      TableName: DYNAMO_LEDGER_MANAGER_TABLE_NAME,
      Item: TransactionAdapter.toDb({ ...withWebhook, status: Status.PENDING } as Transaction),
    });
  });

  test('should ack transaction', async () => {
    const event = {
      Records: [
        {
          receiptHandle: 'xxx',
          body: withoutWebhook.transactionUuid,
        },
      ],
    };

    const result = await lambdaHandler(event);
    expect(result).toMatchObject({
      statusCode: 200,
      isBase64Encoded: false,
    });

    const transactionInDynamo = await dynamoDbService.get({
      TableName: DYNAMO_LEDGER_MANAGER_TABLE_NAME,
      Key: { transactionUuid: withoutWebhook.transactionUuid },
    });

    expect(TransactionAdapter.fromDb(transactionInDynamo)).toEqual(withoutWebhook);

    expect(sqsService.ackMessage).toHaveBeenCalledWith(
      event.Records[0].receiptHandle,
      SQS_NEW_TRANSACTION_QUEUE_URL
    );
  });

  test('should flag as failed webhook transaction', async () => {
    const event = {
      Records: [
        {
          receiptHandle: 'xxx',
          body: withWebhook.transactionUuid,
        },
      ],
    };

    const result = await lambdaHandler(event);
    expect(result).toMatchObject({
      statusCode: 200,
      isBase64Encoded: false,
    });

    expect(httpRequest).toHaveBeenCalledWith(withWebhook.webhook.url, withWebhook.webhook.options);

    const transactionInDynamo = await dynamoDbService.get({
      TableName: DYNAMO_LEDGER_MANAGER_TABLE_NAME,
      Key: { transactionUuid: withWebhook.transactionUuid },
    });

    expect(TransactionAdapter.fromDb(transactionInDynamo)).toEqual({
      ...withWebhook,
      status: Status.FAILED_WEBHOOK,
      attempts: 1,
    });

    expect(sqsService.ackMessage).toHaveBeenCalledWith(
      event.Records[0].receiptHandle,
      SQS_NEW_TRANSACTION_QUEUE_URL
    );
  });
});
