const router = require("express").Router();
const rooms = require("../service/room.service");

// Room
//     - get all rooms
router.get("/", rooms.getAll);
//     - get all booked rooms
router.get("/booked", rooms.getAllBooked);
//     - get particular room
router.get("/:id", rooms.get);
//     - post room
router.post("/", rooms.create);
//     - put room
router.put("/:id", rooms.update);
//     - delete room
router.delete("/:id", rooms.delete);

module.exports = router;
