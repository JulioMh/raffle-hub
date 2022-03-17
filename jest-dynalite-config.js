module.exports = {
  tables: [
    {
      TableName: process.env.DYNAMO_LEDGER_MANAGER_TABLE_NAME,
      KeySchema: [
        { AttributeName: 'transactionUuid', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'transactionUuid', AttributeType: 'S' },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    }
  ],
  basePort: 8000
};
