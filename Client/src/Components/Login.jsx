import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../constants";

function Login() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [emailErr, setemailErr] = useState("");
  const [passwordErr, setpasswordErr] = useState("");
  const [SerMsg, setSerMsg] = useState();
  const BASE_URL = `${API_URL}`;

  const handleLoginSuccess = () => {
    const redirectPath = localStorage.getItem("postLoginRedirect");
    if (redirectPath) {
      localStorage.removeItem("postLoginRedirect");
      navigate(redirectPath);
    } else {
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  };

  async function handlesubmit(e) {
    e.preventDefault();
    if (email.length === 0) {
      setemailErr("* Please Enter Email");
    } else if (!email.includes("@")) {
      setemailErr("* Enter Valid Email");
    } else {
      setemailErr("");
    }
    password.length === 0
      ? setpasswordErr("* Please Enter Password")
      : setpasswordErr("");

    if (email.length > 2 && password.length >= 1) {
      const responce = await fetch(`${BASE_URL}/Formbot/login`, {
        method: "POST",
        headers: { "Content-type": "application/JSON" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await responce.json();
      setSerMsg(data);
    }
  }

  useEffect(() => {
    if (SerMsg?.statuscode === "1") {
      toast.success(SerMsg?.message);
      handleLoginSuccess();
    } else if (SerMsg?.statuscode === "0") {
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
          <button className={styles.primaryButton}>Log In</button>
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
          Don’t have an account?{" "}
          <a onClick={() => navigate("/signup")}>Register now</a>
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

export default Login;
