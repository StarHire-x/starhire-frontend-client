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

export default function CalendarPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false); 
  const [eventClicked, setEventClicked] = useState(false); 
  const [warningDialogVisible, setWarningDialogVisible] = useState(false);
  const [selectedMeetingLink, setSelectedMeetingLink] = useState('');

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
  ]);

  const calendarRef = useRef(null);

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
            left: 'prev,next today',
            center: 'title',
            right: 'resourceTimelineWeek,dayGridMonth,timeGridWeek',
          }}
          initialView="resourceTimelineWeek"
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          resources={[
            { id: 'a', title: 'Auditorium A' },
            { id: 'b', title: 'Auditorium B', eventColor: 'green' },
            { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
          ]}
          events={events}
        />
      </div>

      <Dialog
        header="Schedule a time"
        visible={isFormVisible}
        style={{ width: '50vw' }}
        onHide={() => setIsFormVisible(false)}
        footer={
          <div>
            <Button label="Add Event" type="submit" onClick={handleSubmit} />
            <Button label="Cancel" className="p-button-secondary" onClick={() => setIsFormVisible(false)} />
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
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
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
              onChange={(e) => setEventData({ ...eventData, onlineMeetingLink: e.target.value })}
              placeholder="Online Meeting Link"
            />
          </div>
        </form>
      </Dialog>

      <Dialog
        header="Confirmation"
        visible={isConfirmationVisible}
        style={{ width: '30vw' }}
        onHide={() => setIsConfirmationVisible(false)}
        footer={
          <div>
            <Button label="Cancel" className="p-button-secondary" onClick={() => handleConfirmation(false)} />
            <Button label="Confirm" type="button" onClick={() => handleConfirmation(true)} />
          </div>
        }
      >
        <p>Add this Interview Date?</p>
      </Dialog>

      <Dialog
        header="Warning"
        visible={warningDialogVisible}
        style={{ width: '30vw' }}
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











