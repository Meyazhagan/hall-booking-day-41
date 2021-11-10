const Joi = require("joi");

/**
 * room id
 * customer id
 * start time
 * end time
 * start
 * end
 * date
 * room status
 * totalPrice
 */
//Bookings Array
const bookings = [
  {
    id: 1,
    customerId: 1,
    roomId: 1,
    date: "2021-11-07",
    startTime: "10:30:00",
    endTime: "12:30:00",
    start: new Date(2021, 10, 07, 10, 30, 00),
    end: new Date(2021, 10, 07, 12, 30, 00),
    totalPrice: 200,
    roomStatus: "unoccupied",
    pricePerHour: 100,
  },
];

// Generating Id
let bId = bookings.length;
function* BookingId() {
  while (true) {
    yield ++bId;
  }
}

// Getting index for booking Id
const getIndex = (id) => {
  return bookings.findIndex((r) => r.id == id);
};
// get: getBooking,
const getBooking = (id) => {
  const index = getIndex(id);
  if (index === -1) return null;
  return { ...bookings[index] };
};
// getAll: getAllBookings,
const getAllBookings = () => {
  return bookings;
};
// add: addBookings,
const addBookings = (booking) => {
  // getting generated id for new booking
  booking.id = BookingId().next().value;
  // adding booking to list
  bookings.push(booking);
  return booking;
};
// update: updateBookings,
const updateBookings = (id, updatedbooking) => {
  // Finding index and valid booking
  const index = getIndex(id);
  if (index === -1) return null;
  const b = bookings[index];
  // updating bookings
  bookings[index] = { ...b, ...updatedbooking };
  return bookings[index];
};
// delete: deleteBookings,
const deleteBookings = (id) => {
  const index = getIndex(id);
  if (index === -1) return null;
  bookings.splice(index, 1);
  return {};
};
// Validating body for creating bookings
const verifyBookings = (booking) => {
  // defining schema
  const schema = Joi.object({
    // customer id
    customerId: Joi.number().required(),
    // room id
    roomId: Joi.number().required(),
    // date - format yyyy-mm-dd
    date: Joi.string()
      .pattern(/(\d{4})-(\d{2})-(\d{2})/)
      .required(),
    // time - format hh:mm:ss
    startTime: Joi.string()
      .pattern(/(\d{2}):(\d{2}):(\d{2})/)
      .required(),
    endTime: Joi.string()
      .pattern(/(\d{2}):(\d{2}):(\d{2})/)
      .required(),
  });
  // validating booking body
  return schema.validate(booking);
};

// Validating body for updating bookings
const validateUpdateBooking = (booking) => {
  // defining schema
  const schema = Joi.object({
    // date - format yyyy-mm-dd
    date: Joi.string()
      .pattern(/(\d{4})-(\d{2})-(\d{2})/)
      .required(),
    // time - format hh:mm:ss
    startTime: Joi.string()
      .pattern(/(\d{2}):(\d{2}):(\d{2})/)
      .required(),
    endTime: Joi.string()
      .pattern(/(\d{2}):(\d{2}):(\d{2})/)
      .required(),
  });
  // validating booking body
  return schema.validate(booking);
};

module.exports = {
  bookings,
  add: addBookings,
  get: getBooking,
  getAll: getAllBookings,
  update: updateBookings,
  delete: deleteBookings,
  verify: verifyBookings,
  validateUpdateBooking,
};
