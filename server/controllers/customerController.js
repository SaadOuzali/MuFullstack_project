const Customer = require("../models/Customer");

const loginController = async (req, res, next) => {
  const last_login = new Date().toDateString();
  const refreshToken = req.ref;
  const accessToken = req.acc;

  const customer = req.customer;
  const updatedCustomer = await Customer.findOneAndUpdate(
    { _id: customer._id },
    { last_login: last_login },
    { new: true } //
  ).select("_id id first_name last_name email valid_account active");

  // Check to make sure that the customer object is not empty
  if (!updatedCustomer) {
    const err = new Error("Can not find customer");
    err.status = 404;
    next(err);
    return;
  }
  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      domain: "localhost",
      // path: "/",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      domain: "localhost",
      // path: "/",
    });

  console.log("acesstoken customer", accessToken);
  console.log("refresh customer", refreshToken);

  // Check to make sure that the access token and refresh token cookies are set
  if (!accessToken || !refreshToken) {
    const err = new Error(
      "Failed to set access token and refresh token cookies"
    );
    err.status = 400;
    next(err);
    return;
  }

  res.cookie("accessToken", accessToken).cookie("refreshToken", refreshToken);

  //send the response to the client
  res.status(200).json({
    status: 200,
    accessToken,
    token_type: "Bearer",
    data: updatedCustomer,
    refreshToken,
    message: "login success",
  });
};

const signupController = async (req, res, next) => {
  res.status(201).json({
    status: 201,
    message: "customer created successfully",
    token: req.token,
  });
};

const getProfileCustomerController = (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: "customer profile found successfully",
    data: req.customerProfile,
  });
};

const getCustomerByIdController = (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: "customer found",
    data: req.customer,
  });
};

const updateCustomerController = (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: "customer updated successfully",
    data: req.customer,
  });
};

const updateCustomerDataController = (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: "data updated successfully",
    data: req.customer,
  });
};

const deleteCustomerController = (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: "customer deleted successfully",
  });
};

const searchCustomerController = (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: "successful search",
    data: req.customers,
  });
};

const listCustomersController = (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: "customers listed successfully",
    data: req.customers,
  });
};

module.exports = {
  loginController,
  signupController,
  getProfileCustomerController,
  getCustomerByIdController,
  updateCustomerController,
  updateCustomerDataController,
  deleteCustomerController,
  searchCustomerController,
  listCustomersController,
};
