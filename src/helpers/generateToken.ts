import jwt from "jsonwebtoken";

const generateToken = (payload:{email:string,role:string}, secret: string, expiresIn: string) => {
  const token = jwt.sign(payload, secret, { algorithm: "HS256", expiresIn });
  return token;
};

export default generateToken;
