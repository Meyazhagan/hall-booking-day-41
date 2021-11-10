const router = require("express").Router();
const bookings = require("../service/booking.service");

// bookings
//     - get all bookings
router.get("/", bookings.getAll);
//     - get particular booking
router.get("/:id", bookings.get);
//     - post booking
router.post("/", bookings.create);
//     - put booking
router.put("/:id", bookings.update);
//     - delete booking
router.delete("/:id", bookings.delete);

module.exports = router;
