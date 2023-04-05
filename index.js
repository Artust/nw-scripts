const { getRecordsByDomain, getRecordWithKey } = require('./base/aws/dynamo');
const { refreshToken } = require('./base/google');
const { findDuplicates } = require('./handlers/find-duplicate-events');
const GOOGLE_HANDLER = require('./handlers/google');
const OFFICE_HANDLER = require('./handlers/office');

const DYNAMO_REPO = require('./usecases/dynamo');
const OFFICE_REPO = require('./usecases/office');

const { writeFile, readFile } = require('./utils/export-file');

exports.handler = async () => {
  try {
    const rs = await DYNAMO_REPO.getAllEvents('google');
    writeFile('result', rs);
    return rs;
  } catch (error) {
    console.log('––––––––––––––––––––––––––––––');
    console.log('ERROR: ', error);
    console.log(Object.keys(error), error.name);
    return error;
  }
};

this.handler();
