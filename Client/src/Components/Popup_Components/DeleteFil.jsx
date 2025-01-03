import React from "react";
import styles from "../Popup_Components/DeleteFil.module.css";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../../constants";

function DeleteFil({
  Mode,
  setdelFilepopup,
  delFileid,
  selFolderid,
  setdelSermsg,
  folderdetails,
}) {
  const BASE_URL = `${API_URL}`;
  async function deletefile() {
    try {
      const response = await fetch(
        `${BASE_URL}/Formbot/deletefile/${delFileid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);

      if (data.code === "1") {
        toast.success(data?.formname + " " + "Form deleted successfully");
        setTimeout(() => {
          setdelFilepopup(false);
        }, 2000);
        if (selFolderid !== "0") {
          folderdetails(selFolderid);
        } else if (selFolderid === "0") {
          setdelSermsg(data);
        }
      } else {
        toast.error("File Not Deleted");
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
        <h1 className={styles.headings}>
          Are you sure you want to delete this Form ?
        </h1>
        <div className={styles.errsection}></div>
        <div className={styles.popupbtns}>
          <button onClick={deletefile}>Confirm</button>
          <h1 className={styles.line}>|</h1>
          <button
            style={{ color: Mode === "dark" ? "white" : "rgb(0, 0, 0)" }}
            onClick={() => setdelFilepopup(false)}
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

export default DeleteFil;
