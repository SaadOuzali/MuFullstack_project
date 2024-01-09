const Customer = require("../models/Customer");

async function getCustomerProfile(req, res, next) {
  const customerId = req.payload._id;
  try {
    const customerProfile = await Customer.find({ _id: customerId });
    if (!customerProfile) {
      const err = new Error("Customer profile data not found");
      res.status(404).json({
        status: 404,
        message: "Customer profile data not found",
      });
      return;
    }
    req.customerProfile = customerProfile;
    next();
  } catch (err) {
    console.log("ERROR UGH: ", err);
    res.status(500).json({ message: "SERVER ERROR UGH" });
  }
}

async function getCustomerById(req, res, next) {
  const customerId = req.params.id;
  const customer = await Customer.find({ id: customerId });
  if (!customer.length) {
    const err = new Error("Customer not found");
    err.status = 404;
    next(err);
    return;
  }
  req.customer = customer;
  next();
}

module.exports = { getCustomerProfile, getCustomerById };
