"use client";

import React from "react";
import styles from "./footer.module.css";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div>
      <p>©2023 StarHire. All rights reserved</p>
      </div>
      <Link className={styles.reportIssue} href="/ticketManagement">Need Help?</Link>
    </div>
  );
};

export default Footer;
