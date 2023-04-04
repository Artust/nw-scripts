const { getRecordsByDomain } = require('../../base/aws/dynamo');
const { constants } = require('../../utils/constants');

const getUsersOffice = (domain) => {
  const users = getRecordsByDomain(constants.USER_OFFICE, domain);
  return users;
};

exports.getUsersOffice = getUsersOffice;
