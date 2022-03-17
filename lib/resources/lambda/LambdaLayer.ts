import { RemovalPolicy, Stack } from '@aws-cdk/core';
import { Code, ILayerVersion, LayerVersion, Runtime } from '@aws-cdk/aws-lambda';
import { BuildConfig } from '../../../bin/config/build-config';

export default class LambdaLayer {
  readonly syncSdk: ILayerVersion;
  readonly ledgerManagerLayer: ILayerVersion;

  constructor(stack: Stack, buildConfig: BuildConfig) {
    this.syncSdk = LayerVersion.fromLayerVersionArn(
      stack,
      'syncSdkLayer',
      buildConfig.Parameters.LAMBDA_LAYER_SYNC_SDK_VERSION_ARN
    );

    this.ledgerManagerLayer = new LayerVersion(stack, 'ledgerManager', {
      code: Code.fromAsset(`${buildConfig.CompiledFolder}/resources/lambda/layers/ledger`),
      compatibleRuntimes: [Runtime.NODEJS_14_X],
      removalPolicy: RemovalPolicy.RETAIN,
    });
  }
}
