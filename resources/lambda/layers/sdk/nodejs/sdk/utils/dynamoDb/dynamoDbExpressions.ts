import { keywords } from './reservedKeywords.json';

export const buildUpdateExpressions = (attributesToUpdate: any) => {
  const RESERVED_KEYWORDS = keywords;
  const ExpressionAttributeValues: any = {};
  const ExpressionAttributeNames: any = {};
  const updateExpressions: string[] = [];

  Object.entries(attributesToUpdate).forEach(([key, value]) => {
    if (!value) return;
    if (RESERVED_KEYWORDS.includes(key)) {
      updateExpressions.push(`#${key} = :${key}`);
      ExpressionAttributeValues[`:${key}`] = value;
      ExpressionAttributeNames[`#${key}`] = key;
    } else {
      updateExpressions.push(`${key} = :${key}`);
      ExpressionAttributeValues[`:${key}`] = value;
    }
  });

  const UpdateExpression = `set ${updateExpressions.join(', ')}`;

  return {
    UpdateExpression,
    ExpressionAttributeValues,
    ...(Object.keys(ExpressionAttributeNames).length > 0 && { ExpressionAttributeNames }),
  };
};
