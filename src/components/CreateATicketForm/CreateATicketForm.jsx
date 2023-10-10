import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import styles from './page.module.css';

const CreateATicketForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    ticketName: '', 
    ticketDescription: '', 
    isResolved: false
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
        <label>Problem Title:</label> {/* Changed from 'Title' to 'Problem Title' */}
        <InputText
          name="ticketName"
          value={formData.ticketName}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="jobDescription">Problem Description:</label> {/* Changed from 'Job Requirements' to 'Job Description' */}
        <InputTextarea
          id="ticketDescription"
          name="ticketDescription"
          value={formData.ticketDescription}
          onChange={handleInputChange}
          rows={7} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardFooter}>
        <Button label="Create" rounded onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateATicketForm;
