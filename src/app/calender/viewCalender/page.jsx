"use client"

import Layout from './components/layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';

/*
export default function CalendarPage() {
  const events = [
    {
      title: 'Event 1',
      start: '2023-10-25T10:00:00',
      end: '2023-10-25T12:00:00',
      resourceId: 'a', // Resource ID as defined in the resources array
    },
    {
      title: 'Event 2',
      start: '2023-10-26T14:00:00',
      end: '2023-10-26T16:00:00',
      resourceId: 'b', // Resource ID as defined in the resources array
    },
  ];

  return (
    <Layout>
      <div className='calendar-container'>
        <FullCalendar
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
          initialView='resourceTimelineWeek'
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives' //May have to review this license when we go commercial (But for dev reasons, this shud do)
          resources={[
            { id: 'a', title: 'Auditorium A' },
            { id: 'b', title: 'Auditorium B', eventColor: 'green' },
            { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
          ]}
          events={events}
        />
      </div>
    </Layout>
  );
}
*/

import React, { useState } from 'react'; // Import useState

export default function CalendarPage() {
  const [isFormVisible, setIsFormVisible] = useState(false); // State for modal visibility
  const [events, setEvents] = useState([
    {
      title: 'Event 1',
      start: '2023-10-25T10:00:00',
      end: '2023-10-25T12:00:00',
      resourceId: 'a',
    },
    {
      title: 'Event 2',
      start: '2023-10-26T14:00:00',
      end: '2023-10-26T16:00:00',
      resourceId: 'b',
    },
  ]);

  // Function to add a new event
  const addNewEvent = (eventData) => {
    setEvents([...events, eventData]);
    setIsFormVisible(false); // Close the form after adding an event
  };

  return (
    <Layout>
      <div className='calendar-container'>
        {/* Button to open the form */}
        <button onClick={() => setIsFormVisible(true)}>Add Event</button>

        <FullCalendar
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
          initialView='resourceTimelineWeek'
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
          resources={[
            { id: 'a', title: 'Auditorium A' },
            { id: 'b', title: 'Auditorium B', eventColor: 'green' },
            { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
          ]}
          events={events}
        />
      </div>

      {isFormVisible && (
        <EventForm addNewEvent={addNewEvent} onClose={() => setIsFormVisible(false)} />
      )}
    </Layout>
  );
}

function EventForm({ addNewEvent, onClose }) {
  const [eventData, setEventData] = useState({
    title: '',
    start: '',
    end: '',
    resourceId: 'a', 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewEvent(eventData);
  };

  return (
    <div className='event-form'>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type='text'
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />
        </label>
        <label>
          Start Date and Time:
          <input
            type='datetime-local'
            value={eventData.start}
            onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
          />
        </label>
        <label>
          End Date and Time:
          <input
            type='datetime-local'
            value={eventData.end}
            onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
          />
        </label>
        <button type='submit'>Add Event</button>
        <button type='button' onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

