import React from "react";
import styles from "../Forms_Components/Userdetailspopup.module.css";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../../constants";

function Userdetailspopup({ setUser, setShowPopup, formid }) {
  const BASE_URL = `${API_URL}`;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    if (!name || !email) {
      toast.error("Please fill in the details");
      return;
    }
    setUser({ name, email });
    try {
      const response = await fetch(
        `${BASE_URL}/Formbot/increment-start/${formid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowPopup(false);
    } catch (error) {
      toast.error("Error starting form. Please try again.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Enter Your Details</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Start Filling Form
          </button>
        </form>
      </div>

      <Toaster
        toastOptions={{
          style: {
            color: "#aaa",
            backgroundColor: "white",
            border: "2px solid #aaa",
            fontFamily: "Poppins",
            fontSize: "0.9em",
            fontWeight: "400",
            marginLeft: "1em",
          },
        }}
      />
    </div>
  );
}

export default Userdetailspopup;
