import format from 'date-fns/format'
import styles from "../styles/Home.module.css";
import Image from "next/image";
import imgsrc from "../public/1.jpg";
import circle from "../public/images/circular-arrows.png";
import comment from "../public/images/comment.png";
import downarrow from '../public/images/down-arrow.png'
import React from 'react';
import menu from "../public/images/menu.png";
import Head from "next/head";
import { useEffect, useState } from "react";
import Rightbar from "./rightbar";
import MessageBox from "./messagebox";
import useSWR from 'swr'

import { useCookies } from "react-cookie";

import Cookies from "react-cookie";

import { socketID, socket } from './socket';
import { useDispatch, useSelector } from 'react-redux';
import { message_action } from '../redux/messageSlice';
import LastMessage from '../redux/thunk/lastmessage';




const SideBar = () => {
  // const [messages,setmessages]=useState([]);
  const dispatch=useDispatch();
  const [lmessage,setlmessage]=useState([]);
  // const lmessage=useSelector(state=>state.messageSlice.lmessage);
  const messagesEndRef = React.useRef();
  const messages=useSelector(state=>state.messageSlice.messages);
  const [user,setuser]=useState({});
  const [cookies, setCookie] = useCookies(["userId","token","receiveId","socketId"]);
  const {userId,receiveId,token}=cookies;
  const [users,setusers]=useState([]);
  const [menuflag,setmenuflag]=useState(false);
  

  
  // const {messages:data}=useSWR()
  useEffect(()=>{
  //   const connected=()=>{
      // socket.connect();
      socket.emit("connected",{userId:cookies.userId,socketId:socketID});
  //     }
  //     connected();
          fetch("http://localhost:8000/get-users",
          {
            method:'POST',
            headers:{
              'Content-Type': 'application/json',
              'Authorization':'Bearer '+token,
            },    
            body:JSON.stringify({userId:userId,receiveId:cookies.receiveId}),
          }
        )
        .then(res => res.json())
        .then((response)=>{
          console.log(response)

          setlmessage(response.lastmessages);
          //  dispatch(message_action.setlmessage(response.lastmessages));
          setusers(response.users);
          console.log(lmessage)
        })


  },[])
  useEffect(()=>{
    // if(menuflag){
      const messages=()=>{
        fetch('http://localhost:8000/messages',
        {
          method:'POST',
          headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+token,
          },    
          body:JSON.stringify({userId:userId,receiveId:receiveId}),
        }
      )
      .then(res => res.json())
      .then((response)=>{
        console.log(response)
        // setmessages(response.messages);
        dispatch(message_action.setmessages(response.messages));
        setuser(response.user);
      });
      }
      messages();
    // }
    // socket.connect();

    // socket.emit("connected",{userId:cookies.userId,socketId:socketID});
  },[receiveId])
  const [arrow,setarrow]=useState(0);

  const searchHandler=(event)=>{
    const {value}=event.target;
    console.log(value)
    fetch("http://localhost:8000/search-users",
    {
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization':'Bearer '+token,
      },    
      body:JSON.stringify({userId:userId,key:value}),
    })
    .then((response)=>response.json())
    .then((response)=>{
      console.log(response)
      setlmessage(response.lastmessages);
      //  dispatch(message_action.setlmessage(response.lastmessages));
      setusers(response.users);
    })
  }

  const inboxhandler=(id,email)=>{
    console.log('click',id,email)
    setmenuflag(true);
    // const {id}=event.target;
    setCookie("receiveId",id,{maxAge: 3600});
    setCookie("email",email,{maxAge: 3600});
    setCookie("socketId",socket.id,{maxAge: 3600});
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
  socket.on('receive-message',(data)=>{
    console.log('hit...');
    console.log(messages);
    dispatch(message_action.setmessages(data.msg));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    // setmessages(data.msg)
  })
  function lastmessage (receiveId){
      dispatch(LastMessage(receiveId))
      return lmessage;
  }
  return (
    <>
      <Head>
        <title>whatsapp</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <section className={styles.mainContainer}>
      
      {/* section complete */}
        {/* start div */}
        <div className={`${styles.margin} ${styles.head} `}>
            <p className={`${styles.margin} ${styles.headContent}`}>whatsapp</p>
          </div>
      <div className={styles.mainInnerContainer}>

          {/* Navbar menulist for example message,circle,menu icons */}
          <div className={styles.navContainer}>
            <nav className={styles.navInner}>
              <div className={styles.profileContainer}>
                <Image
                  src={imgsrc}
                  alt="profilepic"
                  width="50px"
                  height="50px"
                />
              </div>
              <div className={styles.navRight}>
                <div className={styles.circleArrow}>
                  <Image
                    src={circle}
                    alt="profilepic"
                    width="21px"
                    height="21px"
                  />
                </div>
                <div className={styles.comment}>
                  <Image
                    src={comment}
                    alt="profilepic"
                    width="21px"
                    height="21px"
                  />
                </div>
                <div className={styles.menu}>
                  <Image src={menu} alt="profilepic" width="21px" height="21px" />
                </div>
              </div>
            </nav>
          </div>
          {/* close navbar list */}
          {/* Search bar left side */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              onChange={searchHandler}
              className={styles.searchbar}
              placeholder="search or start new chat"
            />
          </div>
          {/* close search bar left side */}
          {/* Inbox messages  */}
          <div className={styles.inboxContainer}>
          {users?.map((value,i)=>{
            // start map
            return(
              <>

              {/* {value?.messages[0]?.receive_id?.id!==parseInt(cookies.userId)
                ? */}
                <div className={styles.inboxinnerContainer} key={value}  onMouseEnter={()=>{setarrow(i+1)}} onMouseLeave={()=>{setarrow(0)}} id={value?.id} onClick={()=>{inboxhandler(value?.id,value?.email)}}>
                <div className={styles.profileContainer}>
                  <Image
                    src={imgsrc}
                    alt="profilepic"
                    width="50px"
                    height="50px"
                  />
                </div>
                <p className={styles.personName}>
                  {value?.email}
                  <span className={`${styles.inboxtime} ${styles.margin}`}>
                  {/* {format(value?.createdAt, 'MM/dd/yyyy')} */}
                  {}
                  </span>
                  <br />
                  <span className={styles.personmessage}>{lmessage.length>0 && lmessage[i].lastmessages.substring(0,lmessage[i].lastmessages.length>50 ? 50 : lmessage[i].lastmessages.length)}</span>
                </p>
                {/* image include arrow */}
                {arrow===i+1 &&
                <div className={styles.downArrow}>
                  <Image src={downarrow} height='20px' width='20px'/>
                </div>}
                {/*close image  arrow */}
                
              </div>
              {/* : */}
              {/* <div className={styles.inboxinnerContainer} key={value} onMouseEnter={()=>{setarrow(i+1)}} onMouseLeave={()=>{setarrow(0)}} onClick={inboxhandler} id={value?.id}>
              <div className={styles.profileContainer}>
                <Image
                  src={imgsrc}
                  
                  alt="profilepic"
                  width="50px"
                  height="50px"
                />
              </div>
              {console.log(value?.messages[0]?.message)}
              <p className={styles.personName}>
                {value?.email}
                <span className={`${styles.inboxtime} ${styles.margin}`}> */}
                {/* {format(value?.createdAt, 'MM/dd/yyyy')} */}
                {/* </span>
                <br /> */}

                {/* <span className={styles.personmessage}>{lastmessage(value.id)}</span> */}
              {/* </p> */}
              {/* image include arrow */}
              {/* {arrow===i+1 &&
              <div className={styles.downArrow}>
                <Image src={downarrow} height='20px' width='20px'/>
              </div>} */}
              {/*close image  arrow */}
              
            {/* </div> */}
              {/* } */}
</>)
          })} 
          </div>
          {/* close Inbox Messages */}

      </div>
        {/* close start div */}
        {/* Right bar component */}
        {!menuflag ? <Rightbar/>:<MessageBox messages={messages} messagesEndRef={messagesEndRef} user={user}/>}
       <div ref={messagesEndRef} />

        {/* close Right bar component */}
      </section>
    </>
  );
};

export default SideBar