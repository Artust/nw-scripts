const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

const { ENV } = process.env;
const dynamoDB = new DynamoDB({ region: ENV === 'prod' ? 'us-east-1' : 'ap-southeast-1' });
const documentCLI = DynamoDBDocument.from(dynamoDB);

/**
 *
 * @param {string} tableName name of table
 * @param {string} domain domain
 * @param {} exclusiveStartKey primary key of the first item that this operation will evaluate
 */
const getRecordsByDomain = async (tableName, domain, ExclusiveStartKey) => {
  console.log("ExclusiveStartKey: ", ExclusiveStartKey);
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#domain = :domain',
    ExpressionAttributeNames: {
      '#domain': 'domain',
    },
    ExpressionAttributeValues: {
      ':domain': domain,
    },
  };
  if (ExclusiveStartKey) {
    params.ExclusiveStartKey = ExclusiveStartKey;
  }
  return documentCLI
    .query(params)
    .then(async (rs) => {
      if (rs.LastEvaluatedKey) {
        const next = await getRecordsByDomain(tableName, domain, rs.LastEvaluatedKey);
        rs.Items = [...rs.Items, ...next.Items];
        rs.Count = rs.Count + next.Count;
        console.log('Count: ', rs.Count);
        return rs;
      }
      console.log('Count: ', rs.Count);
      return rs;
    })
    .catch((err) => {
      throw err;
    });
};

exports.getRecordsByDomain = getRecordsByDomain;
