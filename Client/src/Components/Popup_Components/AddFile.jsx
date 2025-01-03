import React, { useEffect, useState } from "react";
import styles from "../Popup_Components/Addfile.module.css";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../../constants";

function AddFile({
  Mode,
  setfilepopup,
  selFolderid,
  selectedWorkspace,
  folderdetails,
  setdelSermsg,
}) {
  const [formname, setformname] = useState("");
  const BASE_URL = `${API_URL}`;
  let fields = [];
  async function pushfile() {
    try {
      const response = await fetch(`${BASE_URL}/Formbot/addforms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formname,
          fields,
          selFolderid,
          selectedWorkspace,
        }),
      });
      const newForm = await response.json();
      if (newForm?.code === "1") {
        toast.success(
          newForm?.formdata?.formname + " " + "Form created successfully"
        );
        setTimeout(() => {
          setfilepopup(false);
        }, 2000);
        if (selFolderid !== "0") {
          folderdetails(selFolderid);
        } else if (selFolderid === "0") {
          setdelSermsg(newForm);
        }
      } else {
        toast.error(newForm?.message);
      }
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
        <h1 className={styles.headings}>Create New File</h1>
        <input
          type="text"
          value={formname}
          onChange={(e) => setformname(e.target.value)}
          className={styles.input}
          placeholder="Enter file name"
          style={{
            backgroundColor: Mode === "dark" ? "rgb(36, 36, 38)" : "#d4c5c5",
            color: Mode === "dark" ? "white" : "rgb(0, 0, 0)",
          }}
        />
        <div className={styles.popupbtns}>
          <button onClick={pushfile}>Done</button>
          <h1 className={styles.line}>|</h1>
          <button
            style={{ color: Mode === "dark" ? "white" : "rgb(0, 0, 0)" }}
            onClick={() => setfilepopup(false)}
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

export default AddFile;
