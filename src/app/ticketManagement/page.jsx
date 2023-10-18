'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

const TicketManagement = () => {
  const session = useSession();

  const isAuthenticated =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user &&
    Boolean(session.data.user.accessToken);

  const generalUrl = '/ticketManagement/createATicket?problem=general';
  const accountUrl = '/ticketManagement/createATicket?problem=account';
  const jobsUrl = '/ticketManagement/createATicket?problem=jobs';
  const eventsUrl = '/ticketManagement/createATicket?problem=events';
  const forumUrl = '/ticketManagement/createATicket?problem=forum';
  const subscriptionBillingUrl =
    '/ticketManagement/createATicket?problem=subscriptionBilling';

  return (
    <div className={styles.container}>
      <h1>Hi, we&apos;re here to help.</h1>
      <h3>Recommended topics</h3>
      <div className={styles.cardContainerStyle}>
        <div
          className={styles.individualCardStyle}
          onClick={() => (window.location.href = generalUrl)}
        >
          <div className={styles.icon}>&#x1F4AC;</div>
          <p>General</p>
        </div>

        <div
          className={styles.individualCardStyle}
          onClick={() => (window.location.href = accountUrl)}
        >
          <div className={styles.icon}>&#x1F464;</div>
          <p>Account</p>
        </div>

        {isAuthenticated && (
          <>
            <div
              className={styles.individualCardStyle}
              onClick={() => (window.location.href = jobsUrl)}
            >
              <div className={styles.icon}>&#x1F4C4;</div>
              <p>Jobs</p>
            </div>

            <div
              className={styles.individualCardStyle}
              onClick={() => (window.location.href = eventsUrl)}
            >
              <div className={styles.icon}>&#x1F4C5;</div>
              <p>Events</p>
            </div>

            <div
              className={styles.individualCardStyle}
              onClick={() => (window.location.href = forumUrl)}
            >
              <div className={styles.icon}>&#x1F50E;</div>
              <p>Forum</p>
            </div>
          </>
        )}

        <div
          className={styles.individualCardStyle}
          onClick={() => (window.location.href = subscriptionBillingUrl)}
        >
          <div className={styles.icon}>&#x1F4B3;</div>
          <p>Subscription Billing</p>
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;
