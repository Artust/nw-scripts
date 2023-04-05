const DYNAMO_REPO = require('../../base/aws/dynamo');
const { constants, SIDE_ACTION } = require('../../utils/constants');

const getAllEvents = async (side) => {
  let tableName;
  switch (side) {
    case SIDE_ACTION.GOOGLE:
      tableName = constants.EVENT_GOOGLE;
      break;

    case SIDE_ACTION.OFFICE:
      tableName = constants.EVENT_OFFICE;
      break;

    default:
      throw new Error('Wrong side');
  }
  const records = await DYNAMO_REPO.getAllRecordsInTable(tableName);
  const { Items: events, ...rest } = records;
  console.log('Info: ', rest);
  return events;
};

const getAllUsers = async (side) => {
  let tableName;
  switch (side) {
    case SIDE_ACTION.GOOGLE:
      tableName = constants.USER_GOOGLE;
      break;

    case SIDE_ACTION.OFFICE:
      tableName = constants.USER_OFFICE;
      break;

    default:
      throw new Error('Wrong side');
  }
  const records = await DYNAMO_REPO.getAllRecordsInTable(tableName);
  const { Items: events, ...rest } = records;
  console.log('Info: ', rest);
  return events;
};

module.exports = {
  getAllEvents,
  getAllUsers,
};
