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
    
 }
};
