import React,{useEffect, useId} from 'react'
import Styles from '../styles/input.module.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { message_action } from '../redux/messageSlice';
import { useCookies } from 'react-cookie';
// const { io } = require("socket.io-client");
// const socket = io("http://localhost:8000");
import { socketID, socket } from './socket';

console.log(socket.id)
const InputBox = ({messagesEndRef}) => {
  const [cookies,setCookies]=useCookies(["userId","receiveId"]);
  const message=useSelector(state=>state.messageSlice.message);
  const messages=useSelector(state=>state.messageSlice.messages);
  // const messagesEndRef = React.useRef(null)
  const dispatch=useDispatch();
  const messagehandler=(e)=>{
    dispatch(message_action.setmessage(e.target.value));
    console.log(message)
  }
  const sendMessage=()=>{
    console.log('send-mesage',{userId:cookies.userId,receiveId:cookies.receiveId,msg:message,socketId:socketID})
    socket.emit("send-message",{userId:cookies.userId,receiveId:cookies.receiveId,msg:message,socketId:socketID});    
    dispatch(message_action.setmessagesend({message:message,receiveId:cookies.receiveId,sendId:cookies.userId}))
    console.log(messages);
    dispatch(message_action.setmessage(""));
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }  

  

  useEffect(()=>{
    const  keyDownHandler=event=>{
      console.log('event',event)
      if(event.key==='Enter'){
        event.preventDefault();
        sendMessage();
      }
     }
     document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  },[messagehandler])
  return (
    <div className={Styles.inputContainer}>
       <input type='text' className={Styles.input} value={message} onChange={messagehandler} />    
       <button className={Styles.sendBtn}  onClick={sendMessage}>Send</button>
       <div ref={messagesEndRef} />

    </div>
  )
}
export default InputBox