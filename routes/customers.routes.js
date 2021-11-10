const router = require("express").Router();
const customers = require("../service/customer.service");

// customers
//     - get all customers
router.get("/", customers.getAll);
//     - get all booked customers
router.get("/booked", customers.getAllBooked);
//     - get particular customer
router.get("/:id", customers.get);
//     - post customer
router.post("/", customers.create);
//     - put customer
router.put("/:id", customers.update);
//     - delete customer
router.delete("/:id", customers.delete);

module.exports = router;
