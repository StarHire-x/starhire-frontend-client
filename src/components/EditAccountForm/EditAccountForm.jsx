import React from "react";
import styles from "./editAccountForm.module.css"
import { RadioButton } from "primereact/radiobutton";
import { Card } from "primereact/card";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";

const EditAccountForm = ({
  formData,
  handleInputChange,
  handleFileChange,
  saveChanges,
  session,
  removePdf,
}) => {
  return (
    <div className={styles.container}>
      <Card>
        <h1 className={styles.title}>My Account Details</h1>
        <form className={styles.form} onSubmit={saveChanges}>
          <div className={styles.avatarContainer}>
            {formData?.profilePictureUrl && (
              <img
                src={formData.profilePictureUrl}
                alt="User Profile"
                className={styles.avatar}
              />
            )}
          </div>

          <div className={styles.inputFields}>
            <div className={styles.field}>
              <label htmlFor="userName">
                User Name:
              </label>
              <InputText
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email Address:</label>
              <InputText
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="contactNo">Contact Number:</label>
              <InputNumber
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                useGrouping={false}
              />
            </div>
            {session.data.user.role === "Job_Seeker" && (
              <>
                <div className={styles.field}>
                  <label htmlFor="fullName">Full Name:</label>
                  <InputText
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="homeAddress">Home Address:</label>
                  <InputText
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="dateOfBirth">Date of Birth:</label>
                  <Calendar
                    id="dateOfBirth"
                    name="dateOfBirth"
                    dateFormat="dd/mm/yy"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="instituteName">Education Institution:</label>
                  <InputText
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="dateOfGraduation">Date of Graduation:</label>
                  <Calendar
                    id="dateOfGraduation"
                    name="dateOfGraduation"
                    dateFormat="dd/mm/yy"
                    value={formData.dateOfGraduation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.fileField}>
                  <label htmlFor="resumePdf">Upload Resume:</label>
                  <input
                    type="file"
                    id="resumePdf"
                    onChange={handleFileChange}
                  />
                  {formData?.resumePdf && (
                    <div className={styles.pdfButtons}>
                      <Button
                        type="button"
                        icon="pi pi-file-pdf"
                        onClick={(e) => {
                          e.stopPropagation(); // This stops the event from propagating up
                          window.open(formData.resumePdf, "_blank");
                        }}
                        className="p-button-rounded p-button-danger"
                        aria-label="Open PDF"
                      />
                      <Button
                        type="button"
                        label="X"
                        onClick={removePdf}
                        className={`p-button-rounded p-button-danger ${styles.smallButton}`}
                        aria-label="Remove PDF"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
            {session.data.user.role === "Corporate" && (
              <>
                <div className={styles.field}>
                  <label htmlFor="companyName">Company Name:</label>
                  <InputText
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="companyAddress">Company Address:</label>
                  <InputText
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
            {/* This is just to check the image link */}
            {/* <div className={styles.field}>
            <label htmlFor="profilePictureUrl">Profile Picture URL:</label>
            <input
              type="url"
              id="profilePictureUrl"
              name="profilePictureUrl"
              className={styles.input}
              value={formData.profilePictureUrl}
              onChange={handleInputChange}
            />
            </div> */}

            {/* <div className={styles.field}>
              <label htmlFor="resumePdf">Resume Pdf:</label>
              <input
                type="url"
                id="resumePdf"
                name="resumePdf"
                className={styles.input}
                value={formData.resumePdf}
                onChange={handleInputChange}
              />
            </div> */}
            <div className={styles.fileField}>
              <label htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                id="profilePicture"
                onChange={handleFileChange}
              />
            </div>

            <div className={styles.radioFields}>
              <div className={styles.radioHeader}>
                <p>Notifications</p>
              </div>
              <div className={styles.radioOption}>
                <RadioButton
                  inputId="Email"
                  name="notificationMode"
                  value="Email"
                  onChange={handleInputChange}
                  checked={formData.notificationMode === "Email"}
                />
                <label htmlFor="Email" className="ml-2">
                  Email
                </label>
                <br />
                <RadioButton
                  inputId="Sms"
                  name="notificationMode"
                  value="Sms"
                  onChange={handleInputChange}
                  checked={formData.notificationMode === "Sms"}
                />
                <label htmlFor="Sms" className="ml-2">
                  Sms
                </label>
              </div>
            </div>

            <div className={styles.radioFields}>
              <div className={styles.radioHeader}>
                <p>Status</p>
              </div>
              <div className={styles.radioOption}>
                <RadioButton
                  inputId="status"
                  name="status"
                  value="Active"
                  onChange={handleInputChange}
                  checked={formData.status === "Active"}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Active
                </label>
                <br />
                <RadioButton
                  inputId="status"
                  name="status"
                  value="Inactive"
                  onChange={handleInputChange}
                  checked={formData.status === "Inactive"}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Inactive
                </label>
              </div>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Button label="Save Changes" severity="success" raised />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditAccountForm;
