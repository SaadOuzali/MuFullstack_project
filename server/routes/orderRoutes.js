const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const uuid = require("uuid");
const {
  createController,
  getOrderByIdController,
  listOrdersController,
  updateOrderController,
} = require("../controllers/orderController");
const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  getCustomerOrders,
} = require("../middleware/ordersMiddleware");
const { verifyJWT, verifyRefreshToken } = require("../middleware/token");
const {
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
} = require("../middleware/authMiddleware");
const { Users } = require("../models/User");
const { Products } = require("../models/Product");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const { default: Stripe } = require("stripe");

const orderRouter = express.Router();

//DONE
orderRouter.get("/myorders", verifyJWT, getCustomerOrders);
orderRouter.post(
  "/",
  verifyJWT,
  verifyRefreshToken,
  async (req, res, next) => {
    // const {token,amount}=req.body;
    const { token, order_items, cart_total_price } = req.body;
    console.log("hnnnnaaaaaa", req.body.order_items);
    console.log("custommerr",token);
    const idempotencyKey = uuid.v4();
    try {
      const customer = await stripe.customers.create({
        email: token.email,
        source: token,
      });
      console.log('customer',customer);
      const result = await stripe.charges.create(
        {
          amount: cart_total_price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
        },
        { idempotencyKey }
      );
      console.log('result',result);

        next()
      // res.status(200).send({ message: "Good", result });
    } catch (error) {
      console.log("hnaaferr",error);
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    }
  },
  // createOrder,
  // createController
);

// for payement
// orderRouter.post('/payement',async (req,res,next)=>{
// // const {token,amount}=req.body;
// const {email,token}=req.body;
// const idempotencyKey=uuid.v4();
// try {
//   const customer=await stripe.customers.create({
//     email:token.email,
//     source:token
//   })

//   res.status(200).json({data:customer})
// } catch (error) {
//   const err=new Error(error.message);
//   err.status=500
//  next(err)
// }
// })

// to get all document count
orderRouter.get(
  "/countdocument",
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
  async (req, res, next) => {
    console.log("hna");

    try {
      const numberOfUsers = await Users.find().countDocuments();
      const numberOfProducts = await Products.find().countDocuments();
      const numberOforders = await Order.find().countDocuments();
      const numberOfcustomers = await Customer.find().countDocuments();
      res.status(200).json({
        status: "success",
        data: {
          numberOfUsers,
          numberOfProducts,
          numberOforders,
          numberOfcustomers,
        },
      });
    } catch (error) {
      const err = new Error(error.message);
      err.status = 501;
      next(err);
    }
  }
);

orderRouter.post("/", verifyJWT, createOrder, createController);

//NEW
orderRouter.get("/myorders", verifyJWT, getCustomerOrders);

//DONE
orderRouter.get(
  "/:id",
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
  getOrderById,
  getOrderByIdController
);

//DONE
orderRouter.get(
  "/",
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
  listOrders,
  listOrdersController
);

//DONE
orderRouter.put(
  "/:id",
  CheckJWT,
  refreshAccToken,
  admin_OR_manager,
  updateOrder,
  updateOrderController
);

module.exports = orderRouter;
