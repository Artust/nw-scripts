const { getRecordsByDomain } = require('./aws/dynamo');
const { findDuplicates } = require('./issue/find-duplicate-events');
const { constants } = require('./utils/constants');
const { writeFile, readFile } = require('./utils/export-file');

const { DOMAIN } = process.env;

const getData = async () => {
  try {
    const data = await getRecordsByDomain(constants.EVENT_OFFICE, DOMAIN);
    writeFile('data event-app', data.Items);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.handler = async () => {
  let dataDynamo;
  try {
    dataDynamo = readFile('data event-app');
  } catch (error) {
    if (error.message.includes('Cannot find module')) {
      dataDynamo = await getData();
    } else throw error;
  }
  const dups = findDuplicates(dataDynamo.Items);
  writeFile('duplicate events', dups);
};

this.handler();
