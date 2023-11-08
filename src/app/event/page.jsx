"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { findAllEventListings } from "../api/eventListing/route";
import {
  createEventRegistration,
  findExistingEventRegistration,
} from "@/app/api/eventRegistration/route";
import styles from "./page.module.css";
import Utility from "@/common/helper/utility";

const EventPage = () => {
  const session = useSession();
  const router = useRouter();
  const toast = useRef(null);

  const [eventListings, setEventListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [showEventRegistrationDialog, setShowEventRegistrationDialog] =
    useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const jobSeekerId =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

  useEffect(() => {
    if (session.status === "unauthenticated" || session.status === "loading") {
      router.push("/login");
    }
    const navigateToCalender = () => {
      router.push('/eventManagement/viewAllEventsCalender'); 
    };


    const fetchData = async () => {
      try {
        if (accessToken) {
          const data = await findAllEventListings(accessToken);
          setEventListings(data);

          const checkRegistrations = data.map((event) =>
            findExistingEventRegistration(
              jobSeekerId,
              event.eventListingId,
              accessToken
            )
          );

          Promise.all(checkRegistrations).then((responses) => {
            const registered = data
              .filter((event, index) => responses[index].statusCode === 200)
              .map((event) => event.eventListingId);

            setRegisteredEvents(registered);
          });
        }
      } catch (error) {
        console.error("Error fetching event listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshData, accessToken]);

  const hideEventRegistrationDialog = () => {
    setShowEventRegistrationDialog(false);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const registerForEvent = () => {
    const newEventRegistration = {
      jobSeekerId: jobSeekerId,
      eventListingId: selectedEvent.eventListingId,
      registrationDate: new Date(),
    };
    createEventRegistration(newEventRegistration, accessToken)
      .then(() => {
        toast.current.show({
          severity: "success",
          summary: "Registered Successfully",
        });
        setRegisteredEvents((prevEvents) => {
          const updatedState = [...prevEvents, selectedEvent.eventListingId];
          return updatedState;
        });
        hideEventRegistrationDialog();
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Registration Failed",
          detail: error.message,
        });
      });
  };

  const navigateToCalender = () => {
    router.push('/event/viewJobSeekerEventsCalender'); 
  };

  const eventTemplate = (eventData) => {
    let statusSeverity;
    switch (eventData.eventListingStatus) {
      case "Upcoming":
        statusSeverity = "success";
        break;
      case "Expired":
        statusSeverity = "danger";
        break;
    }
    eventData.statusSeverity = statusSeverity;

    return (
      <div className={styles.event} onClick={() => setSelectedEvent(eventData)}>
        {eventData.image && (
          <img
            src={eventData.image}
            alt={eventData.eventName}
            className={styles.eventImage}
          />
        )}
        <h4>{eventData.eventName}</h4>
        <p>
          <strong>Location:</strong> {eventData.location}
        </p>
        <p>
          <strong>Organized By:</strong>{" "}
          {eventData.corporate && eventData.corporate.userName}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {Utility.formatDateTime(eventData.eventStartDateAndTime)}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {Utility.formatDateTime(eventData.eventEndDateAndTime)}
        </p>
        <p>
          <strong>Posted On:</strong>{" "}
          {Utility.formatDateTime(eventData.listingDate)}
        </p>
        <p>
          <Tag value={eventData.eventListingStatus} severity={statusSeverity} />
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
            display: "flex",
            height: "100vh",
            "justify-content": "center",
            "align-items": "center",
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
              breakpoint: "1024px",
              numVisible: 3,
              numScroll: 1,
            },
            {
              breakpoint: "600px",
              numVisible: 2,
              numScroll: 1,
            },
            {
              breakpoint: "480px",
              numVisible: 1,
              numScroll: 1,
            },
          ]}
          circular={true}
        />
      )}
      <Button
        className={styles.createEventListingButton}
        label="View on Calender"
        rounded
        onClick={navigateToCalender}
      />

      <Dialog
        header="Event Details"
        visible={!!selectedEvent}
        onHide={() => setSelectedEvent(null)}
        className={`${styles.cardDialog} ${styles.dialogSize}`}
        footer={
          <>
            <div className={styles.dialogFooter}>
              {selectedEvent &&
              !registeredEvents.includes(selectedEvent.eventListingId) ? (
                <Button
                  label="Register"
                  className={styles.createButton}
                  icon="pi pi-plus"
                  onClick={() => {
                    setSelectedEventId(selectedEvent.eventListingId);
                    setShowEventRegistrationDialog(true);
                  }}
                  rounded
                />
              ) : (
                <h3 style={{ marginBottom: "20px" }}>
                  You have registered for this event
                </h3>
              )}
              <Button
                label="Close"
                className={styles.closeButton}
                onClick={() => setSelectedEvent(null)}
                rounded
              />
            </div>
          </>
        }
      >
        {selectedEvent && (
          <>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.eventName}
              className={styles.eventImage}
            />
            <h4 className={styles.dialogField}>{selectedEvent.eventName}</h4>
            <p className={styles.dialogField}>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p className={styles.dialogField}>
              <strong>Organized By:</strong>{" "}
              {selectedEvent.corporate && selectedEvent.corporate.userName}
            </p>
            <p className={styles.dialogField}>
              <strong>Start Date:</strong>{" "}
              {Utility.formatDateTime(selectedEvent.eventStartDateAndTime)}
            </p>
            <p className={styles.dialogField}>
              <strong>End Date:</strong>{" "}
              {Utility.formatDateTime(selectedEvent.eventEndDateAndTime)}
            </p>
            <p className={styles.dialogField}>
              <strong>Details:</strong> {selectedEvent.details}
            </p>
            <p className={styles.dialogField}>
              <strong>Posted On:</strong>{" "}
              {Utility.formatDateTime(selectedEvent.listingDate)}
            </p>
            <p>
              <Tag
                value={selectedEvent.eventListingStatus}
                severity={selectedEvent.statusSeverity}
              />
            </p>
          </>
        )}
      </Dialog>

      <Dialog
        header="Event Registration"
        visible={showEventRegistrationDialog}
        onHide={hideEventRegistrationDialog}
        className={styles.cardDialog}
        footer={
          <>
            <Button
              label="Yes"
              onClick={() => registerForEvent(selectedEventId)}
            />
            <Button label="No" onClick={hideEventRegistrationDialog} />
          </>
        }
      >
        Do you want to register for this event?
      </Dialog>
    </div>
  );
};

export default EventPage;
