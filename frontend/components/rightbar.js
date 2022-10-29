import React from 'react'
import Styles from '../styles/Rightbar.module.css'
import InputBox from './inputbox'
const Rightbar = () => {
  return (
    <div className={Styles.mainContainer}>
        <div className={Styles.innerContainer}>
          <p className={Styles.heading}>WhatsApp Web <span className={Styles.headingBadge}>NEW</span></p>
          <p className={Styles.paragraph}>Now send and receive messages without keeping your phone online
          <br/>
          Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
          <span className={Styles.border}></span>
        </div>
    </div>
  )
}

export default Rightbar