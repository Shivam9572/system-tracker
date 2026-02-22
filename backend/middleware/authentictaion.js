import jwt from "jsonwebtoken";

export const authentication=async(req,res,next)=>{
    try{
     let token=req.headers.token;
     let verify=jwt.verify(token,"secret");
     if(!verify){
        res.status(201).json({message:"unauthorization"});
        return;
     }
     req.id=verify;
     next();
    }catch(err){
    console.log(err);
    res.status(201).json({message:"somethong went wrong"});

    }
}