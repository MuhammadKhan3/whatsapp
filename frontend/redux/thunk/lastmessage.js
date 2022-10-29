import React from 'react'
import { message_action } from '../messageSlice'
import { Cookies } from "react-cookie";
const cookies=new Cookies();
const userId=cookies.get('userId');
const token=cookies.get('token');
console.log(userId,token)
// const [cookies, setCookie] = useCookies(["userId","token","receiveId","socketId"]);
//     const {userId,token}=cookies;
const LastMessage = (receiveId) => {
    

  return (dispatch)=>{
    const fetchapi=()=>{
        fetch("http://localhost:8000/last-message",{
            method:'POST',
            headers:{
              'Content-Type': 'application/json',
              'Authorization':'Bearer '+token,
            },    
            body:JSON.stringify({userId:userId,receiveId:receiveId}),
          })
    
          .then(res => res.json())
          .then((response)=>{
            // setlastmessage();
            dispatch(message_action.setlmessage(response?.message?.message));

          })
    }
    fetchapi();
  }
}

export default LastMessage