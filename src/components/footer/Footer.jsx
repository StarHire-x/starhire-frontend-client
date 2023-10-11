"use client";

import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Footer = () => {
  /*
  const session = useSession();
  let roleRef, sessionTokenRef, userIdRef;

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  return (
    <div className={styles.container}>
      <p>©2023 StarHire. All rights reserved</p>
      {session?.status === "authenticated" ? (
        <p className={styles.reportIssue}>
          <a href="ticketManagement">Report an Issue</a>
        </p>
      ) : null}
    </div>
  );
};
*/
  return (
    <div className={styles.container}>
      <p>©2023 StarHire. All rights reserved</p>
        <p className={styles.reportIssue}>
          <a href="/ticketManagement">Help Center</a>
        </p>
    </div>
  );
};

export default Footer;
