const express = require('express')
const cors=require('cors')
const moment=require('moment');
const controller=require('./controllers/controllers');
const app = express()
const  {Op}=require('sequelize');

const db=require('./untils/db');
const User=require('./model/user');
const Message=require('./model/message');

const  routes  = require('./routes/routes');
const http= require("http").Server(app);
const io = require('socket.io')(http,{
  cors:{
    origin:"*"
  }
});

// const httpServer = ;
// const io = new Server(httpServer,  {
  //   cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"]
    //   }
    // });
  let users=[];


const port = process.env.Port || 5000;
var corsOptions = {
  origin: 'http://localhost:3000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors(corsOptions));
app.use('/',routes)

var users_socket=[];
io.on("connection", (socket) => {

  // socket.on('connect',(data)=>{
  // })

  socket.on('disconnect',()=>{
    users=users.filter((user)=>{user.socketId===socket.id});
    console.log('disconnect....',socket.id)
    delete users_socket[socket.id]
  })

  console.log('connectio.',socket.id)
  
  // socket.on("connect", () => {
  //   console.log('conect.......')
  // });
  socket.on('user-connected',(userid,receiveId,stream)=>{
    socket.emit()
  })
  // socket.emit("user-stream",)
  socket.on("connected",(data)=>{
    console.log(data)
    // users_socket.push({id:data.userId,socketId:socket.id});
    const i = users_socket.findIndex(user=> user.userId=== data.userId);
    console.log(i);
    console.log(users_socket)
    if (i > -1) users_socket[i]=data; // (2)
    else users_socket.push(data);
    console.log(users_socket)
    // User.update({socketId:socket.id},{where:{id:data.userId}})
    // .then((user)=>{
    //   console.log(user)
    // })
  })
  socket.on('join-room',(data)=>{
    let {name}=data;
    name=name?.toLowerCase() || 'hitech';
    users.push({name:name,socketId:socket.id})   
    User.findOne({where:{name:name}})
    .then((user)=>{
      if(user){
        user.socketId=socket.id;
        users_socket.push({id:user.id,socketId:socket.id});
        user.save();
        socket.emit('user',{user:user})
      }else{
        User.create({
          name:name,
          socketId:socket.id,
        }).then((user)=>{
          users_socket.push({id:user.id,socketId:socket.id});
          // socket.emit('user',{user:user})
        })
      }
    })

  })

  socket.on('send-message',(data)=>{

    console.log(users_socket)
        const {msg,receiveId,userId}=data;
        console.log(moment().utc().format())
        Message.create({
          message:msg,
          createdAt:moment().utc().format(),
          sendId:userId,
          receiveId:receiveId,
        }).then((user)=>{
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
                  const user=users_socket.find(user=>user.userId===receiveId);
                  if(!messages){
                    
                  }else{
                    console.log('receivemsg')
                    console.log(user?.socketId)
                    socket.to(user?.socketId).emit('receive-message',{msg:messages});
          }
        })
        })

  })
  // call user
  socket.on('calluser',({userToCall,signalData,from,name})=>{

    const to=users_socket.find((user)=>user.userId===userToCall);
    console.log('from',from)

    io.to(to.socketId).emit("callUser",{signal:signalData,from:from,name:name})
    // io.to()
  })
  socket.on('answercall',(data)=>{
    console.log('answer',data);
    const user=users_socket.find(user=>user.userId===data.to);
    console.log(user);
    io.to(user?.socketId).emit('callaccepted',data.signal)
  })
});





User.hasMany(Message, {foreignKey: 'sendId',as:'messages'})
Message.belongsTo(User, {foreignKey: 'sendId',as:'send_id'})

User.hasMany(Message, {foreignKey: 'receiveId',as:'receive_message'})
Message.belongsTo(User, {foreignKey: 'receiveId',as:'receive_id'})

db.sync({alter:true})
.then((db)=>{
  // console.log(db)
})

http.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
