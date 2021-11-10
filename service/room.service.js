const _ = require("lodash");
const Rooms = require("../data/rooms");
const bh = require("../shared/bookingHelper");

const pickOptions = [
  "id",
  "roomNo",
  "roomName",
  "noOfSeatsAvailable",
  "amenities",
  "pricePerHour",
];
const pickPopulated = [
  "id",
  "roomNo",
  "roomName",
  "pricePerHour",
  "bookedInfo",
];
module.exports = {
  getAll: (req, res) => {
    // getting all rooms and picking properities
    const roomList = Rooms.getAll().map((r) => _.pick(r, pickOptions));
    res.send(roomList);
  },
  getAllBooked: (req, res) => {
    // filtering room has booking details
    const list = Rooms.getAll().filter((r) => r.bookedInfo.length > 0);
    // mapping booking id to booking details
    const roomList = list.map((r) => {
      const room = { ...r };
      // populating booking details from booked List
      room.bookedInfo = bh.bookings(room.bookedInfo, bh.CUSTOMERS);
      return _.pick(room, pickPopulated);
    });
    res.send(roomList);
  },
  get: (req, res) => {
    // getting particular room
    const room = Rooms.get(req.params.id);
    // if no room available for given id
    if (!room)
      return res.status(404).send({ message: "Given Room ID is invalid." });

    res.send(room);
  },
  create: (req, res) => {
    // validating the body
    const { error, value } = Rooms.verify(req.body);
    if (error) return res.status(401).send({ message: error.message });
    // adding room to room list
    const added = Rooms.add(value);
    res.send(added);
  },
  update: (req, res) => {
    // validating body
    const { error, value } = Rooms.verify(req.body);
    if (error) return res.status(401).send({ message: error.message });
    // updating room
    const id = req.params.id;
    const updated = Rooms.update(id, value);
    if (!updated)
      return res.status(404).send({ message: "Given Room ID is invalid." });
    res.send(updated);
  },
  delete: (req, res) => {
    const id = req.params.id;
    // deleting room
    const deleted = Rooms.delete(id);
    // if deleted is null, there is no room for given ID
    if (!deleted)
      return res.status(404).send({ message: "Given Room ID is invalid." });
    res.send(deleted);
  },
};
