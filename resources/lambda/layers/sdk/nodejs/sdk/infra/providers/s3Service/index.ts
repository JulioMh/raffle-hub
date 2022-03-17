import AWSXRay from 'aws-xray-sdk-core';
import S3 from 'aws-sdk/clients/s3';
import { S3Service } from './S3Service';

const { AWS_XRAY_CAPTURE_ENABLED } = <
  {
    AWS_XRAY_CAPTURE_ENABLED: string;
  }
>process.env;

let client: any = new S3();

client = AWS_XRAY_CAPTURE_ENABLED === 'true' ? AWSXRay.captureAWSClient(client) : client;

export { S3Service } from './S3Service';
export const s3Service = new S3Service(client);
