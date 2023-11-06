'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { uploadFile } from '@/app/api/upload/route';
import {
  findAllEventListingsByCorporate,
  createEventListing,
  updateEventListing,
  removeEventListing,
} from '../api/eventListing/route';
import CreateEventForm from '@/components/CreateEventForm/CreateEventForm';
import EditEventForm from '@/components/EditEventForm/EditEventForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const EventManagementPage = () => {
  const [eventListing, setEventListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [selectedEventListingData, setSelectedEventListingData] =
    useState(null);
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

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };
  

  const getStatus = (status) => {
    console.log('Checking status: ', status);
    switch (status) {
      case 'Upcoming':
        return 'success';
      case 'Expired':
        return 'danger';
      case 'Upcoming':
        return 'success';
    }
  };

  const hideCreateDialog = () => {
    setShowCreateDialog(false);
  };

  const hideEditDialog = () => {
    setSelectedEventListingData(null);
    setShowEditDialog(false);
  };

  const hideDeleteDialog = () => {
    setSelectedEventListingData(null);
    setShowDeleteDialog(false);
  };

  const deleteDialogFooter = (
    <React.Fragment>
      <Button
        label="Yes"
        icon="pi pi-check"
        rounded
        onClick={() =>
          handleDeleteEventListing(selectedEventListingData.eventListingId)
        }
      />
    </React.Fragment>
  );

  useEffect(() => {
    if (session.status === 'unauthenticated') {
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
    const cardLink = `/eventManagement/viewEventRegistrations?id=${eventListing.eventListingId}`;
    <a href={cardLink} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardHeader}></div>
      </div>
    </a>;
    return (
      <a href={cardLink} className={styles.cardLink}>
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
              <span>Event Start:</span>
              <span>{formatDateTime(eventListing.eventStartDateAndTime)}</span>
            </div>
            <div className={styles.cardRow}>
              <span>Event End:</span>
              <span>{formatDateTime(eventListing.eventEndDateAndTime)}</span>
            </div>
            <div className={styles.cardRow}>
              <span>Listed On:</span>
              <span>{formatDateTime(eventListing.listingDate)}</span>
            </div>
            <div className={styles.cardRow}>
              <span>Status:</span>
              <Tag
                value={eventListing.eventListingStatus}
                severity={getStatus(eventListing.eventListingStatus)}
              />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <Button
              label="Edit"
              icon="pi pi-pencil"
              rounded
              onClick={() => {
                setSelectedEventListingData(eventListing);
                setShowEditDialog(eventListing);
              }}
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              rounded
              onClick={() => {
                setSelectedEventListingData(eventListing);
                setShowDeleteDialog(eventListing);
              }}
            />
          </div>
        </div>
      </a>
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

  const handleEditEventListing = async (eventListingId, updatedData) => {
    try {
      const payload = {
        ...updatedData,
        eventListingStatus: 'Upcoming',
        corporateId: userIdRef,
      };
      console.log('Payload:', payload);
      const response = await updateEventListing(
        payload,
        eventListingId,
        accessToken
      );
      console.log('Updated event listing Successfully', response);
      // alert('Updated job listing successfully');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Updated event listing successfully',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error(
        'There was an error updating the event listing:',
        error.message
      );
      // alert('There was an error updating the job listing:');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setSelectedEventListingData(null);
    setShowEditDialog(false);
  };

  const handleDeleteEventListing = async (eventListingId) => {
    try {
      const response = await removeEventListing(eventListingId, accessToken);
      console.log('User is deleted', response);
      // alert('Deleted job listing successfully');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Deleted event listing successfully',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error('Error deleting user:', error);
      // alert('There was an error deleting the job listing:');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setSelectedEventListingData(null);
    setShowDeleteDialog(false);
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
          <h1 className={styles.headerTitle}>Event Management</h1>
          <Button
            className={styles.createEventListingButton}
            label="Create An Event"
            rounded
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

        <Dialog
          header="Edit Event Listing"
          visible={showEditDialog}
          onHide={hideEditDialog}
          className={styles.cardDialog}
        >
          <EditEventForm
            initialData={showEditDialog}
            onSave={(updatedData) => {
              handleEditEventListing(
                showEditDialog.eventListingId,
                updatedData
              );
            }}
          />
        </Dialog>

        <Dialog
          header="Delete Event Listing"
          visible={showDeleteDialog}
          onHide={hideDeleteDialog}
          className={styles.cardDialog}
          footer={deleteDialogFooter}
        >
          <h3>
            Confirm Delete Event ID:{' '}
            {showDeleteDialog && showDeleteDialog.eventListingId}?
          </h3>
        </Dialog>
      </>
    );
  }
};

export default EventManagementPage;
