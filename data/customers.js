const Joi = require("joi");

/**
 * customer name
 * first name
 * last name
 * email id
 * mobile no
 * premiere
 * bookedInfo
 */
// Customer Array
const customers = [
  {
    id: 1,
    customerName: "John Hamedani",
    firstName: "John",
    lastName: "Hamedani",
    emailId: "John@gmail.com",
    mobileNo: "9876543210",
    premiere: true,
    bookedInfo: [1],
  },
];
// Generating customer ID
let cId = customers.length;
function* CustomerId() {
  while (true) {
    yield ++cId;
  }
}
// getting index for customer id
const getIndex = (id) => {
  return customers.findIndex((r) => r.id == id);
};
// addCustomers,
const addCustomers = (customer) => {
  customer.bookedInfo = [];
  customer.id = CustomerId().next().value;
  customers.push(customer);
  return customer;
};
// getCustomer,
const getCustomer = (id) => {
  const index = getIndex(id);
  if (index === -1) return null;
  return customers[index];
};
// getAllCustomers,
const getAllCustomers = () => {
  return customers;
};
// updateCustomers,
const updateCustomers = (id, updatedCustomer) => {
  const index = getIndex(id);
  if (index === -1) return null;
  const c = customers[index];
  customers[index] = { ...c, ...updatedCustomer };
  return customers[index];
};
// deleteCustomers,
const deleteCustomers = (id) => {
  const index = getIndex(id);
  if (index === -1) return null;
  customers.splice(index, 1);
  return {};
};
// Validating body for creating customer
const verifyCustomers = (customer) => {
  // defining schema
  const schema = Joi.object({
    customerName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailId: Joi.string().email().required(),
    mobileNo: Joi.string()
      .pattern(/\d{10}/)
      .required(),
    premiere: Joi.boolean().required(),
  });
  // validating body
  return schema.validate(customer);
};

//adding Booking Id
const addBooking = (customerId, bookingId) => {
  const customer = getCustomer(customerId);
  customer.bookedInfo.push(bookingId);
};
module.exports = {
  customers,
  add: addCustomers,
  addBooking,
  get: getCustomer,
  getAll: getAllCustomers,
  update: updateCustomers,
  delete: deleteCustomers,
  verify: verifyCustomers,
};
