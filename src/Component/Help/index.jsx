import React, { memo } from 'react'
import s from "./styles.module.scss"
import help from "../../assets/help.png"

const Help = ({ showModalTutorial }) => {
  return (
    <>
      <div className={s.wrapper} onClick={showModalTutorial}>
        <img src={help}/>
      </div>
    </>
  )
}

export default memo(Help)