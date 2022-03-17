import { context } from '../cdk.json';

// eslint-disable-next-line no-restricted-syntax
for (const [key, value] of Object.entries(context.sbx.Parameters)) {
  process.env[key] = value as string;
}

process.env.DYNAMO_LEDGER_MANAGER_TABLE_NAME = 'LedgerAuditTest';
process.env.SQS_NEW_TRANSACTION_QUEUE_URL = 'sqs-url';

// remove aws credentials for security
process.env.AWS_ACCESS_KEY_ID = 'jest';
process.env.AWS_SECRET_ACCESS_KEY = 'jest';
process.env.AWS_SESSION_TOKEN = 'jest';
process.env.AWS_REGION = 'eu-west-2';
