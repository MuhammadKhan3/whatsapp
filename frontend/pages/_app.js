// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'
// own css files here

import '../styles/globals.css'
import {Cookies} from 'react-cookie'
import Authenticate from './authorize'
import { CookiesProvider } from "react-cookie"
import { Provider } from 'react-redux'
import {store} from '../redux/store'
import React,{useEffect} from 'react'
const { io } = require("socket.io-client");
const socket = io("http://localhost:8000");
const cookies=new Cookies();
function MyApp({ Component, pageProps }) {
  // useEffect(()=>{
  //   let text=window.prompt('Enter the name','dflkj')
  //   if(text==="" || text===""){
  //     text = "User cancelled the prompt.";
  //   }else{
  //     socket.emit('join-room',{name:text});
  //   }
  // },[])
  // socket.on('user',({user})=>{
  //   cookies.set('name',user.name);
  //   cookies.set('userId',user.id);
  //   cookies.set('socketId',user.socketId);
  // })
  return (<CookiesProvider>
         <Provider store={store}>
          <Component {...pageProps} />
         </Provider>
         </CookiesProvider>)
}
export default MyApp;