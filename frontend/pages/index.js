import {useEffect} from 'react'
import Rightbar from '../components/rightbar';
import SideBar from '../components/sidebar';
import Authenticate from './authorize';
export default function Home() {


  return (
    <>
      <Authenticate  Component={SideBar} />
    </>
  )
}
