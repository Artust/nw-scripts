const fs = require('fs');

exports.writeFile = (pathFile, data) => {
  fs.writeFile(`./data/${pathFile}.json`, JSON.stringify(data), 'utf-8', (err) => {
    if (err) {
      throw new Error(err);
    }
    return true;
  });
};

exports.readFile = (pathFile) => {
  try {
    const data = require(`../data/${pathFile}.json`);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};
