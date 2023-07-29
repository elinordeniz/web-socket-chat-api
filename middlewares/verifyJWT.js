const jwt= require('jsonwebtoken');
const {StatusCodes}= require('http-status-codes')

const verifyJWT= (req,res, next)=>{
    const token= req.cookies?.token;

if(token){
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded)=>{
        if(err) return res.status(StatusCodes.FORBIDDEN).json({"message": err});
        req.username=decoded.username;
        req.userId=decoded.userId;
        next();
    })
}else{
    return res.status(StatusCodes.UNAUTHORIZED).json({"message": "No token!"})
}
}

module.exports=verifyJWT;