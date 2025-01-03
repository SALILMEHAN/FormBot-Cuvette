import React, { useState } from "react";
import styles from "../Dashboard_Components/Setting.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEye,
  faLock,
  faEyeSlash,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { API_URL } from "../../constants";

function Setting() {
  const [showemail, setShowemail] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [Updatedname, setUpdatedname] = useState("");
  const [Updatedemail, setUpdatedemail] = useState("");
  const [Updatedpassword, setUpdatedpassword] = useState("");
  const [oldpassword, setoldpassword] = useState("");
  const [err, seterr] = useState("");
  const BASE_URL = `${API_URL}`;
  const navigate = useNavigate();

  async function logout() {
    if (confirm("Want to Logout??")) {
      const responce = await fetch(`${BASE_URL}/Formbot/logout`, {
        method: "POST",
        headers: { "Content-type": "application/JSON" },
        credentials: "include",
      });
      const update = await responce.json();
      if (update?.code === "1") {
        toast.success(update?.message);
        localStorage.clear();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } else {
      navigate(1);
    }
  }

  async function handlesubmit(e) {
    e.preventDefault();
    if (oldpassword.length !== 0 && Updatedpassword.length === 0) {
      seterr("*Enter New Password");
    } else {
      seterr("");
      const response = await fetch(`${BASE_URL}/Formbot/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Updatedname: Updatedname || undefined,
          Updatedemail: Updatedemail || undefined,
          oldpassword: oldpassword || undefined,
          Updatedpassword: Updatedpassword || undefined,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (data?.code === "1" && data?.updateType === "1") {
        toast.success(data?.message);
      } else if (data?.code === "1" && data?.updateType === "2") {
        toast.success(data?.message);
        setTimeout(() => {
          toast("⚠️Email/Password Updated, Relogin Required");
        }, 2000);
      } else {
        toast.error(data?.message);
      }
    }
  }

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Settings</h1>
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faUser} className={styles.icon} />
          <input
            type="text"
            placeholder="Name"
            className={styles.input}
            value={Updatedname}
            onChange={(e) => setUpdatedname(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input
            type={showemail ? "text" : "password"}
            placeholder="Update Email"
            className={styles.input}
            value={Updatedemail}
            onChange={(e) => setUpdatedemail(e.target.value)}
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowemail(!showemail)}
          >
            {showemail ? (
              <FontAwesomeIcon icon={faEyeSlash} />
            ) : (
              <FontAwesomeIcon icon={faEye} />
            )}
          </button>
        </div>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            className={styles.input}
            value={oldpassword}
            onChange={(e) => setoldpassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? (
              <FontAwesomeIcon icon={faEyeSlash} />
            ) : (
              <FontAwesomeIcon icon={faEye} />
            )}
          </button>
        </div>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className={styles.input}
            value={Updatedpassword}
            onChange={(e) => setUpdatedpassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <FontAwesomeIcon icon={faEyeSlash} />
            ) : (
              <FontAwesomeIcon icon={faEye} />
            )}
          </button>
        </div>
        <p className={styles.error}>{err}</p>
        <button className={styles.updateButton} onClick={handlesubmit}>
          Update
        </button>
      </form>
      <button className={styles.logoutButton} onClick={logout}>
        {" "}
        <FontAwesomeIcon icon={faArrowRightFromBracket} /> &nbsp; Log out
      </button>
      <Toaster
        toastOptions={{
          style: {
            color: "#aaa",
            backgroundColor: "transparent",
            border: "2px solid #aaa",
            fontFamily: "Poppins",
            fontSize: "0.9em",
            fontWeight: "400",
            marginTop: "42em",
          },
        }}
      />
    </div>
  );
}

export default Setting;
