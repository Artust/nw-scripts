const DYNAMO_REPO = require('../../base/aws/dynamo');
const OFFICE_REPO = require('../../base/office');
const { constants } = require('../../utils/constants');

const refreshToken = async (office_refresh_token) => {
  const tokenInfo = await OFFICE_REPO.refreshToken(office_refresh_token);
  return tokenInfo;
};

const getUser = async (garoonId) => {
  const rs = await DYNAMO_REPO.getRecordWithKey(constants.USER_OFFICE, { garoonId });
  return rs.Item;
};

const getAllUsers = async () => {
  const records = await DYNAMO_REPO.getRecordsByDomain(constants.USER_OFFICE);
  const { Items: users, ...rest } = records;
  console.log('Info: ', rest);
  return users;
};

const getAllEventsOfUser = async (user) => {
  const events = OFFICE_REPO.getAllEvents(user);
  return events;
};

module.exports = {
  getUser,
  getAllUsers,
  getAllEventsOfUser,
  refreshToken,
};
