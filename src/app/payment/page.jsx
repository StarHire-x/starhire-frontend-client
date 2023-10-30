"use client"

import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { createCheckoutSession } from '@/app/api/payment/route';
import { getCorporateByUserID } from '@/app/api/payment/route';
import { useSession } from 'next-auth/react';
import { ProgressSpinner } from 'primereact/progressspinner';

const subscriptionBenefits = [
  'Access to exclusive content',
  'Priority support',
  'Ad-free experience',
];

const PaymentPage = () => {
  const session = useSession();
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [redirectingDialogVisible, setRedirectingDialogVisible] = useState(false);
  const [status, setStatus] = useState(null); 
  const [corporate, setCorporate] = useState(null); 



  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const userIdRef =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

    useEffect(() => {
      getCorporateByUserID(userIdRef, accessToken)
        .then((data) => {
          setCorporate(data);
          setStatus(data.corporatePromotionStatus); 
          console.log(corporate);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }, [userIdRef, accessToken]);

  const cardStyle = {
    width: '400px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    padding: '1rem',
    textAlign: 'center',
  };

  const buttonStyle = {
    width: '100%',
    marginTop: '1rem',
  };

  const handleSubscribe = () => {
    setShowSubscribeDialog(true);
  };

  const handleUnsubscribe = () => {
    setShowSubscribeDialog(true);
  };

  let redirectWindow;

  const confirmSubscribe = async () => {
    let payload = {
      userId: userIdRef,
    };

    //setShowSubscribeDialog(false);
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
    }, 3000);
  };

  const closeDialog = () => {
    setRedirectingDialogVisible(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2rem",
      }}
    >
      {status === "Premium" ? ( // Add this condition
        <Card title="Thanks for choosing Starhire!" style={cardStyle}>
          <p>
            Thank you for choosing Starhire Premium! With Starhire Premium, you
            get access to a world of exclusive content and priority support.
          </p>
          <p>
            If you ever decide to unsubscribe, you can do so by clicking the
            "Unsubscribe" button below.
          </p>
          <Button
            label="Unsubscribe"
            icon="pi pi-check"
            style={{
              ...buttonStyle,
              backgroundColor: "red",
              color: "white",
            }}
            onClick={handleUnsubscribe}
          />
        </Card>
        
      ) : (
        <Card title="Subscribe to Premium" style={cardStyle}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {subscriptionBenefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
          <Button
            label="Subscribe Now"
            icon="pi pi-check"
            style={{ ...buttonStyle, backgroundColor: "green", color: "white" }}
            onClick={handleSubscribe}
          />
        </Card>
      )}
      <Dialog
        header="Subscribe Confirmation"
        visible={showSubscribeDialog}
        style={{ width: "400px" }}
        onHide={() => setShowSubscribeDialog(false)}
        footer={
          <div>
            <Button label="Yes" icon="pi pi-check" onClick={confirmSubscribe} />
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
          <p>You will be redirected to Stripe Payment Page.</p>
        </div>
      </Dialog>
    </div>
  );
};

export default PaymentPage;









