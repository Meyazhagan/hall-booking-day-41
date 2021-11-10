const config = require("config");

module.exports = (req, res) => {
  res.status(400).send({
    message: "No Such Endpoint",
    documentationLink: config.get("documentation"),
  });
};
