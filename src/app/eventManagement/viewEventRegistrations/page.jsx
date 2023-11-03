'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { ProgressSpinner } from 'primereact/progressspinner';
import { findAllEventRegistrationsByEventListing } from '@/app/api/eventListing/route';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

const ViewEventRegistrationsPage = () => {
  const [eventRegistrations, setEventRegistrations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const router = useRouter();

  const userIdRef =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const params = useSearchParams();
  const id = params.get('id');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (accessToken) {
      findAllEventRegistrationsByEventListing(id, accessToken)
        .then((response) => {
          setEventRegistrations(response);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching event registrations:', error);
          setIsLoading(false);
        });
    }
  }, [userIdRef, accessToken]);

  const itemTemplate = (eventRegistration) => {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span>Event Registration Id:</span>
          <h5>{eventRegistration.eventRegistrationId}</h5>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardRow}>
            <span>Registered by:</span>
            <span>{eventRegistration.jobSeeker.fullName}</span>
          </div>
          {/* <div className={styles.cardRow}>
            <span>Contact email:</span>
            <span>{eventRegistration.jobSeeker.email}</span>
          </div> */}
          <div className={styles.cardRow}>
            <span>Registration Date:</span>
            <span>{formatDate(eventRegistration.registrationDate)}</span>
          </div>
        </div>
      </div>
    );
  };

  if (session.status === 'unauthenticated') {
    router?.push('/login');
  }

  if (session.status === 'authenticated') {
    return (
      <div className={styles.container}>
        {isLoading ? (
          <ProgressSpinner
            style={{
              display: 'flex',
              height: '100vh',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ) : (
          <DataView
            value={eventRegistrations}
            className={styles.dataViewContainer}
            layout="grid"
            rows={10}
            paginator
            header={
              <h2 className={styles.headerTitle}>
                All Registrations for Current Event Listing
              </h2>
            }
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            rowsPerPageOptions={[10, 25, 50]}
            emptyMessage="No Registration found for this Event Listing"
            itemTemplate={itemTemplate}
          />
        )}
      </div>
    );
  }
};

export default ViewEventRegistrationsPage;
