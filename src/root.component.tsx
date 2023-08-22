import React from "react";
import logo from "./assets/images/logo.svg";
import styles from "./root.scss";

const Root: React.FC = () => {
  return (
    <div className={styles.container}>
      <img alt="Uganda EMR logo" src={logo} width={300} height={200} />
      <h1 className={styles.heading}>Welcome to the template app</h1>
      <h2 className={styles.explainer}>
        Use this template as a starter for set up custom UgandaEMR frontend
        modules.
      </h2>
      <div className={styles.section}>
        <p className={styles.subheading}>Next steps</p>

        <ul className={styles.list}>
          <li>
            - Add components to the <b>src</b> directory.
          </li>
          <li>
            - Read the{" "}
            <a href="https://o3-docs.openmrs.org/docs/frontend-modules/overview">
              frontend modules
            </a>{" "}
            and the{" "}
            <a href="https://o3-docs.openmrs.org/docs/coding-conventions">
              coding conventions
            </a>{" "}
            guides.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Root;
