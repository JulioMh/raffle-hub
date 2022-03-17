/* eslint-disable no-new */
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { BuildConfig } from '../bin/config/build-config';
import DynamodbTables from './resources/dynamodb/DynamodbTables';
import SqsQueues from './resources/sqs/SqsQueues';
import LambdaLayer from './resources/lambda/LambdaLayer';
import LambdaFunctions from './resources/lambda/LambdaFunctions';

export default class RaffleHubStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    const dynamodbTables = new DynamodbTables(this, buildConfig);
    const sqsQueues = new SqsQueues(this, buildConfig);
    const lambdaLayers = new LambdaLayer(this, buildConfig);

    const lambdaFunctions = new LambdaFunctions(
      this,
      buildConfig,
      lambdaLayers,
      sqsQueues,
      dynamodbTables
    );

    dynamodbTables.ledgerManagerTable.grantWriteData(lambdaFunctions.newTransaction);
    dynamodbTables.ledgerManagerTable.grantReadWriteData(lambdaFunctions.ackTransaction);

    sqsQueues.newTransactionQueue.grantSendMessages(lambdaFunctions.newTransaction);
  }
}
