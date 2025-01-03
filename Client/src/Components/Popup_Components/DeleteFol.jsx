import React, { useEffect, useState } from "react";
import styles from "../Popup_Components/DeleteFol.module.css";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../../constants";

function DeleteFol({ Mode, setdelFolderpopup, delFolderid, setdelSermsg }) {
  async function deletefolder() {
    const BASE_URL = `${API_URL}`;
    try {
      const response = await fetch(
        `${BASE_URL}/Formbot/folders/${delFolderid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data?.code === "1") {
        toast.success(data?.Fname + " " + "Folder deleted successfully");
        setTimeout(() => {
          setdelFolderpopup(false);
        }, 2000);
      } else {
        toast.error("Folder Not Deleted");
      }
      setdelSermsg(data);
    } catch (error) {
      toast.error("Server Error");
    }
  }

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
        <h1 className={styles.headings}>
          Are you sure you want to delete this Folder ?
        </h1>
        <div className={styles.errsection}></div>
        <div className={styles.popupbtns}>
          <button onClick={deletefolder}>Confirm</button>
          <h1 className={styles.line}>|</h1>
          <button
            style={{ color: Mode === "dark" ? "white" : "rgb(0, 0, 0)" }}
            onClick={() => setdelFolderpopup(false)}
          >
            Cancle
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

export default DeleteFol;
