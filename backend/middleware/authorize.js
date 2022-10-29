const jwt=require('jsonwebtoken');
const User = require('../model/user');
require('dotenv').config();
const {Op}=require('sequelize');

const key=process.env.jwtkey;
module.exports=(req,res,next)=>{
    console.log(req);
    const authorization=req.header('authorization');
    console.log(authorization)
    const token=authorization.split(' ')[1];
    console.log(typeof token)
    if(!(token==='undefined')){
        const decode=jwt.verify(token,key)
        const {userId,email}=decode;
        User
        .findOne({where:{[Op.and]:[{id:userId,email:email}]}})
        .then((user)=>{
            console.log(user);
            if(!user){
                res.json({flag:false,authorize:false})
    
            }else{
                res.json({flag:true,authorize:true})
            }
        })
    }else{
        res.json({flag:false,authorize:false})
    }

}