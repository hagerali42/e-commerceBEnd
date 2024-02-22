import { StatusCodes } from "http-status-codes";
import userModel from "./../../../../DB/model/User.model.js";
import { ErrorClass } from "./../../../utils/error.Class.js";
import { generateToken, verifyToken,} from "./../../../utils/GenerateAndVerifyToken.js";
import sendEmail from "../../../utils/email.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import cloudinary from "../../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import cartModel from "../../../../DB/model/Cart.model.js";


export const signup = async (req, res, next) => {
  const { email,password } = req.body;
  //1-ckeck email is exisit
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(new ErrorClass("Email exists", StatusCodes.CONFLICT));
  }

  //2-hashedPassword
  req.body.password = hash({ plaintext: password });
  //image
  if(req.file){
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:'E-commerce/user'})
    req.body.image = {secure_url,public_id}
  }

//3-create new user
  const user = await userModel.create(req.body);
  const cart =await cartModel.create({userId: user._id})  
 
  //2-send email
  const token = generateToken({payload: { email },expiresIn: 60 * 9,signature: process.env.EMAIL_SIGNATURE});
  //*new request to confirm email valid 1 month ago
  const refreshToken = generateToken({payload: { email },expiresIn: 60 * 60 * 24 * 30,signature: process.env.EMAIL_SIGNATURE});
  //*new request to unsubscribe
  const unsubscribe = generateToken({payload: { email ,userId:user._id},signature: process.env.EMAIL_SIGNATURE});

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const rfLink = `${req.protocol}://${req.headers.host}/auth/newconfirmEmail/${refreshToken}`;
  const unsubLink = `${req.protocol}://${req.headers.host}/auth/unsubscribe/${unsubscribe}`;

  const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>

    <tr>
    <td>
    <h1 tyle="margin:0px;>Email Confirmation</h1>
    </td>
    </tr>

    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>

    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
       <br>
       <br>
    <tr>
    <td>
    <a href="${rfLink}" style="margin:30px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">New Confirm Email</a>
    </td>
    </tr>

    <br>
    <br>
    <tr>
    <td>
    <a href="${unsubLink}" style="margin:30px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:red; text-decoration: none; ">Unsubscribe</a>
    </td>
    </tr>
    <br>

    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`;

  if (!await sendEmail({ to: email, subject: "Confirm email", html })) {
    redirect("/auth");
    return next(new ErrorClass("Email rejected", StatusCodes.NOT_FOUND));
  }

  return res.status(StatusCodes.CREATED).json({ message: "Done", user });
};


export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({token,signature: process.env.EMAIL_SIGNATURE,});
  if (!email) {
    return next(
      new ErrorClass(" In-vaild token payload", StatusCodes.BAD_REQUEST)
    );
  }
  const user = await userModel.updateOne({email}, { confirmEmail: true });

  if (user.matchedCount) {
    return res.status(200).redirect(`${process.env.FE_URL}/#/login`);
  } else {
    return res.status(400).render(`confirmEmail`, { message: "NOT registered Account" });
    // return res.statuse(400).redirect(`${process.env.FE_URL}/#/NotFound`)
    //    return res.send(`<a href="">Ops You Dont have an Account</a>`);
  }
};

export const newconfirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({token,signature: process.env.EMAIL_SIGNATURE,});
  if (!email) {
    return next(new ErrorClass(" In-vaild token payload", StatusCodes.BAD_REQUEST));
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorClass(`Not Register accouunt`, StatusCodes.BAD_REQUEST)); //res.redirect("URL of SignUp Page")
  }
  if (user.confirmEmail) {
    return res.status(200).redirect(`${process.env.FE_URL}/#/login`);
    // return next(new Error(`'your Email confirmedd  please login in!!!'`)); //res.redirect("URL of Login Page")
  }
  //if user founded and confirm email==false   Send new email
  const newToken = generateToken({payload: { email },signature: process.env.EMAIL_SIGNATURE,expiresIn: 60 * 5,});
  const link = `${req.protocol}://${req.headers.host}/auth/newconfirmEmail/${newToken}`;
  const html = `<!DOCTYPE html>
               <html>
               <head>
                   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
               <style type="text/css">
               body{background-color: #88BDBF;margin: 0px;}
               </style>
               <body style="margin:0px;"> 
               <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
               <tr>
               <td>
               <table border="0" width="100%">
               <tr>
               <td>
               <h1>
                   <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
               </h1>
               </td>
               <td>
               <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
               </td>
               </tr>
               </table>
               </td>
               </tr>
               <tr>
               <td>
               <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
               <tr>
               <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
               <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
               </td>
               </tr>
               <tr>
               <td>
               <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
               </td>
               </tr>
               <tr>
               <td>
               <p style="padding:0px 100px;">
               </p>
               </td>
               </tr>
               <tr>
               <td>
               <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
               </td>
               <br>
               <br>
               </tr>
               </table>
               </td>
               </tr>
               <tr>
               <td>
               <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
               <tr>
               <td>
               <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
               </td>
               </tr>
               <tr>
               <td>
               <div style="margin-top:20px;">
   
               <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
               <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
               
               <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
               <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
               </a>
               
               <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
               <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
               </a>
   
               </div>
               </td>
               </tr>
               </table>
               </td>
               </tr>
               </table>
               </body>
                </html>`;
  if (!await sendEmail({ to: email, subject: "New Confirm email", html })) {
    redirect("/auth");
    return next(new ErrorClass("Email rejected", StatusCodes.NOT_FOUND));
  }
  return res.status(200).send("<h1> new confirmation email sent check your inbox now</h1>");
};

export const unsubscribe = async (req, res, next) => {
  const { token } = req.params;
  const decoded = verifyToken({token,signature: process.env.EMAIL_SIGNATURE,});
  const user = await userModel.findByIdAndDelete(decoded.id);
  if (!user) {
    return next(new ErrorClass(`<a href="">Ops You Dont have an Account</a>`,  StatusCodes.BAD_REQUEST) ); //res.redirect("URL of SignUp Page")
  }
  if (user) {
    res.status(200).json({ message: "Email Deleted !!Register Now" }); //res.redirect("URL of SignUp Page")
  }
};

export const login= async (req, res, next) =>{
 const {email,password} = req.body
 const user = await userModel.findOne({ email });
 if (!user) {
   return next(new ErrorClass("In-valid User Data", StatusCodes.NOT_ACCEPTABLE));
 }
 const match =compare({plaintext:password,hashValue:user.password})
 if (!match) {
  return next(new ErrorClass("In-valid User Data", StatusCodes.NOT_ACCEPTABLE));
}
const payload={
  id:user._id,
  email:user.email,
}
const token =generateToken({payload})
return res.status(StatusCodes.OK).json({message:'Done', token})

}
// 2. Middleware to Check Token Expiration
export const checkTokenExpiration = (req, res, next) => {
    // Check if token is present in headers
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token not provided' });
    }
    
    // Verify token expiration
    jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token expired' });
            }
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
        }
        // Token is valid, proceed to the next middleware or route handler
        req.user = decoded;
        next();
    });
}
// 3. Refresh Token Endpoint
export const refreshToken = (req, res, next) => {
    // Logic to refresh token
    // You can implement your own logic here, such as issuing a new token
    // and sending it back to the frontend
    const refreshedToken = generateToken({ payload: req.user });
    res.status(StatusCodes.OK).json({ token: refreshedToken });
}
export const forgotPassword =async (req, res) => {
  const {email} = req.body
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorClass(" User not found", StatusCodes.NOT_FOUND));
  }
  const code =  Math.floor(100000 + Math.random() * 900000); 
  const html=` 
  <h3 style="margin-top:10px; color:#000"> this code to verification</h3>
  <span style="background-color:##26acdc;height:500px;font-size:30px;color:#fff">${code}</span>`
  await sendEmail({ to: email, subject: "Forget Password", html })
  await userModel.updateOne({email},{code})
  return res.status(StatusCodes.OK).json({message:'Done'})
}

export const resetPassword =async (req, res) => {
  let {email,code ,password} = req.body
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorClass(" User not found", StatusCodes.NOT_FOUND));
  }
  if (code != user.code) {
    return next(new ErrorClass(" In-valid cod", StatusCodes.NOT_FOUND));
  }

  password = hash({ plaintext: password });
  let newcode=Math.floor(100000 + Math.random() * 900000); 
  await userModel.updateOne({email},{password,code:newcode})

  return res.status(StatusCodes.OK).json({message:'Done'})
}