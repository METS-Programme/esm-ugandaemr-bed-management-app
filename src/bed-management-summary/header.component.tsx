import React from "react";
import styles from "./summary.scss";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  return (
    <header className={styles.pageHeaderContainer}>
      <h1 className={styles.pageHeader}>{t("headTitle", `${title}`)}</h1>
    </header>
  );
};

export default Header;
