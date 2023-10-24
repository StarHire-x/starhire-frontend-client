import { useState } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { uploadFile } from '@/app/api/upload/route';
import styles from './page.module.css';

const CreateEventForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    location: '',
    eventDate: null,
    details: '',
    image: '',
    eventListingStatus: 'Upcoming', // default status
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onCreate) onCreate(formData);
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
        <label htmlFor="eventDate">Event Date:</label>
        <Calendar
          id="eventDate"
          name="eventDate"
          value={formData.eventDate}
          minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // set minimum date to tomorrow
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, eventDate: e.value }))
          }
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="details">Event Details:</label>
        <InputTextarea
          id="details"
          name="details"
          value={formData.requirements}
          onChange={handleInputChange}
          rows={7}
          autoResize={true}
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="image">Event Image (landscape suggested):</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
          }
        />
      </div>

      <div className={styles.cardFooter}>
        <Button label="Create" rounded onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateEventForm;
