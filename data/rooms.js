const Joi = require("joi");

/*
room no
room name
no of seats available
amenities in room
price for 1hr
bookedInfo
*/
const rooms = [
  {
    id: 1,
    roomNo: 010,
    roomName: "Ten",
    noOfSeatsAvailable: 20,
    amenities: ["AC", "Heater", "TV"],
    pricePerHour: 100,
    bookedInfo: [1],
  },
];

let rId = rooms.length;
function* RoomId() {
  while (true) {
    yield ++rId;
  }
}

const getIndex = (id) => {
  return rooms.findIndex((r) => r.id == id);
};
// addRooms,
const addRooms = (room) => {
  room.bookedInfo = [];
  room.id = RoomId().next().value;
  rooms.push(room);
  return room;
};
// getRoom,
const getRoom = (id) => {
  const index = getIndex(id);
  if (index === -1) return null;
  return rooms[index];
};
// getAllRooms,
const getAllRooms = () => {
  return rooms;
};
// updateRooms,
const updateRooms = (id, updatedRoom) => {
  const index = getIndex(id);
  if (index === -1) return null;
  const r = rooms[index];
  rooms[index] = { ...r, ...updatedRoom };
  return rooms[index];
};
// deleteRooms,
const deleteRooms = (id) => {
  const index = getIndex(id);
  if (index === -1) return null;
  rooms.splice(index, 1);
  return {};
};
// verifyRooms,
const verifyRooms = (room) => {
  const schema = Joi.object({
    roomNo: Joi.number().required(),
    roomName: Joi.string().required(),
    noOfSeatsAvailable: Joi.number().required(),
    amenities: Joi.array().items(Joi.string()).required(),
    pricePerHour: Joi.number().required(),
  });

  return schema.validate(room);
};
//adding Booking Id
const addBooking = (roomId, bookingId) => {
  const room = getRoom(roomId);
  room.bookedInfo.push(bookingId);
};
module.exports = {
  rooms,
  add: addRooms,
  addBooking,
  get: getRoom,
  getAll: getAllRooms,
  update: updateRooms,
  delete: deleteRooms,
  verify: verifyRooms,
};
