#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-new */
import { App } from '@aws-cdk/core';
import RaffleHubStack from '../lib/raffle-hub-stack';
import { BuildConfig } from './config/build-config';
import getConfig from './config/get-build-config';

const app = new App();

const buildConfig: BuildConfig = getConfig(app, 'sbx');

new RaffleHubStack(
  app,
  `${buildConfig.Environment}-${buildConfig.App}`,
  {
    env: {
      account: buildConfig.AWSAccountID,
      region: buildConfig.AWSRegion,
    },
  },
  buildConfig
);

app.synth();
