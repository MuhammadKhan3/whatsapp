import { useCookies } from 'react-cookie';
import Image from 'next/image';
import Styles from '../styles/messagebox.module.css';
import profile from '../public/1.jpg'
import moment from 'moment'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import InputBox from './inputbox';
import { useDispatch, useSelector } from 'react-redux';
import { message_action } from '../redux/messageSlice';
import { socket } from './socket';
import Callnotification from './callnotification';
var Peer = require('simple-peer');

const MessageBox = ({messagesEndRef,messages,user}) =>{
    // const messagesEndRef = React.useRef();
    const dispatch=useDispatch();     const [callend,setcallended]=useState(null);
    const [calls,setcalls]=useState({});
    const [stream,setstream]=useState(null);
    const [callaccepted,setcallaccepted]=useState(false);
    const [name,setname]=useState();
    const peerid=useSelector(state=>state.messageSlice.peerid)
    const [remotePeerid,setremotePeerid]=useState('');
    const remoteuserref=useRef(null);
    const localuserref=useRef(null);
    const peerinstance=useRef(null);
    const [cookies,setCookies]=useCookies(["userId","email"]);
    const targetRef = useRef();
    const [dimension,setDimensions]=useState({width:0,height:0});

    
    useEffect(() => {
            if (targetRef.current) {
              setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight
              });
            }
            navigator.mediaDevices.getUserMedia({video:true,audio:true})
            .then((currenStream)=>{
                  localuserref.current.srcObject=currenStream;
                  // localuserref.current.play();
                  setstream(currenStream);
            })
            socket.on("callUser",({from,name,signal})=>{
              setcalls({isReceivedCall:true,from,name,signal})
            })
    }, []);
    const answerCall=()=>{


          const peer=new Peer({initiator:false,trickle:false,stream});
          peer.on('signal',(data)=>{
            socket.emit('answercall',{signal:data,to:cookies.receiveId});
          })
          peer.on('stream',(remoteStream)=>{
            setcallaccepted(true);
            console.log(stream)
            remoteuserref.current.srcObject=remoteStream;
            remoteuserref.current.play();
          })
          console.log(calls.signal)
          peer.signal(calls.signal);
          peerinstance.current=peer;
      
    }
    const userCall=()=>{        
     
      
      const peer=new Peer({initiator:true,trickle:false,stream});
      peer.on('signal',(data)=>{
        socket.emit('calluser',{userToCall:cookies.receiveId,signalData:data,from:socket.id,name});
      })

      peer.on('stream',(remoteStream)=>{
        console.log('stream')
        remoteuserref.current.srcObject=remoteStream;
        remoteuserref.current.play();

      })
      
      socket.on('callaccepted',(signal)=>{
        console.log('accepted susscusefully')
        setcallaccepted(true);
        peer.signal(signal);
      })
      peerinstance.current=peer;
    }
    const leaveCall=()=>{
      setcallended(true);
      peerinstance.current.destroy();
      window.location.reload();
    }
  return (
    <div className={Styles.mainContainer}>
        <div className={Styles.innerContainer}>
               <div className={Styles.profileContainer}>
                <Image
                  src={profile}
                  alt="profilepic"
                  width="40px"
                  height="40px"
                />
              </div>
              <p className={Styles.name}>{cookies?.email}</p>

              <div className={Styles.phoneIcons}>
                 <svg style={{width:'20px',color:'lightblue'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" onClick={userCall}/></svg>
                 <p>Remote</p>
                 <video ref={remoteuserref} autoPlay/>
                 <p>local</p>
                 <video ref={localuserref} muted autoPlay playsInline/>
              </div>
        </div>

        <div className={Styles.messageContainer}>
            <ul 
            className={Styles.messageList}>
              {messages.map((message)=>{
                return<>
                {message?.receiveId===parseInt(cookies.userId) ?
                <div  className={Styles.sender}>
                    <li className={Styles.receiveMessage}>{message.message} <span className={Styles.sendMessagetime}>{moment(message.createdAt).format("h:mm a")}</span></li>
                </div>
                :
                <div className={Styles.receiver}>
                  <li className={Styles.sendMessage} style={{float:'right',marginRight:'30px'}} ref={targetRef}>{message.message}<span className={Styles.sendMessagetime}>{moment(message.createdAt).format("h:mm a")}</span></li>
                </div>
                }
                </>
              })}            


            </ul>
        <div ref={messagesEndRef} />
        </div>
        <InputBox messagesEndRef={messagesEndRef}/>
        {calls?.isReceivedCall && !callaccepted &&
        <Callnotification answerhandler={answerCall}/>
        }
    </div>
  )
}

export default MessageBox