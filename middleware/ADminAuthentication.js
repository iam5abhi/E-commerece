const jwt =require('jsonwebtoken')
const SecretKey =process.env.SERCRETKEY



const IsadminAuthentication =(req,res,next)=>{
    const token =req.headers.authorization.split(' ')[1]

     if(!token){
         return res.status(401).json({
             message:'User Is Not Unauthorized'
         })
     }

     const data = jwt.verify(token,SecretKey)
    if(!data){return res.status(401).json({ error: "Invalid token" });}
     req.admin  =data
     next()

}

module.exports =IsadminAuthentication