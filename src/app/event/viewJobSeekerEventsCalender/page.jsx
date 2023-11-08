"use client";

import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import Layout from "./components/layout";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
//import { getAllEventListings } from "@/app/api/events/route"

import { findAllRegisteredEvents } from "src/app/api/eventListing/route";


export default function CalendarPage() {
  const session = useSession();
  const router = useRouter();

  const accessToken =
  session.status === "authenticated" &&
  session.data &&
  session.data.user.accessToken;

  const userIdRef =
  session.status === "authenticated" &&
  session.data &&
  session.data.user.userId;

if (session.status === "unauthenticated") {
  router?.push("/login");
}

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [displayEventDialog, setDisplayEventDialog] = useState(false);

  const [events, setEvents] = useState(null);

  //const [eventListing, setEventListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const calendarRef = useRef(null);

  const hideEventDialog = () => {
    setDisplayEventDialog(false);
  };

  const redirectToEvent = () => {
    router.push(`/event`)
  }

  const viewEventDetails = (event) => {
    setSelectedEvent(event); 
    setDisplayEventDialog(true); 
  };

  function renderEventContent(eventInfo) {
    const startTime = eventInfo.event.start;
    const endTime = eventInfo.event.end;

    const formattedStartTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(startTime);

    const formattedEndTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(endTime);

    const eventListingStatus = eventInfo.event.extendedProps.eventListingStatus;
    const eventTime = eventInfo.event.extendedProps.eventTime;

    return (
      <div
        style={{
          padding: "2px",
          borderRadius: "4px",
          //color: eventListingStatus === "Upcoming" ? "green" : "red",
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "15px",
        }}
      >
        <b className="fc-event-title-container">
          {formattedStartTime}-{formattedEndTime}
          <br /> 
          {eventInfo.event.title}
        </b>
      </div>
    );
  } 

  useEffect(() => {
    if (session.status === "authenticated") {
        findAllRegisteredEvents(userIdRef, accessToken)
        .then((data) => {
          const formattedEvents = data.map((event) => {
            return {
              title: event.eventName,
              start: event.eventStartDateAndTime,
              end: event.eventEndDateAndTime,
              eventListingStatus: event.eventListingStatus,
              eventId: event.eventListingId
            };
          });
  
          setEvents(formattedEvents);
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
    }
  }, [accessToken]);
  

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.on("eventClick", (info) => {
        const event = info.event.extendedProps;
        viewEventDetails(event); 
      });
    }
  }, []);


  return (
    <Layout>
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            resourceTimelinePlugin,
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          initialView="dayGridMonth"
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          resources={[
            { id: "a", title: "Auditorium A" },
            { id: "b", title: "Auditorium B", eventColor: "green" },
            { id: "c", title: "Auditorium C", eventColor: "orange" },
          ]}
          events={events}
          eventContent={renderEventContent}
        />
      </div>

      <Dialog
        header="Back to Events page"
        visible={displayEventDialog}
        style={{ width: "30vw" }}
        onHide={hideEventDialog}
        modal
        footer={
          <div>
            <Button label="OK" onClick={redirectToEvent}  />
          </div>
        }
      >
        <p>Go to Events page? .</p>
      </Dialog>
    </Layout>
  );
}