const Rooms = require("../data/rooms");
const Bookings = require("../data/bookings");
const Customers = require("../data/customers");
const { validInterval, getDuration, isPast } = require("../shared/date");
const _ = require("lodash");
const { checkOverlapping } = require("../shared/date");

const ROOMS = "room";
const CUSTOMERS = "customer";

const pickBookingProp = [
  "id",
  "customerId",
  "roomId",
  "date",
  "startTime",
  "endTime",
  "start",
  "end",
  "totalPrice",
  "roomStatus",
  "pricePerHour",
];

const pickDisplayBookingProp = [
  "id",
  "customerId",
  "roomId",
  "date",
  "startTime",
  "endTime",
  "totalPrice",
  "roomStatus",
];

const setInterval = (booking) => {
  // getting date info
  const [y, m, d] = booking.date.split("-").map(Number);
  // getting start time
  const startTime = booking.startTime.split(":").map(Number);
  // getting end time
  const endTime = booking.endTime.split(":").map(Number);
  // making new date object
  booking.start = new Date(y, m - 1, d, ...startTime);
  booking.end = new Date(y, m - 1, d, ...endTime);
  // validating start time
  if (isPast(booking.start)) return "The startTime is not valid";
  // validating end time
  if (!validInterval(booking.start, booking.end))
    return "The startTime and endTime is not valid";
};

const setStatus = (booking) => {
  // updating room status corresponding to current time
  if (isPast(booking.end)) {
    booking.roomStatus = "vacant";
  } else if (isPast(booking.start)) {
    booking.roomStatus = "occupied";
  } else {
    booking.roomStatus = "unoccupied";
  }
};

const setTotalPrice = (booking) => {
  // getting room details
  const room = Rooms.get(booking.roomId);
  booking.room = room;
  booking.pricePerHour = room.pricePerHour;
  // calculating duration of time
  const noOfHours = getDuration(booking.start, booking.end);
  // calculating total price based on pricePerHour and no of hours
  booking.totalPrice = Math.floor(booking.pricePerHour * noOfHours);
};

const setCustomerAndRoom = (id, booking) => {
  // setting customer id and user id
  const book = Bookings.get(id);
  booking.roomId = book.roomId;
  booking.customerId = book.customerId;
};

const populateRoom = (booking) => {
  // setting room details
  const room = Rooms.get(booking.roomId);
  booking.room = _.pick(room, ["id", "roomNo", "pricePerHour"]);
};

const populateCustomer = (booking) => {
  // setting customer details
  const customer = Customers.get(booking.customerId);
  booking.customer = _.pick(customer, ["id", "customerName", "preimere"]);
};

const populateBookings = (bookingList, project, pickOptions) => {
  // default picking properities
  pickOptions = pickOptions || [
    "id",
    project,
    "date",
    "startTime",
    "endTime",
    "totalPrice",
    "roomStatus",
  ];
  return bookingList.map((bId) => {
    const booking = Bookings.get(bId);
    // if there is no booking details available
    if (!booking)
      return { bookingId: bId, message: "No Booking Details Found" };
    // updating room status
    setStatus(booking);
    if (project === ROOMS) populateRoom(booking);
    else if (project === CUSTOMERS) populateCustomer(booking);
    return _.pick(booking, pickOptions);
  });
};

const verifyOverlapping = (booking) => {
  // getting booking details form booking
  const bList = populateBookings(booking.room.bookedInfo, "roomId", [
    "start",
    "end",
  ]);
  // looping through all booked list and checking for overlapping
  for (let b in bList) {
    let isOverlap = checkOverlapping(
      { start: bList[b].start, end: bList[b].end },
      { start: booking.start, end: booking.end }
    );
    if (isOverlap) return true;
  }
  return false;
};

module.exports = {
  setInterval,
  setStatus,
  setTotalPrice,
  setCustomerAndRoom,
  bookings: populateBookings,
  rooms: populateRoom,
  verifyOverlapping,
  pickBookingProp,
  pickDisplayBookingProp,
  ROOMS,
  CUSTOMERS,
};
