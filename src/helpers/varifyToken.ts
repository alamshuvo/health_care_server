import jwt from 'jsonwebtoken'
const verifyToken = (token:string,secret:string)=>{
const decodedData = jwt.verify(token,secret);
return decodedData
}

export default verifyToken