import SQS from 'aws-sdk/clients/sqs';

interface MessageOption {
  queueUrl: string;
  messageGroupId?: string;
  messageDeduplicationId?: string;
}

export class SqsService {
  private sqsClient: SQS;

  constructor(sqsClient: SQS) {
    this.sqsClient = sqsClient;
  }

  public async sendMessage(
    data: any,
    { queueUrl, messageDeduplicationId, messageGroupId }: MessageOption
  ): Promise<any> {
    return this.sqsClient
      .sendMessage({
        MessageBody: JSON.stringify(data),
        MessageDeduplicationId: messageDeduplicationId,
        MessageGroupId: messageGroupId,
        QueueUrl: queueUrl,
      })
      .promise();
  }

  public async ackMessage(receiptHandle: string, queueUrl: string): Promise<any> {
    return this.sqsClient
      .deleteMessage({
        ReceiptHandle: receiptHandle,
        QueueUrl: queueUrl,
      })
      .promise();
  }
}
