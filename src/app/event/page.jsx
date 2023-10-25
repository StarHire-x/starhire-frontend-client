'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { findAllEventListings } from '../api/eventListing/route';
import styles from './page.module.css';

const EventPage = () => {
  const session = useSession();
  const router = useRouter();
  const toast = useRef(null);

  const [eventListings, setEventListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const jobSeekerId =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  useEffect(() => {
    if (session.status === 'unauthenticated' || session.status === 'loading') {
      router.push('/login');
    }

    if (accessToken) {
      findAllEventListings(accessToken)
        .then((data) => {
          setEventListings(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching event listings:', error);
          setIsLoading(false);
        });
    }
  }, [refreshData, accessToken]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const eventTemplate = (eventData) => {
    return (
      <div className={styles.event}>
        <img
          src={eventData.image}
          alt={eventData.eventName}
          className={styles.eventImage}
        />
        <h4>{eventData.eventName}</h4>
        <p>
          <strong>Location:</strong> {eventData.location}
        </p>
        <p>
          <strong>Date:</strong> {formatDate(eventData.eventDate)}
        </p>
        <p>
          <strong>Details:</strong> {eventData.details}
        </p>
        <p>
          <strong>Listing Date:</strong> {formatDate(eventData.listingDate)}
        </p>
        <p>
          <strong>Status:</strong> {eventData.eventListingStatus}
        </p>
        <p>
          <strong>Organized By:</strong>{' '}
          {eventData.corporate && eventData.corporate.userName}
        </p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Upcoming Events For You</h1>
      <Toast ref={toast} />
      {isLoading ? (
        <ProgressSpinner
          style={{
            display: 'flex',
            height: '100vh',
            'justify-content': 'center',
            'align-items': 'center',
          }}
        />
      ) : (
        <Carousel
          value={eventListings}
          itemTemplate={eventTemplate}
          numVisible={3}
          numScroll={1}
          responsiveOptions={[
            {
              breakpoint: '1024px',
              numVisible: 3,
              numScroll: 3,
            },
            {
              breakpoint: '600px',
              numVisible: 2,
              numScroll: 2,
            },
            {
              breakpoint: '480px',
              numVisible: 1,
              numScroll: 1,
            },
          ]}
          circular={true}
        />
      )}
    </div>
  );
};

export default EventPage;
