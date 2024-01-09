const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");



// generate token
function generateJWT(req, res, next) {
  const customer = req.customer;
  const expiresIn = "180s";
  const accessToken = jwt.sign(
    { _id: customer._id },
    process.env.JWT_SECRET,
    {
      expiresIn,
    }
  );
  // res.setHeader("Authorization", `Bearer ${accessToken}`);
  req.acc = accessToken;
  next();
}



// verify jwt
async function verifyJWT(req, res, next) {
  const secret_key_jwt = process.env.JWT_SECRET;
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    const error=new Error('missing cookies');
    error.status=404;
    next(error);
    return ;
  }
  try {
    // Verify and decode the JWT token
    console.log('hna 1');
    const decodedToken = jwt.verify(accessToken, secret_key_jwt);
    const {_id}=decodedToken;
    const findcustomer=await Customer.findOne({_id});
      if(!findcustomer){
        const error=new Error('you not a customer !');
        error.status=404;
        next(error);
        return ;
      }
    req.payload = findcustomer;
    next();
  } catch (error) {
    req.payload=null;
    next()
  }
}



// generate refrech token
function generateRefreshToken(req, res, next) {
  const expiresIn = "300s";
  
  const customer = req.customer;
  const refreshToken = jwt.sign(
    { _id: customer._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn,
    }
  );
  req.ref = refreshToken;
  next();
}



// verify refresh token
async function verifyRefreshToken(req, res, next) {
  if(!req.payload){
 const refreshToken=req.cookies.refreshToken
  try {
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
   const {_id}=decodedRefreshToken;
      const findcustomer=await Customer.findOne({_id});
      if(!findcustomer){
        const err=new Error('you not a customer !!! ');
        err.status=404;
        next(err);
        return;
      }
      req.payload=findcustomer;
      next()
  } catch (error) {
    const err=new Error('invalid token');
    err.status=403;
    next(err)
  }
}else{
  next()
}
}



// generate token email
function generateTokenEmail(req, res, next) {
  const secret_key_jwt = process.env.JWT_SECRET;
  const customer = req.customer;
  const expiresIn = "1h";
  const token = jwt.sign({ _id: customer._id }, secret_key_jwt, {
    expiresIn,
  });
  req.token = token;
  next();
}



// verify is a custumor or not
function noRole(req,res,next){
if(req.payload.role){
  next();
  return;
}
const error=new Error('unauthorized you not customer');
error.status=403;
next(error)
}


module.exports = {
  generateJWT,
  verifyJWT,
  generateRefreshToken,
  verifyRefreshToken,
  generateTokenEmail,
  noRole
};
