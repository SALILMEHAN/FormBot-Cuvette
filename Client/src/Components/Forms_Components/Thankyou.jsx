import React from "react";
import styles from "../Forms_Components/Thankyou.module.css";
import { useLocation } from "react-router";

function Thankyou() {
  const location = useLocation();
  const name = location.state?.username;
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <div className={styles.checkmark}>
          <img src="Images/bluetick.png" alt="" className={styles.icon} />
        </div>
        <h1 className={styles.title}>Thank You!</h1>
        <p className={styles.username}>{name || "Dear User"}</p>
        <p className={styles.message}>
          We have received your submission successfully.
        </p>
      </div>
    </div>
  );
}

export default Thankyou;
