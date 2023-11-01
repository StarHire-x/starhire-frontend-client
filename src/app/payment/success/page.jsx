import React from 'react';
import './PaymentSuccess.css'; 

const PaymentSuccess = () => {
  return (
    <div className="payment-success-container">
      <div className="payment-success-content">
        <h1 className="payment-success-title">Payment Successful!</h1>
        <p className="payment-success-text">
          Thanks for choosing StarHire! You may now close this browser.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
