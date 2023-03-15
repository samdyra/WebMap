import React, { memo } from "react";
import s from "./Navbar.module.scss";
import logo from "../../assets/datasintensa.jpeg";

const NavBar = () => (
  <div className={s.wrapper}>
    <div className={s.container}>
      <img src={logo}/>
      <a href="/">Interview Test Datasintesa</a>
      {/* <a href="/map">Map</a>/ */}
    </div>
  </div>
)

export default memo(NavBar);
