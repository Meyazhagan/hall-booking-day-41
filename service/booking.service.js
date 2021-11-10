const _ = require("lodash");
const Bookings = require("../data/bookings");
const Customers = require("../data/customers");
const Rooms = require("../data/rooms");
const bh = require("../shared/bookingHelper");

module.exports = {
  getAll: (req, res) => {
    // getting all booking list
    const bookingsList = Bookings.getAll().map((b) => {
      // setting room status in booking
      bh.setStatus(b);
      // pick properities
      return _.pick(b, bh.pickDisplayBookingProp);
    });
    res.send(bookingsList);
  },
  get: (req, res) => {
    const booking = Bookings.get(req.params.id);
    if (!booking)
      return res.status(404).send({ message: "Given Booking ID is invalid." });
    // setting room status in booking
    bh.setStatus(booking);
    // pick properities and send response
    res.send(_.pick(booking, bh.pickDisplayBookingProp));
  },
  create: (req, res) => {
    // validating Body
    const { error, value: booking } = Bookings.verify(req.body);
    if (error) res.status(401).send({ message: error.message });
    // checking customer valid
    const c = Customers.get(booking.customerId);
    if (!c) return res.status(401).send({ message: "Invalid Customer Id" });
    // checking room valid
    const r = Rooms.get(booking.roomId);
    if (!r) return res.status(401).send({ message: "Invalid Room Id" });

    // setting valid interval
    const msg = bh.setInterval(booking);
    // If any invalid Interval
    if (msg) return res.status(401).send({ message: msg });
    // setting room status of booking
    bh.setStatus(booking);
    // setting total price
    bh.setTotalPrice(booking);
    // Verifying overlap with booked rooms
    const isOverlap = bh.verifyOverlapping(booking);
    if (isOverlap)
      return res
        .status(401)
        .send({ message: "The selected time slot is already booked" });
    // add booking to bookingList
    const added = Bookings.add(_.pick(booking, bh.pickBookingProp));
    // adding booking id
    Rooms.addBooking(added.roomId, added.id);
    Customers.addBooking(added.customerId, added.id);
    res.send(added);
  },
  update: (req, res) => {
    // validating Body
    const { error, value: booking } = Bookings.validateUpdateBooking(req.body);
    if (error) res.status(401).send({ message: error.message });

    const id = req.params.id;
    // attaching roomId and customerId
    bh.setCustomerAndRoom(id, booking);

    // checking customer valid
    const c = Customers.get(booking.customerId);
    if (!c) return res.status(404).send({ message: "Customer Is NotFound" });
    // checking room valid
    const r = Rooms.get(booking.roomId);
    if (!r) return res.status(404).send({ message: "Room Is NotFound" });

    // setting valid interval
    const msg = bh.setInterval(booking);
    // If any invalid Interval
    if (msg) return res.status(401).send({ message: msg });
    // setting status of booking
    bh.setStatus(booking);
    // setting total price
    bh.setTotalPrice(booking);
    // Verifying overlapping with booked rooms
    const isOverlap = bh.verifyOverlapping(booking);
    if (isOverlap)
      return res
        .status(401)
        .send({ message: "The selected time slot is already booked" });
    // updating booking details for booking id
    const updated = Bookings.update(id, _.pick(booking, bh.pickBookingProp));
    if (!updated)
      return res.status(404).send({ message: "Given Booking ID is invalid." });
    res.send(updated);
  },
  delete: (req, res) => {
    const id = req.params.id;
    // deleting booking form list
    const deleted = Bookings.delete(id);
    if (!deleted)
      return res.status(404).send({ message: "Given Booking ID is invalid." });
    res.send(deleted);
  },
};
