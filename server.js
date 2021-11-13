const express = require("express");
const rooms = require("./routes/rooms.routes");
const customers = require("./routes/customers.routes");
const bookings = require("./routes/bookings.routes");
// const logger = require("./middleware/looger.middleware");
const noEndpoint = require("./middleware/no-endpoint.middleware");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

// app.use(logger.log);
app.use((req, res, next) => {
  next();
});

app.use("/rooms", rooms);
app.use("/customers", customers);
app.use("/bookings", bookings);

app.use(noEndpoint);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to Port ${port}...`));
