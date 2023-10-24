'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { uploadFile } from '@/app/api/upload/route';
import {
  findAllEventListingsByCorporate,
  createEventListing,
} from '../api/eventListing/route';
import CreateEventForm from '@/components/CreateEventForm/CreateEventForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Enums from '@/common/enums/enums';
import styles from './page.module.css';

const EventManagementPage = () => {
  const [eventListing, setEventListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
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

  console.log(session);
  console.log(userIdRef);

  const toast = useRef(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = (status) => {
    switch (status) {
      case Enums.UPCOMING:
        return 'success';
      case Enums.EXPIRED:
        return 'danger';
    }
  };

  const hideCreateDialog = () => {
    setShowCreateDialog(false);
  };

  useEffect(() => {
    if (session.status === 'unauthenticated' || session.status === 'loading') {
      router.push('/login');
    } else if (session.status === 'authenticated') {
      findAllEventListingsByCorporate(userIdRef, accessToken)
        .then((eventListing) => {
          setEventListing(eventListing);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setIsLoading(false);
        });
    }
  }, [refreshData, userIdRef, accessToken]);

  const itemTemplate = (eventListing) => {
    return (
      <div className={styles.card}>
        {/* Display the image if available */}
        {eventListing.image && (
          <div className={styles.cardImage}>
            <img src={eventListing.image} alt={eventListing.eventName} />
          </div>
        )}
        <div className={styles.cardHeader}>
          <h3>{eventListing.eventName}</h3>
        </div>
        <div className={styles.cardDetails}>
          <div className={styles.cardRow}>
            <span>Event ID:</span>
            <span>{eventListing.eventListingId}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Location:</span>
            <span>{eventListing.location}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Event Date:</span>
            <span>{formatDate(eventListing.eventDate)}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Listed On:</span>
            <span>{formatDate(eventListing.listingDate)}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Status:</span>
            <Tag
              value={eventListing.eventListingStatus}
              severity={getStatus(eventListing.eventListingStatus)}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleEventListingCreation = async (newEventListing) => {
    try {
      let imageUrl;
      if (newEventListing.image) {
        const uploadResponse = await uploadFile(
          newEventListing.image,
          accessToken
        );
        imageUrl = uploadResponse.url; // Assuming your server returns a field named 'url' in its response that contains the S3 URL.
      }
      const payload = {
        ...newEventListing,
        image: imageUrl,
        corporateId: userIdRef,
      };
      const response = await createEventListing(payload, accessToken);
      console.log('Created Event listing Successfully', response);
      // alert('Created event listing successfully');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Created event listing successfully',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error(
        'There was an error creating the event listing:',
        error.message
      );
      // alert('There was an error creating the event listing:');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setShowCreateDialog(false);
  };

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <ProgressSpinner />
      </div>
    );
  }

  if (session.status === 'authenticated') {
    return (
      <>
        <Toast ref={toast} />
        <div className={styles.header}>
          <h1 className={styles.headerTitle} style={{ marginBottom: '15px' }}>
            Event Management
          </h1>
          <Button
            className={styles.createEventListingButton}
            label="Create An Event"
            rounded
            style={{ marginTop: '10px', marginBottom: '15px' }}
            onClick={() => setShowCreateDialog(true)}
          />
        </div>

        <div className={styles.cardsGrid}>
          {eventListing.map((event) => itemTemplate(event))}
        </div>

        <Dialog
          header="Create Event Listing"
          visible={showCreateDialog}
          onHide={hideCreateDialog}
          className={styles.cardDialog}
        >
          <CreateEventForm onCreate={handleEventListingCreation} />
        </Dialog>
      </>
    );
  }
};

export default EventManagementPage;
