import React, { memo } from "react";
import s from "./sidebar.module.scss";

const SideBar = ({ children }) => (
  <div className={s.wrapper}>
    {children}
  </div>
);

export default memo(SideBar);
