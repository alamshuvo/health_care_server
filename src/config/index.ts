import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  jwt: {
    jwtAccessToken: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRATION,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
   
  },
 bcrypt:{
    bacryptSaltRound: process.env.BCRYPT_SALT_ROUNDS,
 },
 resetPasswordCredential:{
    resetPasswordSecret: process.env.RESET_PASSWORD_TOKEN,
    resetTokenExpireIn: process.env.RESET_EXPIRES_IN,
    resetPasswordLink: process.env.RESET_PASSWORD_LINK,
 },
 nodeMailer:{
    GooglePassword: process.env.SEND_MAIL_PASSWORD,
    GoogleEmail: process.env.SEND_MAIL_EMAIL,
    
 },
 cloudinary:{
   cloudinaryName:process.env.CLOUDINARY_NAME,
   cloduninaryKey:process.env.CLOUDINARY_API_KEY,
   cloudinarySecret:process.env.CLOUDINARY_SECRET,
   cloudinaryURL: process.env.CLOUDINARY_URL
 },
 ssl:{
   storeId:process.env.STORE_ID,
   storePassword:process.env.STORE_PASSWORD,
   sucessURL:process.env.SUCESS_URL,
   cancelURL:process.env.CANCEL_URL,
   failedURL:process.env.FAILED_URL,
   sslPaymentUrl:process.env.SSL_PAYMENT_URL,
   sslValidationApi:process.env.SSL_VALIDATION_API
 }
};
