import styles from './editJobApplicationForm.module.css';
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { uploadFile } from "@/app/api/upload/route";
import { viewJobApplicationDetails } from '@/app/api/jobApplication/route';

const EditJobApplicationForm = ({
  formData,
  setFormData,
  accessToken,
  editJobApplication,
  formErrors,
  setFormErrors,
  selectedJobApplicationData,
}) => {
  useEffect(() => {
    if (selectedJobApplicationData) {
      viewJobApplicationDetails(
        selectedJobApplicationData.jobApplicationId,
        accessToken
      )
        .then((data) => {
          setFormData({
            jobApplicationId: data.jobApplicationId,
            jobApplicationStatus: data.jobApplicationStatus,
            availableStartDate: new Date(data.availableStartDate),
            availableEndDate: formatDate(new Date(data.availableEndDate)) !== "01/01/1970" ? new Date(data.availableEndDate) : "",
            submissionDate: data.submissionDate,
            remarks: data.remarks,
            documents: data.documents,
          });
        })
        .catch((error) => {
          console.log("Failed to fetch job application details");
        });
    }
  }, [selectedJobApplicationData]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

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
      <form className={styles.form} onSubmit={editJobApplication}>
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
          <div className={styles.cardRow}>
            <label>Remarks:</label>
            <InputTextarea
              id="remarks"
              name="remarks"
              value={formData?.remarks}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
              rows={7}
            />
          </div>
          <Panel header="Documents" toggleable>
            <div className={styles.buttonContainer}>
              <Button
                label="Add Document"
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
                {document.documentLink && (
                  <div className={styles.cardRow}>
                    <label>File</label>
                    <Button
                      type="button"
                      icon="pi pi-file-pdf"
                      onClick={(e) => {
                        e.stopPropagation(); // This stops the event from propagating up
                        window.open(document.documentLink, "_blank");
                      }}
                      className="p-button-rounded p-button-danger"
                      aria-label="Open PDF"
                    />
                  </div>
                )}
                {/* <div className={styles.cardRow}>
                  <label>AWS S3 Link</label>
                  <input
                    type="url"
                    id={`documentLink-${index}`}
                    name={`documentLink-${index}`}
                    value={document.documentLink}
                    onChange={handleDocumentChange(index, 'documentLink')}
                    readOnly
                  />
                </div> */}
                {formData.documents.length > 1 && (
                  <div className={styles.buttonContainer}>
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
          </Panel>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            label="Submit Job Application"
            rounded
            severity="success"
            raised
          />
        </div>
      </form>
    </div>
  );
};

export default EditJobApplicationForm;