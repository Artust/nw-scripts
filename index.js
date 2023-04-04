const { getRecordsByDomain, getRecordWithKey } = require('./base/aws/dynamo');
const { refreshToken } = require('./base/google');
const { findDuplicates } = require('./usecases/find-duplicate-events');
const GOOGLE_HANDLER = require('./handlers/google');
const OFFICE_HANDLER = require('./usecases/office');

const { writeFile, readFile } = require('./utils/export-file');

exports.handler = async () => {
  try {
    // const userInfo = await GOOGLE_USECASE.getUser('2');
    const rs = await GOOGLE_HANDLER.getAllEventsOfUser('2');
    // const rs = await refreshToken(userInfo)
    writeFile('result', rs);
    return rs;
  } catch (error) {
    console.log('––––––––––––––––––––––––––––––');
    console.log('ERROR: ', error);
    return error;
  }
};

this.handler();
