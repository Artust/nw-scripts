const GOOGLE_USECASE = require('../../usecases/google');
const DYNAMO_REPO = require('../../base/aws/dynamo');
const { constants } = require('../../utils/constants');

const getAllEventsOfUser = async (garoonId) => {
  const user = await GOOGLE_USECASE.getUser(garoonId);

  if (user.google_expires_on < new Date().toISOString()) {
    const tokenInfo = await GOOGLE_USECASE.refreshToken(user.google_refresh_token);
    user.google_access_token = tokenInfo.google_access_token;
    user.google_expires_on = tokenInfo.google_expires_on;
  }

  await DYNAMO_REPO.updateRecord(
    constants.USER_GOOGLE,
    { garoonId: user.garoonId },
    {
      google_access_token: user.google_access_token,
      google_expires_on: user.google_expires_on,
    }
  );

  const events = await GOOGLE_USECASE.getAllEventsOfUser(user);
  return events;
};

module.exports = {
  getAllEventsOfUser,
};
