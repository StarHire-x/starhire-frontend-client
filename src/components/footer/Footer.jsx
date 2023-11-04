"use client";

import React from "react";
import styles from "./footer.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Footer = () => {
  const session = useSession();

  let roleRef, sessionTokenRef, userIdRef;

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  return (
    <div className={styles.container}>
      <div>
        <p>©2023 StarHire. All rights reserved</p>
      </div>
      {roleRef === "Corporate" && (
        <Link className={styles.tryPremium} href="/payment">
          Become Premium?
        </Link>
      )}
      <Link className={styles.reportIssue} href="/ticketManagement">
        Need Help?
      </Link>
    </div>
  );
};

export default Footer;
