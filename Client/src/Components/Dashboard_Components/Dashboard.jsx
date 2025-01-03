import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "../Dashboard_Components/Dashboard.module.css";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faTrashCan,
  faPlus,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import AddFolder from "../Popup_Components/AddFolder";
import DeleteFol from "../Popup_Components/DeleteFol";
import DeleteFil from "../Popup_Components/DeleteFil";
import AddFile from "../Popup_Components/AddFile";
import Share from "../Popup_Components/Share";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../constants";

function Dashboard() {
  const navigate = useNavigate();
  const [Mode, setMode] = useState("dark");
  const [folderpopup, setfolderpopup] = useState(false);
  const [filepopup, setfilepopup] = useState(false);
  const [sharepopup, setsharepopup] = useState(false);
  const [delSermsg, setdelSermsg] = useState("");
  const [delFolderpopup, setdelFolderpopup] = useState(false);
  const [delFilepopup, setdelFilepopup] = useState(false);
  const [delFolderid, setdelFolderid] = useState("");
  const [delFileid, setdelFileid] = useState("");
  const [serMsg, setserMsg] = useState("");
  const [accesslevel, setaccesslevel] = useState("edit");
  const [addfolmsg, setaddfolmsg] = useState("");
  const [workspace, setWorkspace] = useState(null); // Primary workspace
  const [sharedWorkspaces, setSharedWorkspaces] = useState([]); // Shared workspaces
  const [selectedWorkspace, setSelectedWorkspace] = useState(null); // Currently selected workspace
  const [ownWorkspace, setownWokspace] = useState("");
  const [Forms, setForms] = useState("");
  const [loading, setLoading] = useState(true);
  const [selFolderid, setselFolderid] = useState("0");
  const BASE_URL = `${API_URL}`;
  const location = useLocation();

  function toggleBackground() {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
    console.log(selectedWorkspace);
  }

  async function logout() {
    if (confirm("Want to Logout??")) {
      const responce = await fetch(`${BASE_URL}/Formbot/logout`, {
        method: "POST",
        headers: { "Content-type": "application/JSON" },
        credentials: "include",
      });
      const update = await responce.json();
      if (update?.code === "1") {
        toast.success(update?.message);
        localStorage.clear();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } else {
      window.location.reload();
    }
  }
  //  --------------------------------------- Folder Details ----------------------------------
  async function folderdetails(id) {
    setselFolderid(id);
    try {
      const response = await fetch(`${BASE_URL}/Formbot/folders/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch folder data");
      }
      const data = await response.json();
      setForms(data.forms);
    } catch (error) {
      console.error("Error fetching folder data:", error);
    }
  }
  // ---------------------------------- To Fetch particular workspace data ----------------------------
  useEffect(() => {
    const fetchWorkspace = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/Formbot/workspaces/${selectedWorkspace}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch workspace: ${response.statusText}`);
        }
        const data = await response.json();
        setserMsg(data);
        setForms(data?.defaultForms);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspace();
    localStorage.setItem("Workspaceid", selectedWorkspace);
  }, [selectedWorkspace, addfolmsg, delSermsg]);

  // --------------------------------- To Fetch all workspace -----------------------------

  useEffect(() => {
    const fetchallWorkspace = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Formbot/allworkspaces`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setWorkspace(data.ownedWorkspace);
        setSharedWorkspaces(data.sharedWorkspaces);
        setSelectedWorkspace(data.ownedWorkspace?.id);
        setownWokspace(data.ownedWorkspace?.id);
        if (data?.code === "0") {
          toast.error(data?.message, {
            duration: 1000,
          });
          if (data?.message === "You Are Not Authorized") {
            setTimeout(() => {
              navigate("/login");
            }, 1100);
          }
        }
      } catch (error) {
        toast.error("Error");
      }
    };
    fetchallWorkspace();
  }, []);

  return (
    <div
      style={{
        backgroundColor: Mode === "dark" ? "rgba(24, 24, 27, 1)" : "white",
        color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)",
      }}
      className={styles.dashboard}
    >
      <nav
        style={{
          backgroundColor: Mode === "dark" ? "rgba(24, 24, 27, 1)" : "white",
          color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)",
          borderBottom:
            Mode === "dark" ? "2px solid  #383636" : "2px solid #d4c5c5",
        }}
        className={styles.navbar}
      >
        <div className={styles.navbarCenter}>
          <select
            style={{
              backgroundColor:
                Mode === "dark" ? "rgba(24, 24, 27, 1)" : "white",
              color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)",
              border:
                Mode === "dark" ? "2px solid #383636" : "2px solid #d4c5c5",
              pointerEvents:
                folderpopup ||
                  filepopup ||
                  sharepopup ||
                  delFolderpopup ||
                  delFilepopup
                  ? "none"
                  : "all",
            }}
            className={styles.navbarSelect}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "settings") {
                if (accesslevel === "edit") {
                  navigate("/setting");
                } else {
                  toast.error("You don't have access to edit workspace");
                }
              } else if (value === "logout") {
                logout();
              } else {
                if (value === workspace?.id) {
                  setSelectedWorkspace(value);
                  setaccesslevel("edit");
                } else {
                  const selectedWorkspace = sharedWorkspaces?.find(
                    (item) => item.id === value
                  );
                  if (selectedWorkspace) {
                    setSelectedWorkspace(value);
                    setaccesslevel(selectedWorkspace?.accesslevel);
                  }
                }
              }
            }}
            defaultValue={workspace?.id || ""}
          >
            <option value={workspace?.id}>
              {workspace?.name || "Loading User"}'s Workspace
            </option>
            {sharedWorkspaces?.map((item, index) => (
              <option key={index} value={item.id}>
                {item?.ownername}'s Workspace
              </option>
            ))}
            <option value="settings">Settings</option>
            <option value="logout" style={{ color: "red" }}>
              Log Out
            </option>
          </select>
        </div>
        <div className={styles.LDmode}>
          <p
            style={{ color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)" }}
          >
            Light
          </p>
          <div className={styles.LDbtn}>
            <button
              style={{ marginLeft: Mode === "dark" ? "33px" : "3px" }}
              onClick={toggleBackground}
              className={styles.LBtoggel}
            ></button>
          </div>
          <p
            style={{ color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)" }}
          >
            Dark
          </p>
        </div>
        <div className={styles.navbarRight}>
          {/* Add buttons or other items */}
          <button
            className={styles.sharebtn}
            onClick={() => {
              accesslevel === "edit"
                ? setsharepopup(true)
                : toast.error("You don't have access to edit workspace");
            }}
            style={{
              pointerEvents:
                folderpopup ||
                  filepopup ||
                  sharepopup ||
                  delFolderpopup ||
                  delFilepopup
                  ? "none"
                  : "all",
            }}
          >
            Share
          </button>
        </div>
      </nav>
      <main
        className={styles.mainsection}
        style={{
          pointerEvents:
            folderpopup ||
              filepopup ||
              sharepopup ||
              delFolderpopup ||
              delFilepopup
              ? "none"
              : "all",
        }}
      >
        {/* ----------------------- Folders -------------------------------------- */}
        <div className={styles.foldersdiv}>
          <button
            className={styles.createbtn}
            style={{
              backgroundColor: Mode === "dark" ? "#383636" : "#d4c5c5",
              color: Mode === "dark" ? "white" : "rgba(24, 24, 27, 1)",
            }}
            onClick={() =>
              accesslevel === "edit"
                ? setfolderpopup(true)
                : toast.error("You don't have access to edit workspace")
            }
          >
            <FontAwesomeIcon icon={faFolderPlus} /> &nbsp; Create a folder
          </button>
          {loading ? (
            <p className={styles.premsg}>
              Loading &nbsp; <FontAwesomeIcon icon={faCircleNotch} spin />
            </p>
          ) : serMsg?.folders?.length === 0 ? (
            <p className={styles.premsg}>No folders</p>
          ) : (
            serMsg?.folders?.map((item, index) => (
              <div
                key={index}
                onClick={() => folderdetails(item?._id)}
                className={styles.folders}
                style={{
                  backgroundColor:
                    selFolderid === item?._id
                      ? Mode === "dark"
                        ? "white"
                        : "#383636"
                      : Mode === "light"
                        ? "#d4c5c5"
                        : "#383636",
                  color:
                    selFolderid === item._id
                      ? Mode === "dark"
                        ? "black"
                        : "white"
                      : Mode === "light"
                        ? "black"
                        : "white",
                  border: selFolderid === item._id ? "2px solid white" : "none",
                }}
              >
                {item?.foldername} &nbsp;{" "}
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={styles.folderdelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item && item._id && accesslevel === "edit") {
                      setdelFolderid(item._id);
                      setdelFolderpopup(true);
                    } else {
                      toast.error("You don't have access to edit workspace");
                    }
                  }}
                />
              </div>
            ))
          )}
        </div>
        {/* ------------------------------- Files ----------------------------------- */}
        <div className={styles.filesdiv}>
          <div
            className={styles.addfile}
            onClick={() =>
              accesslevel === "edit"
                ? setfilepopup(true)
                : toast.error("You don't have access to edit workspace")
            }
          >
            <h1>
              <FontAwesomeIcon icon={faPlus} />
            </h1>
            <p>Create a Typebot</p>
          </div>
          {/* --------------- Created Files ------------- */}
          {loading ? (
            <p className={styles.premsg}>
              Loading &nbsp; <FontAwesomeIcon icon={faCircleNotch} spin />
            </p>
          ) : Forms?.length === 0 ? (
            <p className={styles.premsg}>No form </p>
          ) : (
            Forms?.map((item, index) => (
              <div
                className={styles.files}
                key={index}
                onClick={() =>
                  accesslevel === "edit"
                    ? navigate("/createform", {
                      state: { id: item?._id, formname: item?.formname },
                    })
                    : toast.error("You don't have access to edit workspace")
                }
              >
                <p>{item?.formname}</p>
                <button className={styles.filedelete} title="Delete The Form">
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item && item._id && accesslevel === "edit") {
                        setdelFileid(item._id);
                        console.log(delFileid);
                        setdelFilepopup(true);
                      } else {
                        toast.error("You don't have access to edit workspace");
                      }
                    }}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
      {folderpopup && (
        <AddFolder
          Mode={Mode}
          setfolderpopup={setfolderpopup}
          selectedWorkspace={selectedWorkspace}
          setfolmsg={setaddfolmsg}
        />
      )}
      {filepopup && (
        <AddFile
          Mode={Mode}
          setfilepopup={setfilepopup}
          selectedWorkspace={selectedWorkspace}
          selFolderid={selFolderid}
          folderdetails={folderdetails}
          setdelSermsg={setdelSermsg}
        />
      )}
      {sharepopup && (
        <Share
          Mode={Mode}
          setsharepopup={setsharepopup}
          ownWorkspace={ownWorkspace}
        />
      )}
      {delFolderpopup && (
        <DeleteFol
          Mode={Mode}
          setdelFolderpopup={setdelFolderpopup}
          delFolderid={delFolderid}
          setdelSermsg={setdelSermsg}
          selectedWorkspace={selectedWorkspace}
        />
      )}
      {delFilepopup && (
        <DeleteFil
          Mode={Mode}
          setdelFilepopup={setdelFilepopup}
          delFileid={delFileid}
          selFolderid={selFolderid}
          folderdetails={folderdetails}
          setdelSermsg={setdelSermsg}
        />
      )}
      <Toaster
        toastOptions={{
          style: {
            color: "#aaa",
            backgroundColor: "transparent",
            border: "2px solid #aaa",
            fontFamily: "Poppins",
            fontSize: "0.9em",
            textAlign: "center",
            fontWeight: "400",
            marginTop: "43em",
          },
        }}
      />
    </div>
  );
}

export default Dashboard;
