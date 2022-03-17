/* eslint-disable no-new */
import { Construct, Stage, StageProps } from '@aws-cdk/core';
import { BuildConfig } from '../../bin/config/build-config';
import RaffleHubStack from '../raffle-hub-stack';

export default class RaffleHubStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    new RaffleHubStack(
      this,
      buildConfig.App,
      {
        env: {
          account: buildConfig.AWSAccountID,
          region: buildConfig.AWSRegion,
        },
      },
      buildConfig
    );
  }
}
