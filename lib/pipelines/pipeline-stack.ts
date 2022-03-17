/* eslint-disable no-new */
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as iam from '@aws-cdk/aws-iam';
import { BuildConfig } from '../../bin/config/build-config';
import RaffleHubStage from './raffle-hub-stage';

export default class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    const repo = codecommit.Repository.fromRepositoryArn(this, 'repo', buildConfig.Repository);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.CodeBuildStep('Synth', {
        input: pipelines.CodePipelineSource.codeCommit(repo, buildConfig.Branch),
        installCommands: [
          `bash ./config/initialize-project.sh --env ${buildConfig.Environment.toLocaleLowerCase()}`,
        ],
        commands: [
          'npm run build',
          `cdk synth ${id}`,
          ...(buildConfig.Environment === 'dev' ? ['npm run test:silent'] : []),
        ],
        rolePolicyStatements: [
          new iam.PolicyStatement({
            actions: ['lambda:GetLayerVersion'],
            resources: ['*'],
          }),
        ],
      }),
    });

    pipeline.addStage(new RaffleHubStage(this, buildConfig.Environment, {}, buildConfig));
  }
}
