import { App } from '@aws-cdk/core';
import { BuildConfig } from './build-config';

const ensureString = (object: { [name: string]: any }, propName: string): string => {
  if (!object[propName]) {
    throw new Error(`${propName} does not exist`);
  }
  if (typeof object[propName] !== 'string') {
    throw new Error(`${propName} is not string`);
  }
  if (object[propName].trim().length === 0) {
    throw new Error(`${propName} is empty`);
  }

  return object[propName];
};

export const ensureNumber = (object: { [name: string]: any }, propName: string): number => {
  if (!object[propName]) {
    throw new Error(`${propName} does not exist`);
  }
  if (typeof object[propName] !== 'number') {
    throw new Error(`${propName} is not number`);
  }

  return object[propName];
};

export default function getConfig(app: App, env: string): BuildConfig {
  const unparsedEnv = app.node.tryGetContext(env);

  const buildConfig: BuildConfig = {
    AWSAccountID: ensureString(unparsedEnv, 'AWSAccountID'),
    AWSRegion: ensureString(unparsedEnv, 'AWSRegion'),

    App: ensureString(unparsedEnv, 'App'),
    Environment: ensureString(unparsedEnv, 'Environment'),
    Repository: ensureString(unparsedEnv, 'Repository'),
    Branch: ensureString(unparsedEnv, 'Branch'),
    CompiledFolder: ensureString(unparsedEnv, 'CompiledFolder'),

    Parameters: {
      LAMBDA_LAYER_SYNC_SDK_VERSION_ARN: ensureString(
        unparsedEnv.Parameters,
        'LAMBDA_LAYER_SYNC_SDK_VERSION_ARN'
      ),
      BILLING_MODE: ensureString(unparsedEnv.Parameters, 'BILLING_MODE'),
      SYNC_USER_PROFILE_URL: ensureString(unparsedEnv.Parameters, 'SYNC_USER_PROFILE_URL'),
      LAMBDA_TIMEOUT: ensureNumber(unparsedEnv.Parameters, 'LAMBDA_TIMEOUT'),
      READ_CAPACITY: ensureNumber(unparsedEnv.Parameters, 'READ_CAPACITY'),
      MAX_ATTEMPTS: ensureNumber(unparsedEnv.Parameters, 'MAX_ATTEMPTS'),
      WRITE_CAPACITY: ensureNumber(unparsedEnv.Parameters, 'WRITE_CAPACITY'),
    },
  };

  return buildConfig;
}
