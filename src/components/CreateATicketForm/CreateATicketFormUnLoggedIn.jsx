import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import styles from './page.module.css';
import { uploadFileNonAccessToken } from '@/app/api/upload/route';

const CreateATicketFormUnLoggedIn = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    ticketName: '',
    ticketDescription: '',
    isResolved: false,
    email: '',
    documents: [],
  });

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleDocumentChange = (index, field) => (e) => {
    const newDocuments = [...formData.documents];
    newDocuments[index][field] = e.target.value;
    setFormData((prevState) => ({ ...prevState, documents: newDocuments }));
  };

  const addDocument = () => {
    setFormData((prevState) => ({
      ...prevState,
      documents: [
        ...prevState.documents,
        { mandatory: false, documentName: '', documentLink: '' },
      ],
    }));
  };

  const removeDocument = (index) => {
    const newDocuments = [...formData.documents];
    newDocuments.splice(index, 1);
    setFormData((prevState) => ({ ...prevState, documents: newDocuments }));
  };

  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const response = await uploadFileNonAccessToken(file);

      // Update the specific document's link in the formData
      const newDocuments = [...formData.documents];
      newDocuments[index].documentLink = response.url;
      setFormData((prevState) => ({ ...prevState, documents: newDocuments }));
    } catch (error) {
      console.error('There was an error uploading the file', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (e) => {
    console.log('Textarea Change:', e.target.value);
    setFormData((prev) => ({ ...prev, ticketDescription: e.target.value }));
  };

  const handleSubmit = () => {
    let valid = true;

    if (!formData.email.trim()) {
      setEmailError('Email address is required');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!formData.ticketName.trim()) {
      setNameError('Please input a title');
      valid = false;
    } else {
      setNameError('');
    }
    if (!formData.ticketDescription.trim()) {
      setDescriptionError('Please input a description');
      valid = false;
    } else {
      setDescriptionError('');
    }
    if (valid) {
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
          style={{ width: '65%' }}
          required
        />
        {nameError && <small className={styles.errorText}>{nameError}</small>}
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="ticketDescription">Problem Description:</label>
        <InputTextarea
          id="ticketDescription"
          name="ticketDescription"
          value={formData.ticketDescription}
          onChange={handleTextareaChange}
          style={{ height: '180px', width: '65%' }}
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
          style={{ width: '65%' }}
          required
        />
        {emailError && <small className={styles.errorText}>{emailError}</small>}
      </div>

      <div className={styles.buttonContainer}>
        <Button
          label="Add A Screenshot"
          rounded
          type="button"
          onClick={addDocument}
          size="small"
        />
      </div>
      {formData.documents.map((document, index) => (
        <div key={index}>
          <div className={styles.cardRow}>
            <label>Document Title</label>
            <InputText
              name={`documentName-${index}`}
              value={document.documentName}
              onChange={handleDocumentChange(index, 'documentName')}
              style={{ width: '65%' }}
              readOnly={document.mandatory}
            />
          </div>
          <div className={styles.cardRow}>
            <label>Document Link</label>
            <input
              type="file"
              id={`documentFile-${index}`}
              onChange={(e) => handleFileChange(e, index)}
            />
          </div>

          {document.documentLink && (
            <div className={styles.cardRow}>
              <label>File</label>
              <Button
                type="button"
                icon="pi pi-file-pdf"
                onClick={(e) => {
                  e.stopPropagation(); // This stops the event from propagating up
                  window.open(document.documentLink, '_blank');
                }}
                className="p-button-rounded p-button-danger"
                aria-label="Open PDF"
              />
            </div>
          )}

          {!document.mandatory && (
            <div className={styles.cardRow}>
              <Button
                type="button"
                label="Remove"
                rounded
                severity="danger"
                size="small"
                onClick={() => removeDocument(index)}
              />
            </div>
          )}
        </div>
      ))}

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
