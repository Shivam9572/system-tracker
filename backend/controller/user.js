import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import DailyUserStatus from "../model/dailyUserStatus.js";

export const register=async(req,res)=>{
    try {
        let {email,password,cPassword,name} =req.body;
        if(!email || !password || !cPassword || !name){
            res.status(201).json({messaage:"details must be required"});
            return;
        }
        if(password !==cPassword){
            res.status(201).json({messaage:"password does not match"});
            return;
        }
        let user=await User.findOne({where:{email:email}});
        if(user){
            res.status(201).json({messaage:"user already register"});
            return;
        }
        let hasPassword= bcrypt.hashSync(password,10)
        await User.create({email,password:hasPassword,status:"active",name});
        res.status(200).json({messaage:true});
    } catch (error) {
        console.log(error);
        res.status(201).json({messaage:"something went wrong"});
    }
}

export const login=async(req,res)=>{
     try {
        let {email,password}=req.body;
        let user=await User.findOne({where:{email}});
        if(!user){
            res.status(201).json({messaage:"user not found"});
            return;
        }
        user=user.toJSON();
        let passwordMatch=bcrypt.compareSync(password, user.password);
        if(!passwordMatch){
             res.status(201).json({messaage:"password incorect"});

             return;
        }
        let token=jwt.sign(user.id,"secret");
        if(!token){
            throw new Error();
        }
         res.status(200).json({token});
     } catch (error) {
        console.log(error);
        res.status(201).json({messaage:"something went wrong"});

     }
}