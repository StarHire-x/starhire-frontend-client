"use client"

import React, { useEffect, useState } from 'react';
import { Button }  from 'primereact/button';
import { Link } from 'next/link';
import { getCorporateByUserID } from '@/app/api/payment/route';
import { Enums } from '@/common/enums/enums';

const SubscriptionButton = ({ userIdRef, sessionTokenRef }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getCorporateByUserID(userIdRef, sessionTokenRef)
      .then((data) => {
        setStatus(data.corporatePromotionStatus);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [userIdRef, sessionTokenRef]);

  return (
    <div>
      {status === 'Premium' ? (
        <Link href="/your-premium-page" passHref>
          <Button
            style={{
              backgroundColor: 'gold',
              color: 'black',
            }}
          >
            Premium
          </Button>
        </Link>
      ) : (
        <Link href="/your-regular-page" passHref>
          <Button
            style={{
              backgroundColor: 'lightgreen',
              color: 'black',
              whiteSpace: 'nowrap',
            }}
          >
            Try Premium Today!
          </Button>
        </Link>
      )}
    </div>
  );
};

export default SubscriptionButton;
