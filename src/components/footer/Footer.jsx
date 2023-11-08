"use client";

import React, { useEffect, useState } from "react";
import styles from "./footer.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getCorporateByUserID } from "@/app/api/payment/route";

const Footer = () => {
  const session = useSession();

  let roleRef, sessionTokenRef, userIdRef;
  const [corporate, setCorporate] = useState(null);
  const [status, setStatus] = useState(null);

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  useEffect(() => {
    if (roleRef === "Corporate") {
      getCorporateByUserID(userIdRef, sessionTokenRef)
        .then((data) => {
          setCorporate(data);
          setStatus(data.corporatePromotionStatus);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [userIdRef, sessionTokenRef, roleRef]);

  return (
    <div className={styles.container}>
      <div>
        <p>©2023 StarHire. All rights reserved</p>
      </div>
      {roleRef === "Corporate" && status === "Regular" ? (
        <Link className={styles.tryPremium} href="/payment">
          Become Premium?
        </Link>
      ) : roleRef === "Corporate" && status === "Premium" ? (
        <Link className={styles.premium} href="/payment">
          Premium Member
        </Link>
      ) : (
        <></>
      )}
      <Link className={styles.reportIssue} href="/ticketManagement">
        Need Help?
      </Link>
    </div>
  );
};

export default Footer;
