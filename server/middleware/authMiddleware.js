const { validationResult, param } = require("express-validator");
const { sign, verify } = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Users } = require("../models/User");

require("dotenv").config();

// const checkRfrToken = (refreshToken) => {

//   try {
//     const userdata = verify(refreshToken, process.env.JWT_REFRESH_SECRET);

//     req.payload=userdata;
//     console.log(userdata);
//     return {status: true}
//   } catch (error) {
//     const err = new Error("invalid token");
//     err.status = 401;
//     return {status: false, err};
//   }
// }

//middelware handlin refrech token
const refreshAccToken = async (req, res, next) => {
  // Access token failed
  if (!req.payload) {
    try {
      const userdata = verify(
        req.cookies.refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      const { _id } = userdata;

      const newAccToken = sign({ _id: userdata._id }, process.env.JWT_SECRET, {
        expiresIn: "180s",
      });

      res.cookie("accessToken", newAccToken, {
        // secure:false,
        httpOnly: true,
        domain: "localhost",
      });
      const userData = await Users.findOne({ _id });

      if (!userData) {
        const error = new Error("you don't have enough privilege !!! ");
        error.status = 404;
        next(error);
        return;
      }
      req.payload = userData;
      console.log("req.payload", req.payload);
      next();
    } catch (error) {
      const err = new Error("Login again");
      err.status = 401;
      next(err);
    }
  } else {
    next();
  }
};

// middelware check jwt
async function CheckJWT(req, res, next) {
  const auth = req.headers.authorization;
  let token = req.cookies.accessToken;

  if (typeof auth == "string" && auth.length > 0) {
    token = req.headers.authorization?.split(" ")[1];
  }

  if (!token) {
    const error = new Error("Missing token");
    error.status = 404;
    next(error);
    return;
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET);
    const { _id } = payload;
    const userdata = await Users.findOne({ _id });
    if (!userdata) {
      const error = new Error("you dont have enough priviliege ");
      error.status = 404;
      next(error);
      return;
    }
    req.payload = userdata;
    next();
  } catch (error) {
    req.payload = null;
    next();
    // const refreshToken = req.cookies.refreshToken;
    // console.log("verify 2",refreshToken);
    // if (!refreshToken) {
    //   const err = new Error("missing refresh token in cookies");
    //   err.status = 401;
    //   next(err);
    //   return;
    // }
    // const checkingRefToken = checkRfrToken(refreshToken)
    // if(checkingRefToken.status == true) {
    //   const token = sign({ ...req.session.user }, process.env.JWT_SECRET, {
    //     expiresIn: "1h",
    //   })
    //   res.cookie("accessToken", token, {
    //     httpOnly: true,
    //     domaine: "localhost"
    //   });
    //   return next();
    // } else {
    //   next(checkingRefToken?.err)
    // }
  }
}

// middelware validate fields
function ValidatFields(req, res, next) {
  // console.log('hna');
  const error = validationResult(req);
  if (!error.isEmpty()) {
    // const error=new Error(error.array());
    // error.status(400)
    res.status(400).json({ status: "Failed", error: error.array() });
    // next(error)
    return;
  }

  next();
}

//middelware check activation of user
function isActive(req, res, next) {
  const { active } = req.payload;
  if (active) {
    next();
  } else {
    const err = new Error("you not active");
    err.status = 401;
    next(err);
  }
}

// middelware verify role user admin or manager
async function VerifyRole(req, res, next) {
  const { role } = req.payload;
  if (role == "admin") {
    next();
  } else {
    const err = new Error("you unauthorized not admin");
    err.status = 401;
    next(err);
  }
}

// middelware generate jwt
function GenerateJWT(req, res, next) {
  try {
    const token = sign({ _id: req.session.user._id }, process.env.JWT_SECRET, {
      expiresIn: "20s",
    });
    const refreshtoken = sign(
      { _id: req.session.user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "180s",
      }
    );

    console.log("Tokens", token);
    console.log("Ref Token", refreshtoken);

    const { _id, user_name, email, role, id } = req.session.user;
    res
      .status(200)
      .cookie("refreshToken", refreshtoken, {
        secure: false,
        httpOnly: false,
        domain: "localhost",
      })
      .cookie("accessToken", token, {
        secure: false,
        httpOnly: false,
        domain: "localhost",
      })
      .json({
        status: "success",
        access_token: token,
        data: { _id, user_name, email, role, id },
        refrech_token: refreshtoken,
      });
  } catch (error) {
    const err = new Error(error.message ?? "can not create token");
    err.status = 404;
    next(err);
  }
}

function admin_OR_manager(req, res, next) {
  console.log("hnaaanannanna");
  const { role } = req.payload;
  if (role == "admin" || role == "manager") {
    next();
  } else {
    const error = new Error("you unauthorized not admin or manager ");
    error.status = 403;
    next(error);
  }
}

async function isCustomer(req, res, next) {
  const { email } = req.body;
  const finduser = await Users.findOne({ email });
  if (finduser) {
    const error = new Error("can not signup with this mail is private ");
    error.status = 401;
    next(error);
    return;
  }
  next();
}

async function SendMail(req, res, next) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const mailoptions = {
    from: process.env.USER_MAIL,
    to: req.user.email,
    subject: "New Credentials",
    html: `<p> hello i'm saad ouzali this is your credentials ${JSON.stringify(
      req.user
    )} </p>`,
  };

  transporter
    .sendMail(mailoptions)
    .then((info) => {
      res.status(201).json({
        status: "success",
        message: "user created successfully ",
      });
      console.log("Message sent: %s", info.messageId);
    })
    .catch((err) => {
      const error = new Error("can not send email");
      error.status = 500;
      console.log(err);
      next(error);
    });
}

function checkValidationResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send({ message: "Express validation ERROR UGH: ", errors });
  }
  next();
}

// verify token for front-end
async function verifytoken_for_front_end(req, res, next) {
  let token = req.cookies.accessToken;
  if (!token) {
    const error = new Error("Missing token");
    error.status = 404;
    next(error);
    return;
  }
  try {
    const payload = verify(token, process.env.JWT_SECRET);
    const { _id } = payload;
    const userdata = await Users.findOne({ _id });
    if (!userdata) {
      const error = new Error("user not found");
      error.status = 404;
      next(error);
      return;
    }
    req.payload = userdata;
    next();
  } catch (error) {
    req.payload = null;
    next();
  }
}

// verify refresh token for front-end
async function verifyrefreshtoken_for_front_end(req, res, next) {
  if (!req.payload) {
    try {
      const userdata = verify(
        req.cookies.refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      const { _id } = userdata;

      const newAccToken = sign({ _id: userdata._id }, process.env.JWT_SECRET, {
        expiresIn: "20s",
      });

      res.cookie("accessToken", newAccToken);
      const userData = await Users.findOne({ _id });

      if (!userData) {
        const error = new Error("user not found");
        error.status = 404;
        next(error);
        return;
      }
      req.payload = userData;

      next();
    } catch (error) {
      const err = new Error("Login again");
      err.status = 401;
      next(err);
    }
  } else {
    next();
  }
}

module.exports = {
  ValidatFields,
  CheckJWT,
  VerifyRole,
  GenerateJWT,
  SendMail,
  isActive,
  admin_OR_manager,
  refreshAccToken,
  checkValidationResult,
  isCustomer,
  verifytoken_for_front_end,
  verifyrefreshtoken_for_front_end,
};
