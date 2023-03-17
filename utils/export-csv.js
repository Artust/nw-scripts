const XLSX = require('xlsx');

exports.exportCSV = (input, path) => {
  input.forEach((item) => {
    for (const key in item) {
      if (Object.hasOwnProperty.call(item, key)) {
        let element = item[key];
        if (typeof element === 'string') {
          item[key] = item[key][0] === '0' ? "'" + element : element;
        }
        if (typeof element === 'object') {
          item[key] = JSON.stringify(element);
        }
        if (key === 'Notes') {
          item[key] = JSON.stringify(element);
        }
      }
    }
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(input);
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `./${path}.csv`);
};
