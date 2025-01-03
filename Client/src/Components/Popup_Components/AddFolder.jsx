import React, { useEffect, useState } from "react";
import styles from "../Popup_Components/AddFolder.module.css";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../../constants";

function AddFolder({ Mode, setfolderpopup, selectedWorkspace, setfolmsg }) {
  const [foldername, setfoldername] = useState("");
  const [nameerr, setnameerr] = useState("");
  const [serMsg, setserMsg] = useState("");
  const BASE_URL = `${API_URL}`;

  async function pushhfolder() {
    foldername.length < 1
      ? setnameerr("Please enter folder name")
      : setnameerr(" ");
    if (foldername.length >= 1) {
      try {
        const response = await fetch(`${BASE_URL}/Formbot/folders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            foldername,
            selectedWorkspace,
          }),
        });
        const data = await response.json();
        if (data?.code === "1") {
          toast.success(foldername + " " + "Folder Created successfully");
          setfolmsg("added");
        } else if (data?.code === "2") {
          toast.error("Folder already exist");
        } else {
          toast.error("Folder not created");
        }
        setserMsg(data);
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    }
  }

  useEffect(() => {
    if (serMsg?.code === "1") {
      setfoldername("");
      setTimeout(() => {
        setfolderpopup(false);
      }, 2000);
    }
  }, [serMsg]);

  return (
    <>
      <section
        className={styles.popupdiv}
        style={{
          backgroundColor: Mode === "dark" ? "rgba(24, 24, 27, 1)" : "white",
          color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)",
          boxShadow:
            Mode === "dark"
              ? "0px 0px 5.8px 0px rgba(255, 255, 255, 0.25)"
              : "0px 0px 5.8px 0px rgb(0, 0, 0)",
        }}
      >
        <h1 className={styles.headings}>Create New Folder</h1>
        <input
          type="text"
          className={styles.input}
          value={foldername}
          onChange={(e) => setfoldername(e.target.value)}
          placeholder="Enter folder name"
          style={{
            backgroundColor: Mode === "dark" ? "rgb(36, 36, 38)" : "#d4c5c5",
            color: Mode === "dark" ? "white" : "rgb(0, 0, 0)",
          }}
        />
        <div className={styles.errsection}>
          <p>{nameerr}</p>
        </div>
        <div className={styles.popupbtns}>
          <button onClick={pushhfolder}>Done</button>
          <h1 className={styles.line}>|</h1>
          <button
            style={{ color: Mode === "dark" ? "white" : "rgb(0, 0, 0)" }}
            onClick={() => setfolderpopup(false)}
          >
            Cancel
          </button>
        </div>
        <Toaster
          toastOptions={{
            style: {
              color: "#aaa",
              backgroundColor: "transparent",
              border: "2px solid #aaa",
              fontFamily: "Poppins",
              fontSize: "0.9em",
              fontWeight: "400",
              marginTop: "43em",
            },
          }}
        />
      </section>
    </>
  );
}

export default AddFolder;
