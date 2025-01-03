import React from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img className={styles.logoimg} src="./Images/Logo.png" alt="" />
          <span className={styles.logoname}>FormBot</span>
        </div>
        <div className={styles.navbtns}>
          <button className={styles.signIn} onClick={() => navigate("/login")}>
            Sign in
          </button>
          <button
            className={styles.createBot}
            onClick={() => navigate("/login")}
          >
            Create a FormBot
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <img className={styles.leftdesign} src="./Images/Leftdesign.png" />
        <h1 className={styles.heading}>Build advanced chatbots visually</h1>
        <p className={styles.description}>
          Typebot gives you powerful blocks to create unique chat experiences.
          Embed them anywhere on your web/mobile apps and start collecting
          results like magic.
        </p>
        <button className={styles.ctaButton} onClick={() => navigate("/login")}>
          Create a FormBot for free
        </button>
        <img className={styles.rightdesign} src="./Images/Rightdesign.png" />
      </header>

      {/* Flow Diagram Section */}
      <section className={styles.flowDiagram}>
        <div className={styles.leftbackgroup}></div>
        <div className={styles.rightbackgroup}></div>
        <img
          src="./Images/flowchart.png"
          alt="Flow Diagram"
          className={styles.flowImage}
        />
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerColumn}>
          <div className={styles.companyinfo}>
            <img src="./Images/Logo.png" alt="" srcset="" />
            <span>FormBot</span>
          </div>
          <p>
            Made with ❤️ by{" "}
            <a target="_blank" href="https://cuvette.tech/">
              {" "}
              @cuvette
            </a>
          </p>
        </div>
        <div className={styles.footerColumn}>
          <h4>Product</h4>
          <ul>
            <li>
              <a>Status</a>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </li>
            <li>
              <a>Documentation </a>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </li>
            <li>
              <a>Roadmap</a>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </li>
            <li>
              <a>Pricing</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h4>Community</h4>
          <ul>
            <li>
              <a>Discord</a>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </li>
            <li>
              <a>GitHub repository </a>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </li>
            <li>
              <a>Twitter</a>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </li>
            <li>
              <a>LinkedIn</a>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </li>
            <li>
              <a>OSS Friends</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h4>Company</h4>
          <ul>
            <li>
              <a>About</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
            <li>
              <a>Terms of Service</a>
            </li>
            <li>
              <a>Privacy Policy</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Home;
