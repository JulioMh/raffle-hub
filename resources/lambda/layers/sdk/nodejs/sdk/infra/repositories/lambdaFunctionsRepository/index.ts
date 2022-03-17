import Lambda from 'aws-sdk/clients/lambda';
import { Endpoint } from 'aws-sdk';
import { LambdaFunctionsRepository } from './LambdaFunctionsRepository';

const { AWS_SAM_LOCAL } = process.env;

const lambdaClient = new Lambda({
  ...(AWS_SAM_LOCAL && {
    endpoint: new Endpoint('http://docker.for.mac.localhost:3001'),
  }),
});

export { LambdaFunctionsRepository } from './LambdaFunctionsRepository';
export const lambdaFunctionsRepository = new LambdaFunctionsRepository(lambdaClient);
