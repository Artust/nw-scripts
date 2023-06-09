const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

const { ERROR } = require('./errors');

const { ENV, DOMAIN } = process.env;
const dynamoDB = new DynamoDB({ region: ENV === 'prod' ? 'us-east-1' : 'ap-southeast-1', maxAttempts: 10 });
const documentCLI = DynamoDBDocument.from(dynamoDB);

/**
 * COMMON FUNCTION: generate UpdateExpression, ExpressionAttributeValues for UPDATE
 * @param {object} params Include one or more attributes to be updated
 * @returns
 */
const genParamsUpdate = (params) => {
  if (Object.keys(params).length === 0) {
    return {};
  }
  const updateItemInput = {
    ExpressionAttributeValues: {},
  };
  Object.keys(params).forEach((att) => {
    if (!updateItemInput.UpdateExpression) {
      updateItemInput.UpdateExpression = `SET ${att} = :${att}`;
    } else {
      updateItemInput.UpdateExpression += `, ${att} = :${att}`;
    }
    updateItemInput.ExpressionAttributeValues[`:${att}`] = params[att];
  });
  return updateItemInput;
};

/**
 *
 * @param {string} tableName name of table
 * @param {} exclusiveStartKey primary key of the first item that this operation will evaluate
 */
const getAllRecordsInTable = async (tableName, ExclusiveStartKey) => {
  const args = {
    TableName: tableName,
  };
  if (ExclusiveStartKey) {
    args.ExclusiveStartKey = ExclusiveStartKey;
  }
  console.log('ExclusiveStartKey: ', ExclusiveStartKey);
  const timeStart = new Date();
  console.log('time START: ', timeStart.toISOString());
  await new Promise((res) => {
    setTimeout(res.bind(null), 120);
  });
  const timeW8 = new Date();
  console.log('time w8: ', timeW8.toISOString());
  return documentCLI.scan(args).then(async (rs) => {
    if (rs.LastEvaluatedKey) {
      console.log('Count: ', rs.Count);
      const next = await getAllRecordsInTable(tableName, rs.LastEvaluatedKey);
      rs.Items = [...rs.Items, ...next.Items];
      rs.Count += next.Count;
      return rs;
    }
    console.log('Args: ', args);
    console.log('Count: ', rs.Count);
    return rs;
  });
};

/**
 *
 * @param {string} tableName name of table
 * @param {} exclusiveStartKey primary key of the first item that this operation will evaluate
 */
const getRecordsByDomain = async (tableName, ExclusiveStartKey) => {
  const args = {
    TableName: tableName,
    KeyConditionExpression: '#domain = :domain',
    ExpressionAttributeNames: {
      '#domain': 'domain',
    },
    ExpressionAttributeValues: {
      ':domain': DOMAIN,
    },
  };
  if (ExclusiveStartKey) {
    args.ExclusiveStartKey = ExclusiveStartKey;
  }
  return documentCLI.query(args).then(async (rs) => {
    if (rs.LastEvaluatedKey) {
      console.log('Count: ', rs.Count);
      const next = await getRecordsByDomain(tableName, rs.LastEvaluatedKey);
      rs.Items = [...rs.Items, ...next.Items];
      rs.Count += next.Count;
      return rs;
    }
    console.log('Args: ', args);
    console.log('Count: ', rs.Count);
    return rs;
  });
};

const getRecordWithKey = (tableName, key) => {
  const args = {
    TableName: tableName,
    Key: { ...key, domain: DOMAIN },
  };
  return documentCLI.get(args);
};

const updateRecord = (tableName, key, params) => {
  const args = {
    TableName: tableName,
    Key: { ...key, domain: DOMAIN },
    ...genParamsUpdate(params),
  };
  return documentCLI.update(args);
};

const deleteRecord = (tableName, key) => {
  const args = {
    TableName: tableName,
    Key: { ...key, domain: DOMAIN },
  };
  return documentCLI.delete(args);
};

module.exports = {
  getAllRecordsInTable,
  getRecordsByDomain,
  getRecordWithKey,
  updateRecord,
  deleteRecord,
};
