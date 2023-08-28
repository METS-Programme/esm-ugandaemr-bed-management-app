import React from "react";
import { Form } from "@carbon/react";
import styles from "./bed-adminstration-table.scss";

interface BedFormProps {
  closePanel: () => void;
}

const BedForm: React.FC<BedFormProps> = () => {
  return (
    <Form className={styles.form}>
      <h1>Bed Adminstration Form</h1>
    </Form>
  );
};

export default BedForm;
