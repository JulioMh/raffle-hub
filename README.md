## Sync Ledger Manager

### Prerequisites

- Follow instructions in [sync-sdk README file](https://eu-west-2.console.aws.amazon.com/codesuite/codecommit/repositories/sync-sdk/browse/refs/heads/master/--/README.md?region=eu-west-2) to sign in to AWS CLI and git-remote-codecommit  
  

- The stacks are using code from lambda layers that are imported by version, so depending on the environment (Sandbox or Dev) lambda layers versions are different and so is the code probably. Thus before running the tests you should run the following script replacing **env** with **dev** (default) or **prod** (remember to be logged in with the corresponding account)

  ```
  bash initialize-project.sh -e env
  ```

### Changing/Adding environment variables

Environment variables are in the `cdk.json` file. They need to be added in all the environments. `bin/config/build-config.ts`and `bin/config/get-build-config.ts` files also need to be updated.

### Test Lambda Functions Locally (Sandbox account)

- Start the TypeScript compiler in watch mode, so the code will automatically compile on each change
  ```
  npm run watch:development
  ```
      
- Synthesize the CloudFormation template:
  ```
  cdk synth --app ./dist/bin/sandbox-raffle-hub.js --no-staging' > template.yaml
  ```

- Search for the full name of the lambda function (they have a hash at the end) in the template.yaml or run `sam local invoke` and search for the name in the output.

- To invoke a lambda function locally that does not invoke other lambda functions, you can do:
  ```
  sam local invoke lambdaFullName
  ```
    - If the lambda has input parameters:
      ```
      sam local invoke lambdaFullName -e event.json
      ```

- To create a local HTTP server that hosts all the lambda functions:
  ```
  sam local start-api --warm-containers EAGER
  ```

Please have in mind that you are testing locally only the lambda functions and any changes in other AWS services must be deployed if you are using those changes in the lambda functions. Synthesizing the CloudFormation template is not enough. E.g. To change a permission for a lambda function on a DynamoDB table, you need to deploy the stack in order to test your lambda changes locally (or to set up DynamoDB Local).

### Deployment in AWS (DEV)

The pipelines in the sandbox account (if there are any) are for testing and are not connected to the production repository. Whenever you do a change in the raffle-hub-stack you need to run (`npm run build:development` before):

```
cdk deploy
```

The first time you may need to do `cdk bootstrap aws://560644772492/eu-west-2` before.

It can be interesting to have more stacks like this one if there are different people doing many changes to the stack at the same time. Because if the code of the stack is not being merged, when one person deploys his stack, it deletes the changes of the stack the other person did and deployed earlier. Another solution is to frequently merge the code of the stack.

### Deployment in AWS (Production)

This is only needed the first time you do the deployment or when you change the pipeline configuration. Otherwise, pushing a commit to one of the branches that has a pipeline, the pipeline will do the deployment automatically. Execute `npm run build` if it has not been executed before.

```
cdk bootstrap aws://837442251756/eu-west-2
cdk deploy --all
```
### Useful commands

- Compare deployed stack with current state:
    - Sandbox:
      ```
      cdk diff
      ```
    - Production:
      ```
      cdk diff
      ```
