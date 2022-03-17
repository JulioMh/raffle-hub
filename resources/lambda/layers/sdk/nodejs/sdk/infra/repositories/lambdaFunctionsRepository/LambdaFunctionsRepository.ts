import Lambda from 'aws-sdk/clients/lambda';

const { LAMBDA_FUNCTION_NAME_SEND_MESSAGE_TO_CLIENTS } = <
  {
    LAMBDA_FUNCTION_NAME_SEND_MESSAGE_TO_CLIENTS: string;
  }
>process.env;

export class LambdaFunctionsRepository {
  private lambdaClient: Lambda;

  constructor(lambdaClient: Lambda) {
    this.lambdaClient = lambdaClient;
  }

  async invokeSendMessageToClients(userUuids: string[], context: string, data: any): Promise<any> {
    const sendMessageLambdaRes = await this.lambdaClient
      .invoke({
        FunctionName: LAMBDA_FUNCTION_NAME_SEND_MESSAGE_TO_CLIENTS,
        Payload: JSON.stringify({ userUuids, context, data }),
      })
      .promise();

    const sendMessageRes = sendMessageLambdaRes.Payload as string;

    return JSON.parse(sendMessageRes);
  }
}
