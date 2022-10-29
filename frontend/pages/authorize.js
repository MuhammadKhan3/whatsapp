import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useRouter } from "next/router"
import Login from "./login";
// import SideBar from "../components/sidebar";
// import React, { useState,useEffect } from 'react';

const Authenticate = ({Component}) => {
  const [authorize,setauthorize]=useState(false);
  const [cookies,setCookies]=useCookies(["token"]);
  const router=useRouter();
  // console.log(data)
    useEffect(()=>{
      fetch("http://localhost:8000/authorize",{
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
          "Authorization":"Bearer "+cookies.token,
        }
      }).then((response)=>{
        return response.json();
      })
      .then((data)=>{
        console.log(data);
        const {authorize}=data;
        console.log(authorize)
        if(authorize){
          console.log('1')
          router.push('/');
          setauthorize(authorize)
        }else{
          console.log('2')
          setauthorize(authorize)
          router.push('/login')
        }
      })

    },[])
  return (
    <>
    {authorize ? 
    <Component/>
    :<Login/>
    }
    </>
  )
}

export default Authenticate