const _ = require("lodash");
const Customers = require("../data/customers");
const bh = require("../shared/bookingHelper");

const pickOptions = [
  "id",
  "customerName",
  "firstName",
  "lastName",
  "emailId",
  "mobileNo",
  "premiere",
];
const pickPopulated = [
  "id",
  "customerName",
  "emailId",
  "mobileNo",
  "premiere",
  "bookedInfo",
];

module.exports = {
  getAll: (req, res) => {
    // getting all customers and picking properities
    const customersList = Customers.getAll().map((c) => _.pick(c, pickOptions));
    res.send(customersList);
  },
  getAllBooked: (req, res) => {
    // filtering customer has booking details
    const list = Customers.getAll().filter((c) => c.bookedInfo.length > 0);
    // mapping booking id to booking details
    const customersList = list.map((c) => {
      const customers = { ...c };
      // populating booking details from booked List
      customers.bookedInfo = bh.bookings(customers.bookedInfo, bh.ROOMS);
      return _.pick(customers, pickPopulated);
    });
    res.send(customersList);
  },
  get: (req, res) => {
    // getting particular customer
    const customer = Customers.get(req.params.id);
    // if no customer available for given id
    if (!customer)
      return res.status(404).send({ message: "Given Customer ID in invalid." });

    res.send(customer);
  },
  create: (req, res) => {
    // validating the body
    const { error, value } = Customers.verify(req.body);
    if (error) res.status(401).send({ message: error.message });
    // adding customer to customer list
    const added = Customers.add(value);
    res.send(added);
  },
  update: (req, res) => {
    // validating the body
    const { error, value } = Customers.verify(req.body);
    if (error) res.status(401).send({ message: error.message });
    // updating customer
    const id = req.params.id;
    const updated = Customers.update(id, value);
    if (!updated)
      return res.status(404).send({ message: "Given Customer ID in invalid." });
    res.send(updated);
  },
  delete: (req, res) => {
    const id = req.params.id;
    // deleting customer
    const deleted = Customers.delete(id);
    if (!deleted)
      return res.status(404).send({ message: "Given Customer ID in invalid." });
    res.send(deleted);
  },
};
