import React, { useState } from "react";
import styles from "./createJobApplicationForm.module.css";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Panel } from "primereact/panel";
import { uploadFile } from "@/app/api/auth/upload/route";

const CreateJobApplicationForm = ({
  formData,
  setFormData,
  addJobApplication,
  formErrors,
  setFormErrors,
  accessToken,
}) => {
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
        { documentName: "", documentLink: "" },
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
      const response = await uploadFile(file, accessToken);

      // Update the specific document's link in the formData
      const newDocuments = [...formData.documents];
      newDocuments[index].documentLink = response.url;
      setFormData((prevState) => ({ ...prevState, documents: newDocuments }));
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={addJobApplication}>
        <div className={styles.cardBody}>
          <div className={styles.cardRow}>
            <label>Available Start Date:</label>
            <Calendar
              id="availableStartDate"
              name="availableStartDate"
              value={formData?.availableStartDate}
              dateFormat="dd/mm/yy"
              minDate={new Date(new Date().setDate(new Date().getDate()))}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availableStartDate: e.value,
                }))
              }
            />
          </div>

          {formErrors.availableEndDate && (
            <small className={styles.errorMessage}>
              {formErrors.availableEndDate}
            </small>
          )}

          <div className={styles.cardRow}>
            <label>Available End Date:</label>
            <Calendar
              id="availableEndDate"
              name="availableEndDate"
              value={formData?.availableEndDate}
              dateFormat="dd/mm/yy"
              onChange={(e) => {
                if (e.value <= formData.availableStartDate) {
                  setFormErrors((prev) => ({
                    ...prev,
                    availableEndDate: "End date must be after start date.",
                  }));
                } else {
                  setFormErrors((prev) => {
                    const { availableEndDate, ...rest } = prev;
                    return rest;
                  });
                }
                setFormData((prev) => ({
                  ...prev,
                  availableEndDate: e.value,
                }));
              }}
            />
          </div>
          <Panel header="Documents" toggleable>
            <div className={styles.buttonContainer}>
              <Button
                label="Add Document"
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
                    onChange={handleDocumentChange(index, "documentName")}
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
                <div className={styles.field}>
                  <label>AWS S3 Link</label>
                  <input
                    type="url"
                    id={`documentLink-${index}`}
                    name={`documentLink-${index}`}
                    value={document.documentLink}
                    onChange={handleDocumentChange(index, "documentLink")}
                  />
                </div>
                {formData.documents.length > 1 && (
                  <div className={styles.buttonContainer}>
                    <Button
                      type="button"
                      label="Remove"
                      severity="danger"
                      size="small"
                      onClick={() => removeDocument(index)}
                    />
                  </div>
                )}
              </div>
            ))}
          </Panel>
        </div>
        <div className={styles.buttonContainer}>
          <Button label="Create Job Application" severity="success" raised />
        </div>
      </form>
    </div>
  );
};

export default CreateJobApplicationForm;
