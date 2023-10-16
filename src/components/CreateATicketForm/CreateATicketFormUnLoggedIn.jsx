import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import styles from './page.module.css';

const CreateATicketFormUnLoggedIn = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    ticketName: '',
    ticketDescription: '',
    isResolved: false,
    email: '',
  });

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const stripHtmlTags = (str) => {
    if (str === null || str === '') return false;
    else str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  };

  const handleEditorTextChange = (e) => {
    console.log('Editor Text Change:', e.htmlValue);
    const plainText = stripHtmlTags(e.htmlValue);
    setFormData((prev) => ({ ...prev, ticketDescription: plainText }));
  };

  //This still needs to be tested
  const handleSubmit = () => {
    if (!formData.email.trim()) {
      setEmailError('Email address is required');
    } else {
      setEmailError('');
      setFormData((prev) => ({
        ...prev,
      }));
      setShowConfirmationDialog(true);
    }
    if (!formData.ticketName.trim()) {
      setNameError('Please input a title');
    } else {
      setNameError('');
      setFormData((prev) => ({
        ...prev,
      }));
      setShowConfirmationDialog(true);
    }
    if (!formData.ticketDescription.trim()) {
      setDescriptionError('Please input a description');
    } else {
      setDescriptionError('');
      setFormData((prev) => ({
        ...prev,
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
          style={{ width: '75%' }}
          required
        />
        {nameError && <small className={styles.errorText}>{nameError}</small>}
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="ticketDescription">Problem Description:</label>
        <Editor
          id="ticketDescription"
          name="ticketDescription"
          value={formData.ticketDescription}
          onTextChange={handleEditorTextChange}
          style={{ height: '220px' }}
          required
        />
        {descriptionError && (
          <small className={styles.errorText}>{descriptionError}</small>
        )}
      </div>

      <div className={styles.cardRow}>
        <label>Email Address:</label>
        <InputText
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          style={{ width: '75%' }}
          required
        />
        {emailError && <small className={styles.errorText}>{emailError}</small>}
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
            <Button
              label="No"
              icon="pi pi-times"
              onClick={hideConfirmationDialog}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={handleConfirmation}
            />
          </div>
        }
      >
        <p>Are you sure you want to send this ticket?</p>
      </Dialog>
    </div>
  );
};

export default CreateATicketFormUnLoggedIn;
