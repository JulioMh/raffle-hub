import { Duration, Stack } from '@aws-cdk/core';
import { Queue } from '@aws-cdk/aws-sqs';
import { BuildConfig } from '../../../bin/config/build-config';

export default class SqsQueues {
  readonly newTransactionQueue: Queue;
  readonly ackQueue: Queue;

  constructor(stack: Stack, buildConfig: BuildConfig) {
    const { Environment, Parameters } = buildConfig;

    this.newTransactionQueue = new Queue(stack, 'newTransactionsQueue', {
      fifo: true,
      queueName: `${Environment}-new-transactions-queue.fifo`,
    });

    this.ackQueue = new Queue(stack, 'coreAckQueue', {
      fifo: true,
      queueName: `${Environment}-transactions-ack-queue.fifo`,
      visibilityTimeout: Duration.seconds(Parameters.LAMBDA_TIMEOUT),
    });
  }
}
