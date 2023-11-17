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
  updateEventListing,
  cancelEventListing,
} from '../api/eventListing/route';
import CreateEventForm from '@/components/CreateEventForm/CreateEventForm';
import EditEventForm from '@/components/EditEventForm/EditEventForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Utility from '@/common/helper/utility';

const EventManagementPage = () => {
  const [eventListing, setEventListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
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

  const getStatus = (status) => {
    console.log('Checking status: ', status);
    switch (status) {
      case 'Upcoming':
        return 'success';
      case 'Expired':
        return 'danger';
      case 'Cancelled':
        return 'danger';
    }
  };

  const hideCreateDialog = () => {
    setShowCreateDialog(false);
  };

  const hideEditDialog = () => {
    setSelectedEventListingData(null);
    setShowEditDialog(false);
  };

  const hideCancelDialog = () => {
    setSelectedEventListingData(null);
    setShowCancelDialog(false);
  };

  const cancelDialogFooter = (
    <React.Fragment>
      <Button
        label="Yes"
        icon="pi pi-check"
        rounded
        onClick={() =>
          handleCancelEventListing(selectedEventListingData.eventListingId)
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
    console.log('Event Listing:', eventListing);
    const cardLink = `/eventManagement/viewEventRegistrations?id=${eventListing.eventListingId}`;
    <a href={cardLink} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardHeader}></div>
      </div>
    </a>;
    return (
      <>
        <div className={styles.card}>
          <a href={cardLink} className={styles.cardLink}>
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
                <span>Starts:</span>
                <span>
                  {Utility.formatDateTime(eventListing.eventStartDateAndTime)}
                </span>
              </div>
              <div className={styles.cardRow}>
                <span>Ends:</span>
                <span>
                  {Utility.formatDateTime(eventListing.eventEndDateAndTime)}
                </span>
              </div>
              <div className={styles.cardRow}>
                <span>Listed On:</span>
                <span>{Utility.formatDateTime(eventListing.listingDate)}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Status:</span>
                <Tag
                  value={eventListing.eventListingStatus}
                  severity={getStatus(eventListing.eventListingStatus)}
                />
              </div>
            </div>
          </a>
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
              label="Cancel"
              icon="pi pi-times"
              rounded
              onClick={() => {
                setSelectedEventListingData(eventListing);
                setShowCancelDialog(eventListing);
              }}
            />
          </div>
        </div>
      </>
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
        imageUrl = uploadResponse.url;
      }
      const payload = {
        ...newEventListing,
        image: imageUrl,
        listingDate: new Date(),
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
        listingDate: new Date(),
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

  const handleCancelEventListing = async (eventListingId) => {
    try {
      const response = await cancelEventListing(eventListingId, accessToken);
      // alert('Deleted job listing successfully');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Event listing successfully cancelled',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      // alert('There was an error deleting the job listing:');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setSelectedEventListingData(null);
    setShowCancelDialog(false);
  };

  const navigateToCalender = () => {
    router.push('/eventManagement/viewAllEventsCalender');
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
            label="View On Calender"
            rounded
            onClick={navigateToCalender}
          />
          <Button
            className={styles.createEventListingButton}
            label="Post An Event"
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
          header="Cancel Event Listing"
          visible={showCancelDialog}
          onHide={hideCancelDialog}
          className={styles.cardDialog}
          footer={cancelDialogFooter}
        >
          <h3>Are You Sure You Want To Cancel This Event?</h3>
        </Dialog>
      </>
    );
  }
};

export default EventManagementPage;
