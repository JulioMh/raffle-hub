/* eslint-disable @typescript-eslint/ban-types */
import { Architecture, Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { BuildConfig } from '../../../bin/config/build-config';
import SqsQueues from '../sqs/SqsQueues';
import LambdaLayers from './LambdaLayer';
import DynamodbTables from '../dynamodb/DynamodbTables';

export default class LambdaFunctions {
  readonly newTransaction: Function;
  readonly ackTransaction: Function;

  constructor(
    stack: Stack,
    buildConfig: BuildConfig,
    lambdaLayers: LambdaLayers,
    sqsQueues: SqsQueues,
    dynamodbTables: DynamodbTables
  ) {
    const { CompiledFolder, Parameters } = buildConfig;

    this.newTransaction = new Function(stack, 'createTransaction', {
      handler: 'CreateTransactionLambda.lambdaHandler',
      runtime: Runtime.NODEJS_14_X,
      architecture: Architecture.ARM_64,
      code: Code.fromAsset(`${CompiledFolder}/resources/lambda/functions/createTransaction`),
      layers: [lambdaLayers.syncSdk, lambdaLayers.ledgerManagerLayer],
      timeout: Duration.seconds(Parameters.LAMBDA_TIMEOUT),
      environment: {
        DYNAMO_LEDGER_MANAGER_TABLE_NAME: dynamodbTables.ledgerManagerTable.tableName,
        SQS_NEW_TRANSACTION_QUEUE_URL: sqsQueues.newTransactionQueue.queueUrl,
        SYNC_USER_PROFILE_URL: Parameters.SYNC_USER_PROFILE_URL,
        MAX_ATTEMPTS: Parameters.MAX_ATTEMPTS,
      },
    });

    this.ackTransaction = new Function(stack, 'ackTransaction', {
      handler: 'AckTransactionLambda.lambdaHandler',
      runtime: Runtime.NODEJS_14_X,
      architecture: Architecture.ARM_64,
      code: Code.fromAsset(`${CompiledFolder}/resources/lambda/functions/ackTransaction`),
      layers: [lambdaLayers.syncSdk, lambdaLayers.ledgerManagerLayer],
      timeout: Duration.seconds(Parameters.LAMBDA_TIMEOUT),
      environment: {
        DYNAMO_LEDGER_MANAGER_TABLE_NAME: dynamodbTables.ledgerManagerTable.tableName,
        SQS_NEW_TRANSACTION_QUEUE_URL: sqsQueues.ackQueue.queueUrl,
        SYNC_USER_PROFILE_URL: Parameters.SYNC_USER_PROFILE_URL,
        MAX_ATTEMPTS: Parameters.MAX_ATTEMPTS,
      },
    });

    const eventSource = new SqsEventSource(sqsQueues.ackQueue);
    this.ackTransaction.addEventSource(eventSource);
  }
}
