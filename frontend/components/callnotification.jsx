import React from 'react'
import Styles from '../styles/callNotification.module.css'
const Callnotification = ({answerhandler}) => {
  return (
    <div className={Styles.container}>
        <button onClick={answerhandler}>Accept</button>
    </div>
  )
}

export default Callnotification