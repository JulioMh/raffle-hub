import SQS from 'aws-sdk/clients/sqs';
import { SqsService } from './SqsService';

const sqsClient = new SQS();

export { SqsService } from './SqsService';
export const sqsService = new SqsService(sqsClient);
