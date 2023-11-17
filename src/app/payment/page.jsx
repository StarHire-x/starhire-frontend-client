'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { createCheckoutSession } from '@/app/api/payment/route';
import { getCorporateByUserID } from '@/app/api/payment/route';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getCorporateNextBillingCycleBySubID } from '@/app/api/payment/route';
import { unsubscribeFromPlatform } from '@/app/api/payment/route';
import { getInvoiceFromCustomer } from '@/app/api/payment/route';
import { Toast } from 'primereact/toast';
import styles from './page.module.css';

const subscriptionBenefits = [
  'Priority listings for all Events!',
  'Stand out to Job Seekers',
  'Unsubscribe Anytime!',
];

const PaymentPage = () => {
  const session = useSession();
  const router = useRouter();
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [showUnSubscribeDialog, setShowUnSubscribeDialog] = useState(false);
  const [redirectingDialogVisible, setRedirectingDialogVisible] =
    useState(false);
  const [status, setStatus] = useState(null);
  const [corporate, setCorporate] = useState(null);
  const [billCycle, setBillCycle] = useState(null);
  const [invoices, setInvoices] = useState(true);

  const toast = useRef(null);

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const userIdRef =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  if (session.status === 'unauthenticated') {
    router?.push('/login');
  }

  function convertToSingaporeDate(utcDateString) {
    const utcDate = new Date(utcDateString);

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      timeZone: 'Asia/Singapore',
    };
    return utcDate.toLocaleString('en-SG', options);
  }

  useEffect(() => {
    getCorporateByUserID(userIdRef, accessToken)
      .then((data) => {
        setCorporate(data);
        setStatus(data.corporatePromotionStatus);

        if (data && data.stripeSubId) {
          return getCorporateNextBillingCycleBySubID(
            data.stripeSubId,
            accessToken
          );
        }
      })
      .then((billingCycleData) => {
        if (billingCycleData) {
          setBillCycle(billingCycleData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [userIdRef, accessToken]);

  const handleSubscribe = () => {
    setShowSubscribeDialog(true);
  };

  const handleUnsubscribe = () => {
    setShowUnSubscribeDialog(true);
  };

  const viewMyInvoicesPageRedirect = () => {
    router.push(`/payment/viewCustomerInvoices?id=${corporate.stripeCustId}`);
  };

  const confirmUnsubscribe = async () => {
    let payload = {
      userId: userIdRef,
    };

    setShowUnSubscribeDialog(false);

    const sessionData = await unsubscribeFromPlatform(payload, accessToken);
    if (sessionData != null && sessionData.statusCode === 200) {
      router.push('/payment');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Unsubscription Successful, Please refresh the browser',
        life: 5000,
      });
    }
  };

  let redirectWindow;

  const confirmSubscribe = async () => {
    let payload = {
      userId: userIdRef,
    };

    setRedirectingDialogVisible(true);

    setTimeout(async () => {
      setShowSubscribeDialog(false);
      const sessionData = await createCheckoutSession(payload, accessToken);

      if (sessionData) {
        redirectWindow = window.open(sessionData, '_blank');

        if (redirectWindow) {
          redirectWindow.addEventListener('beforeunload', () => {
            console.error('Payment link window was closed by the user.');
          });
        } else {
          console.error('Failed to open the new window.');
        }
      } else {
        console.error('No payment link provided in the API response.');
      }

      closeDialog();
    }, 2000);
  };

  const closeDialog = () => {
    setRedirectingDialogVisible(false);
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="paymentPage">
        <div className="paymentHeader">
          <h1>Manage Your Subscription</h1>
        </div>

        <div className="paymentContent">
          {status === "Premium" ? (
            <>
              <Card
                title="Thanks for choosing Starhire!"
                className={styles.card}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <p>
                      Thank you for choosing Starhire Premium! With Starhire
                      Premium, your event listings and company name will be made
                      known to job seekers better.
                    </p>
                    <p>
                      If you ever decide to unsubscribe, you can do so by
                      clicking the &quot;Unsubscribe&quot; button below.
                    </p>
                    <p className={styles.warningText}>
                      Upon unsubscribing, you will immediately lose all access
                      to &quot;Premium&quot; services! There will be no partial
                      refunds.
                    </p>
                  </div>
                  <Button
                    label="Unsubscribe"
                    className={styles.btnUnsubscribe}
                    onClick={handleUnsubscribe}
                    rounded
                  />
                </div>
              </Card>

              <Card title="Your Subscription Details" className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <p>
                      <strong>Username:</strong> {corporate.userName}
                    </p>
                    <p>
                      <strong>Status Type:</strong>{" "}
                      {corporate.corporatePromotionStatus}
                    </p>
                    <p>
                      <strong>Subscription ID:</strong> {corporate.stripeSubId}
                    </p>
                    <p>
                      <strong>Customer ID:</strong> {corporate.stripeCustId}
                    </p>
                    <p>
                      <strong>Next Billing Cycle Start Date:</strong>{" "}
                      {convertToSingaporeDate(billCycle?.nextBillingCycleStart)}
                    </p>
                    <p>
                      <strong>Next Billing Cycle End Date:</strong>{" "}
                      {convertToSingaporeDate(billCycle?.nextBillingCycleEnd)}
                    </p>
                  </div>
                  <Button
                    label="Invoice History"
                    className={styles.viewInvoicesButton}
                    onClick={viewMyInvoicesPageRedirect}
                    rounded
                  />
                </div>
              </Card>

              <Dialog
                header="Unsubscribe Confirmation"
                visible={showUnSubscribeDialog}
                style={{ width: "400px" }}
                onHide={() => setShowUnSubscribeDialog(false)}
                footer={
                  <div>
                    <Button
                      label="I Acknowledge"
                      icon="pi pi-check"
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "1px red solid",
                      }}
                      onClick={confirmUnsubscribe}
                    />
                  </div>
                }
              >
                Are you sure you want to unsubscribe from Starhire Premium?
                <p
                  style={{ color: "red", marginTop: "5px", fontWeight: "bold" }}
                >
                  No refunds will be given!
                </p>
              </Dialog>
            </>
          ) : (
            <>
              <Card title="Subscribe to Premium" className={styles.card}>
                <div className={styles.cardContent}>
                  <ul className={styles.benefitList}>
                    {subscriptionBenefits.map((benefit, index) => (
                      <li key={index} className={styles.benefitItem}>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.subscribeButtonContainer}>
                    <Button
                      label="Subscribe Now"
                      icon="pi pi-check"
                      className={styles.btnSubscribe}
                      onClick={handleSubscribe}
                      rounded
                    />
                    <Button
                      label="Invoice History"
                      className={styles.viewInvoicesButton}
                      onClick={viewMyInvoicesPageRedirect}
                      rounded
                    />
                  </div>
                </div>
              </Card>
            </>
          )}

          <Dialog
            header="Subscribe Confirmation"
            visible={showSubscribeDialog}
            style={{ width: "400px" }}
            onHide={() => setShowSubscribeDialog(false)}
            footer={
              <div>
                <Button
                  label="Yes"
                  icon="pi pi-check"
                  onClick={confirmSubscribe}
                />
                <Button
                  label="No"
                  icon="pi pi-times"
                  onClick={() => setShowSubscribeDialog(false)}
                />
              </div>
            }
          >
            The price of Starhire Premium is $10 SGD, Are you sure you want to
            continue?
          </Dialog>

          <Dialog
            header="Redirecting..."
            visible={redirectingDialogVisible}
            style={{ width: "400px" }}
            onHide={closeDialog}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ProgressSpinner
                style={{ width: "50px", height: "50px" }}
                strokeWidth="4"
              />
              <p>You will be redirected to the Stripe Payment Page.</p>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
