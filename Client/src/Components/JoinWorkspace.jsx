import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./JoinWorkspace.module.css";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../constants";

function JoinWorkspace() {
  const { workspaceId, accesslevel } = useParams();
  const navigate = useNavigate();
  const BASE_URL = `${API_URL}`;
  const currentPath = window.location.pathname;

  useEffect(() => {
    const checkAuthAndJoin = async () => {
      try {
        const authCheckResponse = await fetch(
          `${BASE_URL}/Formbot/check-auth`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const authData = await authCheckResponse.json();
        if (authData?.code === "0") {
          localStorage.setItem("postLoginRedirect", currentPath);
          navigate("/login");
          return;
        } else {
          const joinResponse = await fetch(
            `${BASE_URL}/Formbot/workspaces/join/${workspaceId}/${accesslevel}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          const joinData = await joinResponse.json();
          if (joinData?.code === "1") {
            toast.success(joinData?.message);
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          } else {
            toast.error(joinData?.message);
            navigate("/dashboard");
          }
        }
      } catch (error) {
        toast.error("Failed to join workspace");
      }
    };
    checkAuthAndJoin();
  }, [workspaceId, accesslevel, navigate]);

  return (
    <div className={styles.container}>
      <span className={styles.heading}>
        <img src="/Images/Logo.png" alt="icon" />
        <h1>FormBot</h1>
      </span>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Processing your request...</p>
      <Toaster
        toastOptions={{
          style: {
            color: "#555",
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

export default JoinWorkspace;
