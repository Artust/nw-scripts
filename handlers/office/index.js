const OFFICE_USECASE = require('../../usecases/office');
const DYNAMO_REPO = require('../../base/aws/dynamo');
const { constants } = require('../../utils/constants');

const getAllEventsOfUser = async (garoonId) => {
  const user = await OFFICE_USECASE.getUser(garoonId);

  if (user.office_expires_on < new Date().toISOString()) {
    const tokenInfo = await OFFICE_USECASE.refreshToken(user.office_access_token);
    user.office_access_token = tokenInfo.office_access_token;
    user.office_expires_on = tokenInfo.office_expires_on;
    user.office_refresh_token = tokenInfo.office_refresh_token;
  }

  await DYNAMO_REPO.updateRecord(
    constants.USER_OFFICE,
    { garoonId: user.garoonId },
    {
      office_access_token: user.office_access_token,
      office_expires_on: user.office_expires_on,
      office_refresh_token: user.office_refresh_token,
    }
  );

  const events = await OFFICE_USECASE.getAllEventsOfUser(user);
  return events;
};

module.exports = {
  getAllEventsOfUser,
};
