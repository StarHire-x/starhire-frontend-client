import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import styles from './page.module.css';

const EditEventForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState({
    eventName: initialData?.eventName || '',
    location: initialData?.location || '',
    eventStartDateAndTime: initialData?.eventStartDateAndTime || null,
    eventEndDateAndTime: initialData?.eventEndDateAndTime || null,
    details: initialData?.details || '',
    image: initialData?.image || '',
  });

  const handleInputChange = (e, nameOverride) => {
    let name, value;

    if (nameOverride) {
      // Handling special cases where only the value is passed along with a name
      name = nameOverride;
      value = e;
    } else if (e && e.target) {
      // Handling standard HTML input elements
      name = e.target.name;
      value = e.target.value;
    } else if (e && e.value !== undefined && e.originalEvent) {
      // Handling calendar events
      name = e.originalEvent.target.name;
      value = e.value;
    }

    if (name && value !== undefined) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      console.warn('Name or value is missing', e);
    }
  };

  const handleSubmit = () => {
    if (onSave) onSave(formData);
  };

  return (
    <div className={styles.cardBody}>
      <div className={styles.cardRow}>
        <label>Title:</label>
        <InputText
          name="eventName"
          value={formData.eventName}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="location">Event Location:</label>
        <InputText
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="eventStartDateAndTime">Event Start Date:</label>
        <Calendar
          id="eventStartDateAndTime"
          name="eventStartDateAndTime"
          showTime
          hourFormat='24'
          value={formData.eventStartDateAndTime}
          minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="eventEndDateAndTime">Event End Date:</label>
        <Calendar
          id="eventEndDateAndTime"
          name="eventEndDateAndTime"
          value={formData.eventEndDateAndTime}
          showTime
          hourFormat='24'
          minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="details">Event Details:</label>
        <InputTextarea
          id="details"
          name="details"
          value={formData.details}
          onChange={handleInputChange}
          rows={7}
          autoResize={true}
        />
      </div>

      {/* <div className={styles.cardRow}>
        <label htmlFor="image">Event Image (landscape suggested):</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={(e) => handleInputChange(e)}
        />
      </div> */}

      <div className={styles.cardFooter}>
        <Button label="Save Changes" rounded onClick={handleSubmit} />
      </div>
    </div>
  );
};
export default EditEventForm;
