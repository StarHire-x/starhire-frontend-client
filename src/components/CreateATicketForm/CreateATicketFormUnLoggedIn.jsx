import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
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

  const stripHtmlTags = (str) => {
    if (str === null || str === '') return '';
    else str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  };

  const handleEditorTextChange = (e) => {
    console.log('Editor Text Change:', e.htmlValue);
    const plainText = stripHtmlTags(e.htmlValue);
    setFormData((prev) => ({ ...prev, ticketDescription: plainText }));
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

      <Panel header="Documents" toggleable>
        <div className={styles.buttonContainer}>
          <Button
            label="Add More Documents"
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
          </div>
        ))}
      </Panel>

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
