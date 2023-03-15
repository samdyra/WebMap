import React, { memo } from "react";
import s from "./style.module.scss";

const ModalTutorial = ({ open, onClose }) => {

  if (!open) return null;

  return (
    <div>
      <div onClick={onClose} className={s.overlay}>
        <div className={s.modalContainer}>
          <h1>How to use this app?</h1>
          <p>Terdapat dua mode, pertama mode tracking, silahkan klik 2 titik berbeda, untuk mendapat arahan jalan.</p>
          <p>Mode kedua pinpoint, silahkan klik 1 titik, untuk mensave titik POI.</p>
          <p>Untuk mengganti mode, klik tombol putih dibawah bagian map</p>
          <p>Disebelah kiri ada control panel untuk membantu mencari arah jalan, dan bisa di ganti ke saved data, untuk melihat data yang sudah di save</p>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalTutorial);
