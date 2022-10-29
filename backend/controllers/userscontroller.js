const User = require("../model/user")
const  {Op, JSON}=require('sequelize');
const Message = require("../model/message");


exports.getAllUsers=async (req,res,next)=>{
    const {userId}=req.body;
    let lastmessages=[];

    // console.log('id..',userId,receiveId);
const user=await User.findAll({
    where:{
        [Op.not]: {id:userId},  
    },
    include:
    {        
    model: Message,
    // as: ['messages','receive_message'],
    as:'messages',
    // as:'messages',
    
    // where:{
    //     [Op.or]:[
    //         {
    //             sendId:userId,
    //             // receiveId:receiveId,
    //         },
    //         {
    //             // sendId:receiveId,
    //             receiveId:userId,
    //         }
    //     ]
    // },
    include: 
    [
    {
         model:User,
         as: 'send_id',
    },{
        model:User,
        as: 'receive_id',    
    }],
    order:['id','desc'],}}
)
// .then((user)=>{
// })
console.log('uu',user)
// res.json({users:user});
    
    for(var i=0;i<user.length;i++){
        const message=await Message.findAll({
            where:{
            [Op.or]:[
                {
                    sendId:userId,
                    receiveId:user[i].id,
                },
                {
                    receiveId:userId,
                    sendId:user[i].id,
                }
            ]
        },
        order:[['createdAt','DESC']]
        })

        lastmessages.push({lastmessages:message[0]?.message || ''})
        // return us;
    }

    console.log('last',lastmessages+"...");
    console.log('user',user+"...");
    res.json({users:user,lastmessages:lastmessages});
    // return lastmessages;
    // res.status(200).json({flag:true,message:message[0] || ''})

// .then((user)=>{
//     console.log('uu',user)
//     // res.json({users:user});
// })
}


exports.searchUsers=async (req,res,next)=>{
    const {userId,key}=req.body;
    console.log(userId,key)
    let lastmessages=[];

    // console.log('id..',userId,receiveId);
const user=await User.findAll({
    where:{
        [Op.not]: {id:userId},  
        email: {
            [Op.like]:'%'+key+"%",
        }
    },
    include:
    {        
    model: Message,
    // as: ['messages','receive_message'],
    as:'messages',
    // as:'messages',
    
    // where:{
    //     [Op.or]:[
    //         {
    //             sendId:userId,
    //             // receiveId:receiveId,
    //         },
    //         {
    //             // sendId:receiveId,
    //             receiveId:userId,
    //         }
    //     ]
    // },
    include: 
    [
    {
         model:User,
         as: 'send_id',
    },{
        model:User,
        as: 'receive_id',    
    }],
    order:['id','desc'],}}
)
// .then((user)=>{
// })
console.log('uu',user)
// res.json({users:user});
    
    for(var i=0;i<user.length;i++){
        const message=await Message.findAll({
            where:{
            [Op.or]:[
                {
                    sendId:userId,
                    receiveId:user[i].id,
                },
                {
                    receiveId:userId,
                    sendId:user[i].id,
                }
            ]
        },
        order:[['createdAt','DESC']]
        })

        lastmessages.push({lastmessages:message[0]?.message || ''})
        // return us;
    }

    console.log('last',lastmessages+"...");
    console.log('user',user+"...");
    res.json({users:user,lastmessages:lastmessages});
}



exports.lastMessage=(req,res,next)=>{
    const {userId,receiveId}=req.body;

    Message.findAll({
        where:{
        [Op.or]:[
            {
                sendId:userId,
                receiveId:receiveId,
            },
            {
                receiveId:userId,
                sendId:receiveId,
            }
        ]
    }
    ,
    order:[['createdAt','DESC']]
})
.then((message)=>{
        res.status(200).json({flag:true,message:message[0] || ''});
})
}