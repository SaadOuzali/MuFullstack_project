const express = require("express");
const { connect_to_DB } = require("./config/database");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jsonwebtoken = require("jsonwebtoken");
const { userRouter } = require("./routes/userRoutes");
const { productsRouter } = require("./routes/productRoutes");
const { categorieRouter } = require("./routes/categoriesRoutes");
require("dotenv").config();

const customerRouter = require("./routes/customerRoutes.js");
const orderRouter = require("./routes/orderRoutes.js");

app.use(
  session({
    secret: "fjklsjfkljj",
    resave: "true",
    saveUninitialized: false,
  })
);
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connect_to_DB()
  .then(() => {
    console.log("connection to DB success");
  })
  .catch((err) => {
    console.log(err);
  });

// const transporter=nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:process.env.USER_MAIL,
//         pass:process.env.USER_PASSWORD
//     }
// })

// const mailoptions={
//     from:process.env.USER_MAIL,
//     to:"saadouzali@gmail.com",
//     subject:"resest password",
//     html:`<h1> wa3 </h1>`
// }

// async function main(){
//     const info= await transporter.sendMail(mailoptions);
//     console.log("Message sent: %s", info.messageId)
// }

// main().catch(console.error)

app.use((req, res, next) => {
  console.log(req.body);
  next();
});

app.use("/v1/customers", customerRouter);
app.use("/v1/orders", orderRouter);
app.use("/v1/users", userRouter);
app.use("/v1/products", productsRouter);
app.use("/v1/categories", categorieRouter);

app.use((req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "page not found check your URL",
  });
});

//for handling globale error
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || "can not process your request";
  res.status(status).json({
    status: "failed",
    Error: error,
  });
});

app.listen(process.env.PORT, () => {
  console.log("port 3000 listenning");
});
