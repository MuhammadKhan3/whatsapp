const {validationResult}=require('express-validator');
var jwt = require('jsonwebtoken');
const Message = require('../model/message');
const  {Op}=require('sequelize');
const Sequelize=require('sequelize')
const User = require("../model/user");
const sequelize = require('sequelize');

exports.createUser=(req,res,next)=>{
    
    const errors=validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('request');
    const {email,password,socketId}=req.body;
    User.findOne({where:{email:email}})
    .then((user)=>{
        if(!user){
            User.create({
                email:email,
                password:password,
                socketId:socketId,
            }).then((created)=>{
                if(created){
                    const token=jwt.sign({userId: created.id,email:email}, 'secret', { expiresIn: '1h' });
                    res.status(200).json({userId:created.id,msg:'Succefully Created',flag:true,token:token});
                }else{
                    res.status(200).json({msg:'Created Succefully'});

                }
            }).catch(()=>{

            })
        }else{
            console.log(user.id)
            user.socketId=socketId;
            User.findOne(
                {where:{id:user.id}}
            ).then((user)=>{
                const token=jwt.sign({userId: user.id,email:email}, 'secret', { expiresIn: '1h' });
                res.status(200).json({msg:'Update Succefully',flag:true,userId:user.id,token:token});
            });
         }
    })

}

exports.getUsers=(req,res,next)=>{
    console.log('controller');
    const {userId}=req.body;
    console.log(userId)
    Message
    .findAll(
        {

            where:{
                [Op.or]:
                [
                    {sendId:userId},
                    {receiveId:userId}
                ]
        },
        include:[{
            model:User,
            as: 'send_id',

        },{
            model:User,
            as: 'receive_id',
        }],
        attributes:[
            "sendId",
            "receiveId",
            // [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'],
            // Sequelize.literal('DISTINCT ON ("receiveId", "sendId") *'),
            // [Sequelize.fn('DISTINCT', Sequelize.col('sendId')) ,'sendId'],
            // [Sequelize.fn('DISTINCT', Sequelize.col('receiveId')) ,'receiveId'],
            "message",
            "createdAt",
            
        ],
        
        // order:[['createdAt','As']],
        group:['receiveId','sendId']

    })
    .then((messages)=>{
        let extractMessage=[];
        messages.forEach((message)=>{
            const extmessage=messages.filter((data)=>{
                return message.receiveId!==data.sendId;
            })
            console.log(extmessage);
            extractMessage=extmessage;
        })
        res.status(200).json({users:extractMessage})
    })
}

exports.messages=(req,res,next)=>{
    const errors=validationResult(req);
    console.log('ids.',req.body.userId,req.body.receiveId);
    const userId =req.body.userId===undefined ? 1 :  req.body.userId;
    const receiveId=req.body.receiveId===undefined ? 1 :  req.body.receiveId;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    Message.findAll({
        where:{
            [Op.or]:
            [
                {
                    receiveId:receiveId,
                    sendId:userId,
                },
                {
                    sendId:receiveId,
                    receiveId:userId
                }
            ]
        },
        include:[{
            model:User,
            as: 'send_id',

        },{
            model:User,
            as: 'receive_id',
        }],        
        order: [['createdAt', 'asc']]
    })
    .then((messages)=>{
        User.findOne({where:{id:userId}})
        .then((user)=>{
            res.json({messages:messages,user:user,flag:true})
        })
    })
}


