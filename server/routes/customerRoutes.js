const { body, query } = require("express-validator");
const { Router } = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const {
  loginController,
  signupController,
  getProfileCustomerController,
  getCustomerByIdController,
  updateCustomerController,
  updateCustomerDataController,
  deleteCustomerController,
  searchCustomerController,
  listCustomersController,
} = require("../controllers/customerController");
const {
  generateJWT,
  generateRefreshToken,
  verifyRefreshToken,
  verifyJWT,
  generateTokenEmail,
} = require("../middleware/token");
const { authenticateCustomer } = require("../middleware/customerAuth");
const {
  checkEmailExists,
  createCustomer,
} = require("../middleware/checkEmail");
const {
  getCustomerProfile,
  getCustomerById,
} = require("../middleware/getCustomer");
const { checkPrivileges } = require("../middleware/checkPrivileges");
const {
  updateCustomer,
  updateDataCustomer,
} = require("../middleware/updateCustomer");
const { deleteCustomer } = require("../middleware/deleteCustomer");
const {
  searchCustomer,
  listCustomers,
} = require("../middleware/searchCustomer");
const {
  checkValidationResult,
  isCustomer,
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
  ValidatFields,
} = require("../middleware/authMiddleware");
const Customer = require("../models/Customer");
const { sendEmail } = require("../middleware/email");
const {
  checToken_Front_End_customer,
  checkRefToken_Front_End_customer,
} = require("../middleware/customerPrivate");

const customerRouter = Router();

//login DONE
customerRouter.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Please enter your email")
      .isEmail()
      .withMessage("Correct your email")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Please enter your password")
      .isStrongPassword()
      .withMessage("It is not strong password"),
  ],
  checkValidationResult,
  authenticateCustomer,
  generateJWT,
  generateRefreshToken,
  loginController
);

//signup DONE
customerRouter.post(
  "/",
  [
    body("first_name").notEmpty().withMessage("Please enter your first name"),
    body("last_name").notEmpty().withMessage("Please enter your last name"),
    body("email")
      .notEmpty()
      .withMessage("Please enter your email")
      .isEmail()
      .withMessage("Correct your email")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Please enter your password")
      .isStrongPassword()
      .withMessage("It is not strong password"),
  ],
  checkValidationResult,
  isCustomer,
  checkEmailExists,
  createCustomer,
  generateTokenEmail,
  sendEmail,
  signupController
);

// http://localhost:0000/v1/customers?query=abdel&page=1&sort=DESC
//search DONE except privileges
customerRouter.get(
  "/search",
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
  searchCustomer,
  searchCustomerController
);

// http://localhost:0000/v1/customers?page=1&sort=DESC
// get list DONE except privileges
customerRouter.get(
  "/",
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
  listCustomers,
  listCustomersController
);

//get profile DONE EXCEPT privileges : customer
customerRouter.get(
  "/profile",
  verifyJWT,
  verifyRefreshToken,
  getCustomerProfile,
  getProfileCustomerController
);

//email validation DONE
customerRouter.get(
  "/email/validation/",
  [
    query("token")
      .notEmpty()
      .withMessage("must value in token query")
      .isJWT()
      .withMessage("this is not a JWT token"),
  ],
  ValidatFields,
  async (req, res, next) => {
    const secret_key_jwt = process.env.JWT_SECRET;
    const { token } = req.query;
    if (!token) {
      const error = new Error("missing token in query");
      error.status = 404;
      next(error);
      return;
    }
    try {
      const decodedToken = jwt.verify(token, secret_key_jwt);
      const customer = await Customer.findOne({
        _id: decodedToken._id,
      });
      if (!customer) {
        res.status(400).json({ message: "customer not found" });
        return;
      }
      if (customer.valid_account) {
        console.log("account already validated");
        res.status(400).json({ message: "account already validated" });
        return;
      }
      const updatedCustomer = await Customer.updateOne(
        { _id: customer._id },
        { valid_account: true }
      );
      if (updatedCustomer.modifiedCount == 0) {
        res.status(422).json({ message: "Customer not found" });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "your compte validated successfully",
      });
    } catch (error) {
      const err = new Error("invalid token");
      err.status = 401;
      next(err);
      return;
    }
  }
);

//get by id DONE EXCEPT privileges : admin, manager
customerRouter.get(
  "/:id",
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
  getCustomerById,
  getCustomerByIdController
);

//update DONE EXCEPT privileges : admin, manager
customerRouter.put(
  "/:id",
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
  updateCustomer,
  updateCustomerController
);

//update data DONE EXCEPT privileges : customer
customerRouter.patch(
  "/profile/update",
  verifyJWT,
  verifyRefreshToken,
  updateDataCustomer,
  updateCustomerDataController
);

//delete DONE EXCEPT privileges : customer
customerRouter.delete(
  "/delete",
  verifyJWT,
  verifyRefreshToken,
  deleteCustomer,
  deleteCustomerController
);

// to verify token for customer in front end
customerRouter.post(
  "/token",
  checToken_Front_End_customer,
  checkRefToken_Front_End_customer,
  (req, res, next) => {
    let newaccToken = req.token;
    let data = req.payload;
    let userdata = {
      id: data.id,
      _id: data._id,
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.user_name,
    };
    // console.log("hna data", newaccToken);
    res.status(200).json({
      status: 200,
      data: userdata,
    });
  }
);

module.exports = customerRouter;
