const fs = require("fs");
const { getTimeContent } = require("../shared/date");

module.exports = {
  log: (req, res, next) => {
    const { logTime } = getTimeContent();
    const logData = `${req.method} - ${req.url} - ${logTime}\n`;

    fs.appendFile("Log/logger.txt", logData, (err, file) => {
      if (err) console.log(err);
    });
    next();
  },
};
