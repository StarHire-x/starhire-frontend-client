"use client"

import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const subscriptionBenefits = [
  'Access to exclusive content',
  'Priority support',
  'Ad-free experience',
];

const Subscribe = () => {
  const handleSubscribe = () => {
    // Handle subscription logic here
  };

  const cardStyle = {
    width: '400px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    padding: '1rem',
    textAlign: 'center',
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#0073e6', 
    color: 'white',
    marginTop: '1rem',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
      <Card title="Subscribe to Premium" style={cardStyle}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {subscriptionBenefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
        <Button
          label="Subscribe Now"
          icon="pi pi-check"
          style={buttonStyle}
          onClick={handleSubscribe}
        />
      </Card>
    </div>
  );
};

export default Subscribe;


