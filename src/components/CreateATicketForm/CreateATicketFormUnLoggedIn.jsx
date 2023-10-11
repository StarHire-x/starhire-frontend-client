import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import styles from './page.module.css';

const CreateATicketFormUnLoggedIn = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    ticketName: '',
    ticketDescription: '',
    isResolved: false,
    email: '', 
    username: '', 
  });

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //This still needs to be tested
  const handleSubmit = () => {
    if (!formData.email.trim()) {
      setEmailError('Email address is required');
    } else {
      setEmailError('');
      const updatedDescription = `Email Address: ${formData.email}, Username: ${formData.username} - ${formData.ticketDescription}`;
      setFormData((prev) => ({
        ...prev,
        ticketDescription: updatedDescription,
      }));
      setShowConfirmationDialog(true);
    }
  };

  const handleConfirmation = () => {
    setShowConfirmationDialog(false);
    if (onCreate) onCreate(formData);
  };

  const hideConfirmationDialog = () => {
    setShowConfirmationDialog(false);
  };

  return (
    <div className={styles.cardBody}>
      <div className={styles.cardRow}>
        <label>Problem Title:</label>
        <InputText
          name="ticketName"
          value={formData.ticketName}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="ticketDescription">Problem Description:</label>
        <InputTextarea
          id="ticketDescription"
          name="ticketDescription"
          value={formData.ticketDescription}
          onChange={handleInputChange}
          rows={7}
          autoResize={true}
        />
      </div>

      <div className={styles.cardRow}>
        <label>Email Address:</label>
        <InputText
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required // Add the required attribute
        />
        {emailError && <small className={styles.errorText}>{emailError}</small>}
      </div>

      <div className={styles.cardRow}>
        <label>Username:</label>
        <InputText
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.cardFooter}>
        <Button label="Send" rounded onClick={handleSubmit} />
      </div>

      <Dialog
        header="Confirmation"
        visible={showConfirmationDialog}
        modal
        onHide={hideConfirmationDialog}
        footer={
          <div>
            <Button label="No" icon="pi pi-times" onClick={hideConfirmationDialog} />
            <Button label="Yes" icon="pi pi-check" onClick={handleConfirmation} />
          </div>
        }
      >
        <p>Are you sure you want to send this ticket?</p>
      </Dialog>
    </div>
  );
};

export default CreateATicketFormUnLoggedIn;

