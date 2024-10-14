const jwt=require('jsonwebtoken');
const {decrypt}=require('../utils/cryptoUtils');
const jwtSecret=process.env.JWT_SECRET;

const authMiddleware=(req,res,next)=>{
    try{
       
        const authHeader=req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer')){
            res.status(401).json({error:'Authorization header is missing or Invalid'});
        }

        const encrypted_token=authHeader.split(' ')[1];
        const decrypted_token=decrypt(encrypted_token);
        const decoded=jwt.verify(decrypted_token,jwtSecret);
        req.user=decoded;

    
        next();
    }
    catch(error){
        res.status(401).json({error:'Invalid or expired token'})
    }
}

module.exports=authMiddleware;