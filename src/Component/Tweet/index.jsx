import React from "react";
import UseDeleteDataWithImage from "../../hooks/UseDeleteData";
import s from "./styles.module.scss"

const Tweet = ({
  item, type, onClickTrack = () => {}
}) => {

  return (
    <div className={s.container} onClick={() => onClickTrack(item)}>
      <img src={item?.image}></img>
      <div className={s.content}>
        <div>{item?.nama}</div>
        <div>{item?.namaTempat}</div>
        {/* <p>{data.temp}</p> */}
        <div>{item?.desc}</div>
      </div>
      <UseDeleteDataWithImage id={item?.id} image={item?.image} type={type}/>
    </div>
  );
};

export default Tweet;
