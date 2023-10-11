import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog'; // Import Dialog
import styles from './page.module.css';

const CreateATicketForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    ticketName: '',
    ticketDescription: '',
    isResolved: false,
  });

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Show the confirmation dialog
    setShowConfirmationDialog(true);
  };

  const handleConfirmation = () => {
    // Close the confirmation dialog
    setShowConfirmationDialog(false);

    // Perform the actual submission
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
        <label htmlFor="jobDescription">Problem Description:</label>
        <InputTextarea
          id="ticketDescription"
          name="ticketDescription"
          value={formData.ticketDescription}
          onChange={handleInputChange}
          rows={7}
          autoResize={true}
        />
      </div>

      <div className={styles.cardFooter}>
        <Button label="Send" rounded onClick={handleSubmit} />
      </div>

      {/* Confirmation Dialog */}
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

export default CreateATicketForm;


