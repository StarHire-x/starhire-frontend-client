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
      <Link className={styles.tryPremium} href="/payment">Become Premium?</Link>
      <Link className={styles.reportIssue} href="/ticketManagement">Need Help?</Link>
      {/* <div>
          {session.status === 'authenticated' &&
            session.data.user.role === Enums.CORPORATE &&
            (status === 'Premium' ? (
              <Link href="/payment" passHref>
                <Button
                  className={styles.premiumButton}
                  size='small'
                >
                  Premium
                </Button>
              </Link>
            ) : (
              <Link href="/payment" passHref>
                <Button
                  className={styles.tryPremiumButton}
                >
                  Become Premium?
                </Button>
              </Link>
            ))}
        </div> */}
    </div>
  );
};

export default Footer;
