import { Stack } from '@aws-cdk/core';
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { BuildConfig, BuildParameters } from '../../../bin/config/build-config';

interface BillingModeProps {
  billingMode: BillingMode;
  readCapacity?: number;
  writeCapacity?: number;
}

export default class DynamodbTables {
  readonly ledgerManagerTable: Table;

  static getBillingModeParameters = ({
    BILLING_MODE,
    READ_CAPACITY,
    WRITE_CAPACITY,
  }: BuildParameters): BillingModeProps => ({
    ...(BILLING_MODE === BillingMode.PAY_PER_REQUEST
      ? {
          billingMode: BillingMode.PAY_PER_REQUEST,
        }
      : {
          billingMode: BillingMode.PROVISIONED,
          readCapacity: READ_CAPACITY,
          writeCapacity: WRITE_CAPACITY,
        }),
  });

  static formatEnvironment = (env: string): string => {
    const lowerEnv = env.toLowerCase();
    return lowerEnv.replace(lowerEnv[0], lowerEnv[0].toUpperCase());
  };

  constructor(stack: Stack, buildConfig: BuildConfig) {
    const { Parameters } = buildConfig;

    this.ledgerManagerTable = new Table(stack, 'ledgerManagerTable', {
      tableName: `LedgerAudit${DynamodbTables.formatEnvironment(buildConfig.Environment)}`,
      partitionKey: { name: 'transactionUuid', type: AttributeType.STRING },
      ...DynamodbTables.getBillingModeParameters(Parameters),
    });
  }
}
