import React from 'react';
import './PaymentFailed.css'; 

const PaymentFailed = () => {
  return (
    <div className="payment-failed-container">
      <div className="payment-failed-content">
        <h1 className="payment-failed-title">Payment Failed!</h1>
        <p className="payment-failed-text">Something went wrong. Please try again later.</p>
      </div>
    </div>
  );
};

export default PaymentFailed;
