const {
  areIntervalsOverlapping,
  isBefore,
  isPast,
  differenceInMinutes,
} = require("date-fns");
const { format } = require("date-fns-tz");

module.exports = {
  // getting time for logging
  getTimeContent: () => {
    let zonedDate = new Date();
    const logPattern = "dd/MM/yyyy HH:mm:ss (z)";
    const logTime = format(zonedDate, logPattern, {
      timeZone: "Asia/Kolkata",
    });

    return { logTime };
  },
  // getting duration for interval
  getDuration: (d1, d2) => (differenceInMinutes(d2, d1) / 60).toFixed(2),
  // validating interval
  validInterval: isBefore,
  isPast,
  checkOverlapping: areIntervalsOverlapping,
};
