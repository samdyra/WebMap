import React, { memo } from 'react'
import s from './style.module.scss'
import click from "../../assets/click.png"

const PressComponent = ({ handleTrackingMode, trackingMode }) => {
  const word = trackingMode ? 'You are on tracking mode, click this button to switch to pinpoint mode' : 'You are on pinpoint mode, click this button to switch to tracking mode'

  return (
    <div onClick={handleTrackingMode} className={s.wrapper}>
      <img src={click}></img>
      <div>{word}</div>
    </div>
  )
}

export default memo(PressComponent)