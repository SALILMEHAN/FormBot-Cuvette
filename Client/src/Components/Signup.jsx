import React, { useState, useEffect } from "react";
import styles from "./Signup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../constants";

function Signup() {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [compassword, setcompassword] = useState("");
  const [SerMsg, setSerMsg] = useState();
  const [usernameErr, setusernameErr] = useState("");
  const [emailErr, setemailErr] = useState("");
  const [passwordErr, setpasswordErr] = useState("");
  const [compasswordErr, setcompasswordErr] = useState("");
  const BASE_URL = `${API_URL}`;

  async function handlesubmit(e) {
    e.preventDefault();
    if (email.length === 0) {
      setemailErr("* Please Enter Email");
    } else if (!email.includes("@") || email.length < 3) {
      setemailErr("* Enter Valid Email");
    } else {
      setemailErr("");
    }
    if (compassword.length === 0) {
      setcompasswordErr("* Please Confirm Email");
    } else if (password !== compassword) {
      setcompasswordErr("* Password Didn't Match");
    } else {
      setcompasswordErr("");
    }
    password.length === 0
      ? setpasswordErr("* Please Enter Password")
      : setpasswordErr("");
    name.length === 0
      ? setusernameErr("* Please Enter UserName")
      : setusernameErr("");

    if (
      name.length >= 1 &&
      email.length >= 3 &&
      password.length >= 0 &&
      password === compassword
    ) {
      const responce = await fetch(`${BASE_URL}/Formbot/signup`, {
        method: "POST",
        headers: { "Content-type": "application/JSON" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await responce.json();
      setSerMsg(data);
    }
  }

  useEffect(() => {
    if (SerMsg?.code === "1") {
      setemail("");
      setname("");
      setcompassword("");
      setpassword("");
      toast.success(SerMsg?.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else if (SerMsg?.code === "0") {
      toast.error(SerMsg?.message);
    }
  }, [SerMsg]);

  return (
    <div className={styles.container}>
      <header className={styles.backArrow}>
        <span onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#ffffff" }} />
        </span>
      </header>
      <div className={styles.loginForm}>
        <form className={styles.form} onSubmit={handlesubmit}>
          <label htmlFor="Username" className={styles.label}>
            Username
          </label>
          <div className={styles.usernamediv}>
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Enter your Username"
              className={styles.usernameinput}
            />
            <p className={styles.usernameerr}>{usernameErr}</p>
          </div>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <div className={styles.emaildiv}>
            <input
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Enter your email"
              className={styles.emailinput}
            />
            <p className={styles.emailerr}>{emailErr}</p>
          </div>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div className={styles.passworddiv}>
            <input
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Enter Password"
              className={styles.passwordinput}
            />
            <p className={styles.passworderr}>{passwordErr}</p>
          </div>
          <label htmlFor="email" className={styles.ComPasslabel}>
            Confirm Password
          </label>
          <div className={styles.ComPassworddiv}>
            <input
              type="password"
              value={compassword}
              onChange={(e) => setcompassword(e.target.value)}
              placeholder="Confirm Entered Password"
              className={styles.ComPasswordinput}
            />
            <p className={styles.ComPasserr}>{compasswordErr}</p>
          </div>
          <button type="submit" className={styles.primaryButton}>
            Sign Up
          </button>
          <p className={styles.or}>OR</p>
          <p className={styles.googleButton}>
            <img
              src="./Images/googleicon.png"
              alt="Google Icon"
              className={styles.googleIcon}
            />
            Sign In with Google
          </p>
        </form>
        <p className={styles.register}>
          Already have an account ?
          <a onClick={() => navigate("/login")}>Login</a>
        </p>
      </div>
      <img src="./Images/logindesign.png" className={styles.leftDesign} />
      <img src="./Images/EllipseB.png" className={styles.rightDesign} />
      <img src="./Images/EllipseA.png" className={styles.bottomDesign} />
      <Toaster
        toastOptions={{
          style: {
            color: "#aaa",
            backgroundColor: "transparent",
            border: "2px solid #aaa",
            fontFamily: "Poppins",
            fontSize: "0.9em",
            fontWeight: "400",
            marginLeft: "3.5em",
          },
        }}
      />
    </div>
  );
}

export default Signup;
