"use client"

import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import Layout from './components/layout';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { getInterviewDates } from '@/app/api/calender/route';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function CalendarPage() {

  const session = useSession();
  const router = useRouter();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false); 
  const [eventClicked, setEventClicked] = useState(false); 
  const [warningDialogVisible, setWarningDialogVisible] = useState(false);
  const [selectedMeetingLink, setSelectedMeetingLink] = useState('');
  const [interviewDates, setInterviewDates] = useState([]);

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  /*
    const userIdRef =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

    const role =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.role;

    */

    const userIdRef = "5a51c50a-da24-4e35-bd3e-3b1c0b0588eb";
    const role = "corporate";
    

    const formatEvents = (interviewDates) => {
      return interviewDates.map((interview) => {
        const events = [];
    
        if (interview.firstChosenDates) {
          events.push({
            title: `Interview #${interview.id}`,
            start: new Date(interview.firstChosenDates),
            end: new Date(interview.scheduledDate),
            onlineMeetingLink: interview.interviewLink,
          });
        }
    
        if (interview.secondChosenDates) {
          events.push({
            title: `Interview #${interview.id}`,
            start: new Date(interview.secondChosenDates),
            end: new Date(interview.scheduledDate),
            onlineMeetingLink: interview.interviewLink,
          });
        }
    
        if (interview.thirdChosenDates) {
          events.push({
            title: `Interview #${interview.id}`,
            start: new Date(interview.thirdChosenDates),
            end: new Date(interview.scheduledDate),
            onlineMeetingLink: interview.interviewLink,
          });
        }
    
        return events;
      }).flat();
    };
    

    /*
    const formatEvents = (interviewDates) => {
      return interviewDates.map((interview) => ({
        title: `Interview #${interview.id}`,
        start: new Date(interview.secondChosenDates), // Change this line
        end: new Date(interview.scheduledDate),
        resourceId: 'a', // You can adjust this as needed
        onlineMeetingLink: interview.interviewLink,
      }));
    };
    */
    

/*
  const [events, setEvents] = useState([
    {
      title: 'Event 1',
      start: '2023-10-25T10:00:00',
      end: '2023-10-25T12:00:00',
      resourceId: 'a',
      onlineMeetingLink: 'https://example.com/meeting1',
    },
    {
      title: 'Event 2',
      start: '2023-10-26T14:00:00',
      end: '2023-10-26T16:00:00',
      resourceId: 'b',
      onlineMeetingLink: 'https://example.com/meeting2',
    },
    {
        title: 'Event 3',
        start: '2023-10-26T16:00',
      },
  ]);
  */

  /*
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/login');
    } else if (session.status === 'authenticated') {
      getInterviewDates(userIdRef, role, accessToken)
        .then((data) => {
          setInterviewDates(data);
        })
        .catch((error) => {
          console.error('Error fetching Interview Dates:', error);
        });
    }
  }, [userIdRef, accessToken]);
  */

  useEffect(() => {
    getInterviewDates(userIdRef, role, accessToken)
      .then((data) => {
        setInterviewDates(data.data);
      })
      .catch((error) => {
        console.error('Error fetching Interview Dates:', error);
      });
  }, [userIdRef, accessToken]);

  console.log(interviewDates);
  



  


  const calendarRef = useRef(null);

  function renderEventContent(eventInfo) {
    const startTime = eventInfo.event.start;
    const endTime = eventInfo.event.end;
  
    const formattedStartTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(startTime);
    const formattedEndTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(endTime);
  
    return (
      <>
        <b>{formattedStartTime} {eventInfo.event.title}</b>
      </>
    );
  }
  

  const [eventData, setEventData] = useState({
    title: '',
    start: null,
    end: null,
    resourceId: 'a',
    onlineMeetingLink: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmationVisible(true); 
  };

  const addNewEvent = (eventData) => {
    setEvents([...events, eventData]);
    setIsFormVisible(false);
  };

  const handleConfirmation = (confirmed) => {
    setIsConfirmationVisible(false); 
    if (confirmed) {
      addNewEvent(eventData); 
      setIsFormVisible(false);
    }
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.on('eventClick', handleEventClick);
    }
  }, []);

  const handleEventClick = (eventInfo) => {
    if (!eventClicked) {
      setWarningDialogVisible(true);
      setSelectedMeetingLink(eventInfo.event.extendedProps.onlineMeetingLink);
    }
  };

  const closeWarningDialog = () => {
    setWarningDialogVisible(false); 
  };

  const redirectToMeetingLink = () => {
    if (selectedMeetingLink) {
      window.open(selectedMeetingLink, "_blank");
      setEventClicked(true);
      setWarningDialogVisible(false);
    }
  };

  return (
    <Layout>
      <div className="calendar-container">
        <Button label="Add Event" onClick={() => setIsFormVisible(true)} />

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
            right: "resourceTimelineWeek,dayGridMonth,timeGridWeek",
          }}
          initialView="resourceTimelineWeek"
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
          events={formatEvents(interviewDates)}
          eventContent={renderEventContent}
        />
      </div>

      <Dialog
        header="Schedule a time"
        visible={isFormVisible}
        style={{ width: "50vw" }}
        onHide={() => setIsFormVisible(false)}
        footer={
          <div>
            <Button label="Add Event" type="submit" onClick={handleSubmit} />
            <Button
              label="Cancel"
              className="p-button-secondary"
              onClick={() => setIsFormVisible(false)}
            />
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="p-field">
            <label htmlFor="title" className="p-sr-only">
              Title:
            </label>
            <InputText
              id="title"
              type="text"
              value={eventData.title}
              onChange={(e) =>
                setEventData({ ...eventData, title: e.target.value })
              }
              placeholder="Title"
            />
          </div>
          <div className="p-field">
            <label htmlFor="start" className="p-sr-only">
              Start Date and Time:
            </label>
            <Calendar
              id="start"
              value={eventData.start}
              onChange={(e) => setEventData({ ...eventData, start: e.value })}
              showTime
              placeholder="Start Date and Time"
            />
          </div>
          <div className="p-field">
            <label htmlFor="end" className="p-sr-only">
              End Date and Time:
            </label>
            <Calendar
              id="end"
              value={eventData.end}
              onChange={(e) => setEventData({ ...eventData, end: e.value })}
              showTime
              placeholder="End Date and Time"
            />
          </div>
          <div className="p-field">
            <label htmlFor="onlineMeetingLink" className="p-sr-only">
              Online Meeting Link:
            </label>
            <InputText
              id="onlineMeetingLink"
              type="url"
              value={eventData.onlineMeetingLink}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  onlineMeetingLink: e.target.value,
                })
              }
              placeholder="Online Meeting Link"
            />
          </div>
        </form>
      </Dialog>

      <Dialog
        header="Confirmation"
        visible={isConfirmationVisible}
        style={{ width: "30vw" }}
        onHide={() => setIsConfirmationVisible(false)}
        footer={
          <div>
            <Button
              label="Cancel"
              className="p-button-secondary"
              onClick={() => handleConfirmation(false)}
            />
            <Button
              label="Confirm"
              type="button"
              onClick={() => handleConfirmation(true)}
            />
          </div>
        }
      >
        <p>Add this Interview Date?</p>
      </Dialog>

      <Dialog
        header="Warning"
        visible={warningDialogVisible}
        style={{ width: "30vw" }}
        onHide={closeWarningDialog}
        footer={
          <div>
            <Button label="OK" onClick={redirectToMeetingLink} />
          </div>
        }
      >
        <p>Warning! You will be redirected to a new link.</p>
      </Dialog>
    </Layout>
  );
}











