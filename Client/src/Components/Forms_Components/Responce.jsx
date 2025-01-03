import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router";
import styles from "../Forms_Components/Responce.module.css";
import toast, { Toaster } from "react-hot-toast";
import Userdetailspopup from "./Userdetailspopup";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";

function Response() {
  const [showPopup, setShowPopup] = useState(true);
  const [user, setUser] = useState({ name: "", email: "" });
  const [inputFields, setInputFields] = useState([]);
  const [updatedInputFields, setUpdatedInputFields] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const BASE_URL = `${API_URL}`;
  const { formid } = useParams();
  const navigate = useNavigate();

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/Formbot/formdata/${formid}`, {
        method: "GET",
      });
      const data = await response.json();
      setInputFields(data);
      if (response.ok) {
        toast("Start filling form");
      } else {
        toast.error("Failed to fetch form data");
      }
    } catch (error) {
      toast.error("Error fetching form data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showPopup) {
      fetchFormData();
    }
  }, [showPopup, formid]);

  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Formbot/increment-view/${formid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to increment view count");
        }
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };
    incrementViewCount();
  }, []);

  useEffect(() => {
    const checkAndAdvance = () => {
      if (
        currentIndex < inputFields.length &&
        inputFields[currentIndex]?.type === "b"
      ) {
        setCurrentIndex((prev) => Math.min(prev + 1, inputFields.length - 1));
      }
    };
    checkAndAdvance();
  }, [currentIndex, inputFields]);

  const handleSubmit = async () => {
    if (inputFields[currentIndex]?.type === "i") {
      if (!userInput) return;
      const updatedFields = [...inputFields];
      updatedFields[currentIndex] = {
        ...updatedFields[currentIndex],
        Data: userInput,
      };
      setInputFields(updatedFields);
      setUserInput("");
      setCurrentIndex((prev) => Math.min(prev + 1, inputFields.length - 1));
    } else if (inputFields[currentIndex]?.type === "s") {
      setUpdatedInputFields(inputFields);
      try {
        const response = await fetch(
          `${BASE_URL}/Formbot/submitresponse/${formid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: user,
              updatedInputFields: inputFields,
            }),
          }
        );
        const data = await response.json();
        if (data?.code === "1") {
          setTimeout(() => {
            navigate("/thankyou", {
              state: { username: user?.name },
            });
          }, 400);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        toast.error("Failed to submit form. Please try again.");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (
      e.key === "Enter" &&
      inputFields[currentIndex]?.type === "i" &&
      inputFields[currentIndex]?.style !== "rating"
    ) {
      handleSubmit();
    }
  };

  const renderInput = () => {
    const currentField = inputFields[currentIndex];
    if (!currentField || currentField.type !== "i") return null;

    switch (currentField.style) {
      case "rating":
        return (
          <div className={styles.ratingWrapper}>
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className={styles.ratingLabel}>
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  onChange={(e) => setUserInput(e.target.value)}
                  checked={userInput === value.toString()}
                  className={styles.ratingInput}
                />
                <span className={styles.ratingCircle}>{value}</span>
              </label>
            ))}
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={styles.input}
          />
        );
      default:
        return (
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response here..."
            className={styles.input}
          />
        );
    }
  };

  if (showPopup) {
    return (
      <Userdetailspopup
        setUser={setUser}
        setShowPopup={setShowPopup}
        formid={formid}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.chat}>
        {loading ? (
          <p className={styles.premsg}>
            Loading, Please wait.. &nbsp;
            <FontAwesomeIcon icon={faCircleNotch} spin />
          </p>
        ) : inputFields.length === 0 ? (
          <p className={styles.premsg}>No folders</p>
        ) : (
          inputFields.slice(0, currentIndex + 1).map((item, index) => (
            <React.Fragment key={index}>
              {item.type === "b" && (
                <div className={styles.questions}>
                  <img src="/Images/message.png" className={styles.usericon} />
                  {item.style === "image" ? (
                    <img src={item.Data} alt="gif" className={styles.gif} />
                  ) : (
                    <span className={styles.que}>{item.Data}</span>
                  )}
                </div>
              )}
              {item.type === "i" && item.Data && (
                <div className={styles.answers}>
                  <span className={styles.ans}>{item.Data}</span>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {!loading && currentIndex < inputFields.length && (
        <div className={styles.inputWrapper}>
          {inputFields[currentIndex]?.type === "i" ? (
            <>
              {renderInput()}
              <button
                className={styles.button}
                onClick={handleSubmit}
                disabled={!userInput}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </>
          ) : (
            inputFields[currentIndex]?.type === "s" && (
              <button
                className={`${styles.button} ${styles.submitButton}`}
                onClick={handleSubmit}
              >
                Submit Form
              </button>
            )
          )}
        </div>
      )}

      <Toaster
        toastOptions={{
          style: {
            color: "#aaa",
            backgroundColor: "transparent",
            border: "2px solid #aaa",
            fontFamily: "Poppins",
            fontSize: "0.9em",
            fontWeight: "400",
            marginLeft: "1.5em",
          },
        }}
      />
    </div>
  );
}

export default Response;
