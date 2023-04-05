const DYNAMO_REPO = require('../../base/aws/dynamo');
const GOOGLE_REPO = require('../../base/google');
const { constants } = require('../../utils/constants');

const refreshToken = async (google_refresh_token) => {
  const tokenInfo = await GOOGLE_REPO.refreshToken(google_refresh_token);
  return tokenInfo;
};

const getUser = async (garoonId) => {
  const rs = await DYNAMO_REPO.getRecordWithKey(constants.USER_GOOGLE, { garoonId });
  return rs.Item;
};

const getAllUsers = async () => {
  const records = await DYNAMO_REPO.getRecordsByDomain(constants.USER_GOOGLE);
  const { Items: users, ...rest } = records;
  console.log('Info: ', rest);
  return users;
};

const getAllEventsOfUser = async (user) => {
  // const user = await getUser(garoonId);
  const events = GOOGLE_REPO.getAllEventsGoogle(user);
  return events;
};

module.exports = {
  getUser,
  getAllUsers,
  getAllEventsOfUser,
  refreshToken,
};
