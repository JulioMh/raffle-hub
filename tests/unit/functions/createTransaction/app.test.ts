import { lambdaHandler } from '../../../../resources/lambda/functions/createTransaction/CreateTransactionLambda';
import transaction from './fixture/transaction.json';
import { userToken } from '../../shared/fixture/userToken.json';
import { dynamoDbService } from '/opt/nodejs/syncSdk/infra/providers/dynamoDbService';
import { sqsService } from '/opt/nodejs/syncSdk/infra/providers/sqsService';
import TransactionAdapter from '/opt/nodejs/ledger/infrastructure/adapters/TransactionAdapter';

const { DYNAMO_LEDGER_MANAGER_TABLE_NAME, SQS_NEW_TRANSACTION_QUEUE_URL } = <
  { DYNAMO_LEDGER_MANAGER_TABLE_NAME: string; SQS_NEW_TRANSACTION_QUEUE_URL: string }
>process.env;

jest.mock('/opt/nodejs/syncSdk/infra/httpRequest', () => ({
  httpRequest: jest.fn(() =>
    Promise.resolve({
      kycStatus: 'DONE',
      userUuid: '414bcf25-8a73-4da4-ba33-c98fc82e4e80',
    })
  ),
}));

jest.mock('/opt/nodejs/syncSdk/infra/providers/sqsService', () => ({
  sqsService: {
    sendMessage: jest.fn(),
  },
}));

describe('Lambda :: Create new transaction', () => {
  test('should save transaction in dynamodb and send message to sqs', async () => {
    const expectedTransaction = { ...transaction, status: 'pending' };

    const event = {
      headers: {
        authorization: userToken,
      },
      body: JSON.stringify(transaction),
    };

    const result = await lambdaHandler(event);
    expect(result).toMatchObject({
      statusCode: 200,
      isBase64Encoded: false,
    });

    const transactionInDynamo = await dynamoDbService.scan({
      TableName: DYNAMO_LEDGER_MANAGER_TABLE_NAME,
    });

    expect(transactionInDynamo).toHaveLength(1);
    expect(TransactionAdapter.fromDb(transactionInDynamo[0])).toEqual(expectedTransaction);

    expect(sqsService.sendMessage).toHaveBeenCalledWith(expectedTransaction, {
      queueUrl: SQS_NEW_TRANSACTION_QUEUE_URL,
      messageDeduplicationId: transaction.transactionUuid,
      messageGroupId: transaction.userUuid,
    });
  });
});
