import React, { useEffect, useState } from "react";
import styles from "../Forms_Components/Createform.module.css";
import toast, { Toaster } from "react-hot-toast";
import Details from "./Details";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faPhone,
  faFlagCheckered,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
  faMessage,
  faImage,
  faCalendar,
  faStar,
  faSquareCheck,
} from "@fortawesome/free-regular-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL, CLIENT_URL } from "../../constants";

function Createform() {
  const [Mode, setMode] = useState("dark");
  const [fields, setfields] = useState([]);
  const [Btextcount, setBtextcount] = useState(1);
  const [Imagecount, setImagecount] = useState(1);
  const [Itextcount, setItextcount] = useState(1);
  const [Numbercount, setNumbercount] = useState(1);
  const [Emailcount, setEmailcount] = useState(1);
  const [Phonecount, setPhonecount] = useState(1);
  const [Datecount, setDatecount] = useState(1);
  const [activeView, setActiveView] = useState("flow");
  const [Ratingcount, setRatingcount] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = `${API_URL}`;
  const formid = location.state?.id;
  const formname = location.state?.formname;

  let link = `${CLIENT_URL}/response/${formid}`;

  function share() {
    if (fields.length === 0) {
      toast.error("Please, Add fields and save");
    } else {
      Update();
      window.navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
    }
  }

  function toggleBackground() {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function Addfield(value) {
    if (fields.some((item) => item.heading === "Submit Button")) {
      return toast("Remove Submit Button to add fields");
    }
    setfields((prevfields) => [...prevfields, value]);
  }

  function deletefield(index) {
    setfields(fields.filter((item) => item !== index));
  }

  async function fetchingfields() {
    try {
      const response = await fetch(`${BASE_URL}/Formbot/getfields/${formid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data?.code === "1") {
        setfields(data?.fields?.fields);
        toast.success("You can add/edit fields now");
      } else {
        toast("Please select the form to edit");
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      toast.error("Error updating form fields:", error.message);
    }
  }

  useEffect(() => {
    fetchingfields();
  }, []);

  async function Update() {
    if (!fields.some((item) => item.heading === "Submit Button")) {
      return toast("Please Add Submit button before Saving");
    } else if (fields.length === 0) {
      return toast("Please Add fields to save");
    } else {
      try {
        const response = await fetch(
          `${BASE_URL}/Formbot/updatefields/${formid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: fields,
            }),
          }
        );
        const data = await response.json();
        if (data?.code === "1") {
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        toast.error("Error updating form fields:", error.message);
      }
    }
  }

  const buttonStyle = {
    backgroundColor: Mode === "dark" ? "rgba(24, 24, 27, 1)" : "white",
    color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)",
    border: Mode === "dark" ? "2px solid  #383636" : "2px solid #d4c5c5",
  };
  return (
    <>
      <div
        className={styles.home}
        style={{
          backgroundColor: Mode === "dark" ? "rgba(31, 31, 35, 1)" : "white",
          color: Mode === "dark" ? "white" : "rgba(31, 31, 35, 1)",
        }}
      >
        <nav
          className={styles.header}
          style={{
            backgroundColor: Mode === "dark" ? "rgba(24, 24, 27, 1)" : "white",
            color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)",
            borderBottom:
              Mode === "dark" ? "2px solid  #383636" : "2px solid #d4c5c5",
          }}
        >
          <input
            type="text"
            placeholder={formname}
            className={styles.formNameInput}
            style={{
              backgroundColor:
                Mode === "dark" ? "rgba(55, 55, 62, 1)" : "white",
              color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)",
              border:
                Mode === "dark" ? "2px solid #383636" : "2px solid #d4c5c5",
            }}
          />
          <div className={styles.navmidbtns}>
            <button
              className={
                activeView === "flow" ? styles.midbtn1 : styles.midbtn2
              }
              onClick={() => setActiveView("flow")}
            >
              Flow
            </button>
            <button
              className={
                activeView === "response" ? styles.midbtn1 : styles.midbtn2
              }
              onClick={() => setActiveView("response")}
            >
              Response
            </button>
          </div>
          <div className={styles.LDmode}>
            <span>Light</span>
            <div className={styles.LDbtn}>
              <button
                className={styles.LBtoggel}
                onClick={toggleBackground}
                style={{ marginLeft: Mode === "dark" ? "2.4em" : "0.3em" }}
              ></button>
            </div>
            <span>Dark</span>
          </div>
          <div className={styles.endbtn}>
            <button className={styles.actionButton1} onClick={share}>
              Share
            </button>
            <button className={styles.actionButton} onClick={Update}>
              Save
            </button>
            <button className={styles.closeButton} onClick={() => navigate(-1)}>
              ✖
            </button>
          </div>
        </nav>

        {activeView === "flow" ? (
          <div className={styles.content}>
            <div
              className={styles.sidebar}
              style={{
                backgroundColor:
                  Mode === "dark" ? "rgba(24, 24, 27, 1)" : "white",
                color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)",
                border:
                  Mode === "dark" ? "2px solid  #383636" : "2px solid #d4c5c5",
              }}
            >
              {/* -------------------------- Bubbles ----------------------      */}
              <h3>Bubbles</h3>
              <button
                className={styles.bubbleButton}
                style={buttonStyle}
                onClick={() => {
                  Addfield({
                    heading: `Input Text ${Btextcount}`,
                    type: "b",
                    Data: "",
                    style: "btext",
                  });
                  setBtextcount((prev) => prev + 1);
                }}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faMessage}
                  style={{ color: "#4b83ff" }}
                />{" "}
                &nbsp; Text
              </button>
              <button
                className={styles.bubbleButton}
                style={buttonStyle}
                onClick={() => {
                  Addfield({
                    heading: `Input Image ${Imagecount}`,
                    type: "b",
                    Data: "",
                    style: "image",
                  });
                  setImagecount((prev) => prev + 1);
                }}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faImage}
                  style={{ color: "#4b83ff" }}
                />{" "}
                &nbsp; Image
              </button>
              <button
                className={styles.bubbleButton}
                style={buttonStyle}
                onClick={() =>
                  toast.error("Sorry, This feature is not available")
                }
              >
                {" "}
                <FontAwesomeIcon
                  icon={faFilm}
                  style={{ color: "#4b83ff" }}
                />{" "}
                &nbsp; Video
              </button>
              <button
                className={styles.bubbleButton}
                style={buttonStyle}
                onClick={() =>
                  toast.error("Sorry, This feature is not available")
                }
              >
                {" "}
                <span style={{ color: "#4b83ff", fontFamily: "Tiny5" }}>
                  GIF
                </span>{" "}
                GIF
              </button>
              {/* -------------------------------- Inputs ------------------------------  */}
              <h3>Inputs</h3>
              <button
                className={styles.inputButton}
                style={buttonStyle}
                onClick={() => {
                  Addfield({
                    heading: `Input Text ${Itextcount}`,
                    type: "i",
                    Data: "",
                    style: "itext",
                  });
                  setItextcount((prev) => prev + 1);
                }}
              >
                {" "}
                <span
                  style={{
                    color: "#FFA54C",
                    fontFamily: "Merriweather",
                    fontSize: "18px",
                  }}
                >
                  T
                </span>{" "}
                &nbsp; Text
              </button>
              <button
                className={styles.inputButton}
                style={buttonStyle}
                onClick={() => {
                  Addfield({
                    heading: `Input Number ${Numbercount}`,
                    type: "i",
                    Data: "",
                    style: "Number",
                  });
                  setNumbercount((prev) => prev + 1);
                }}
              >
                {" "}
                <span
                  style={{
                    color: "#FFA54C",

                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  #
                </span>
                &nbsp; Number
              </button>
              <button
                className={styles.inputButton}
                style={buttonStyle}
                onClick={() => {
                  Addfield({
                    heading: `Input Email ${Emailcount}`,
                    type: "i",
                    Data: "",
                    style: "email",
                  });
                  setEmailcount((prev) => prev + 1);
                }}
              >
                {" "}
                <span
                  style={{
                    color: "#FFA54C",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  @
                </span>
                &nbsp; Email
              </button>
              <button
                className={styles.inputButton}
                style={buttonStyle}
                onClick={() => {
                  Addfield({
                    heading: `Input Phone ${Phonecount}`,
                    type: "i",
                    Data: "",
                    style: "Phone",
                  });
                  setPhonecount((prev) => prev + 1);
                }}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{
                    color: "#FFA54C",
                    fontSize: "18px",
                  }}
                />{" "}
                &nbsp;Phone
              </button>
              <button
                className={styles.inputButton}
                style={buttonStyle}
                onClick={() => {
                  Addfield({
                    heading: `Input Date ${Datecount}`,
                    type: "i",
                    Data: "",
                    style: "date",
                  });
                  setDatecount((prev) => prev + 1);
                }}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faCalendar}
                  style={{
                    color: "#FFA54C",
                    fontSize: "18px",
                  }}
                />
                &nbsp; Date
              </button>
              <button
                className={styles.inputButton}
                style={buttonStyle}
                onClick={() => {
                  Addfield({
                    heading: `Input Rating ${Ratingcount}`,
                    type: "i",
                    Data: "",
                    style: "rating",
                  });
                  setRatingcount((prev) => prev + 1);
                }}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faStar}
                  style={{
                    color: "#FFA54C",
                    fontSize: "18px",
                  }}
                />
                &nbsp; Rating
              </button>
              <button
                className={styles.inputButton}
                style={buttonStyle}
                onClick={() => {
                  Addfield({
                    heading: "Submit Button",
                    type: "s",
                    Data: "",
                    style: "submit",
                  });
                }}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faSquareCheck}
                  style={{
                    color: "#FFA54C",
                    fontSize: "18px",
                  }}
                />
                &nbsp; Buttons
              </button>
            </div>

            <div className={styles.formArea}>
              <div
                className={styles.startBubble}
                style={{
                  backgroundColor: Mode === "dark" ? "#18181B" : "white",
                  color: Mode === "dark" ? "white" : "#18181B",
                  border:
                    Mode === "dark" ? "1px solid #383636" : "1px solid #d4c5c5",
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faFlagCheckered} />
                  &nbsp; Start
                </span>
              </div>

              {fields?.map((item, index) => (
                <div
                  key={index}
                  className={styles.inputBlock}
                  style={{
                    backgroundColor: Mode === "dark" ? "#18181B" : "white",
                    color: Mode === "dark" ? "white" : "#18181B",
                    border:
                      Mode === "dark"
                        ? "1px solid #383636"
                        : "1px solid #d4c5c5",
                  }}
                >
                  <div className={styles.inputHeader}>
                    <span className={styles.heading}>{item.heading}</span>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deletefield(item)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                  {item.type === "b" ? (
                    <input
                      className={styles.inputField}
                      placeholder="Enter text here"
                      value={item.Data}
                      onChange={(e) =>
                        setfields((prevFields) =>
                          prevFields.map((field, i) =>
                            i === index
                              ? { ...field, Data: e.target.value }
                              : field
                          )
                        )
                      }
                      style={{
                        backgroundColor: Mode === "dark" ? "#18181B" : "white",
                        color: Mode === "dark" ? "white" : "#18181B",
                        border:
                          Mode === "dark"
                            ? "1px solid #383636"
                            : "2px solid #d4c5c5",
                      }}
                    />
                  ) : (
                    <p className={styles.hint}>
                      Hint : User will input a text on his form
                    </p>
                  )}
                  <span className={styles.requiredText}>
                    {item.type === "b" ? "Required Field" : " "}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Details Mode={Mode} formid={formid} />
        )}
      </div>
      <Toaster
        toastOptions={{
          style: {
            color: "#aaa",
            backgroundColor: "transparent",
            border: "2px solid #aaa",
            fontFamily: "Poppins",
            fontSize: "0.9em",
            marginLeft: "75%",
            textAlign: "center",
            fontWeight: "400",
            marginTop: "42em",
          },
        }}
      />
    </>
  );
}

export default Createform;
