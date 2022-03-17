#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-new */
import { App } from '@aws-cdk/core';
import PipelineStack from '../lib/pipelines/pipeline-stack';
import { BuildConfig } from './config/build-config';
import getConfig from './config/get-build-config';

const app = new App();

const buildConfigDev: BuildConfig = getConfig(app, 'dev');

// const buildConfigUat: BuildConfig = getConfig(app, 'uat');

// const buildConfigProd: BuildConfig = getConfig(app, 'prod');

new PipelineStack(
  app,
  `${buildConfigDev.Environment}-pipeline-${buildConfigDev.App}`,
  {
    env: {
      account: buildConfigDev.AWSAccountID,
      region: buildConfigDev.AWSRegion,
    },
  },
  buildConfigDev
);

// new PipelineStack(app, `${buildConfigUat.Environment}-pipeline-${buildConfigUat.App}`, {
//   env: {
//     account: buildConfigUat.AWSAccountID,
//     region: buildConfigUat.AWSRegion,
//   },
// }, buildConfigUat);

// new PipelineStack(
//   app,
//   `${buildConfigProd.Environment}-pipeline-${buildConfigProd.App}`,
//   {
//     env: {
//       account: buildConfigProd.AWSAccountID,
//       region: buildConfigProd.AWSRegion,
//     },
//   },
//   buildConfigProd
// );
