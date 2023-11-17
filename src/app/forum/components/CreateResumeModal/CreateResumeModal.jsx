import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { getJobSeekerInformation, updateUser } from '@/app/api/auth/user/route';
import { generateResume } from '@/app/api/upload/route';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import styles from './CreateResumeModal.module.css';

const CreateResumeModal = ({ accessToken, userId, roleRef }) => {
  const toast = useRef(null);

  const cardHeader = () => {
    return (
      <h2 className={styles.cardHeader}>
        Simply Fill In These Details to Generate Your Resume!
      </h2>
    );
  };

  const [jobSeekerData, setJobSeekerData] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const toggleConfirmDialog = () => {
    setShowConfirmDialog(!showConfirmDialog);
  };

  const confirmCreateResume = (e) => {
    createResume(e);
    toggleConfirmDialog();
  };

  const handleCreateResumeClick = (e) => {
    e.preventDefault();
    toggleConfirmDialog();
  };

  const createResume = async (e) => {
    e.preventDefault();

    try {
      console.log(JSON.stringify(jobSeekerData));
      const resumeUrl = await generateResume(jobSeekerData, accessToken);

      console.log(resumeUrl);

      const updateUserDetails = {
        role: roleRef,
        resumePdf: resumeUrl.url,
      };

      const response = await updateUser(updateUserDetails, userId, accessToken);

      if (response) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Resume created successfully!',
          life: 5000,
        });
      }
    } catch (error) {
      console.log('Failed to create resume');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
  };

  const totalCheckboxes = 10; // Total number of checkboxes
  const checkedCount = [
    jobSeekerData.fullName,
    jobSeekerData.contactNo,
    jobSeekerData.email,
    jobSeekerData.instituteName,
    jobSeekerData.dateOfGraduation,
    jobSeekerData.highestEducationStatus,
    jobSeekerData.proficientLanguages,
    jobSeekerData.experience,
    jobSeekerData.certifications,
    jobSeekerData.jobExperiences && jobSeekerData.jobExperiences.length > 0,
  ].filter(Boolean).length; // This will count how many of these are truthy (checked)

  const progressPercentage = (checkedCount / totalCheckboxes) * 100;

  useEffect(() => {
    const fetchData = async () => {
      const information = await getJobSeekerInformation(userId, accessToken);
      setJobSeekerData(information);
    };

    fetchData();
  }, [accessToken, userId]);

  return (
    <div className={styles.mainContainer}>
      <Toast ref={toast} />
      <Card className={styles.card} header={cardHeader}>
        <div className={styles.content}>
          <h3> Resume Completion Status</h3>
          <ProgressBar
            className={styles.progressBar}
            value={progressPercentage}
          ></ProgressBar>
          <br />
          <h3>Personal Particulars</h3>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox1"
              name="fullName"
              className={styles.box}
              checked={jobSeekerData.fullName !== ''}
            />
            <label htmlFor="checkBox1" className="ml-2">
              Full Name
            </label>
          </div>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox2"
              name="contactNo"
              className={styles.box}
              checked={jobSeekerData.contactNo !== ''}
            />
            <label htmlFor="checkBox2" className="ml-2">
              Contact Number
            </label>
          </div>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox3"
              name="email"
              className={styles.box}
              checked={jobSeekerData.email !== ''}
            />
            <label htmlFor="checkBox3" className="ml-2">
              Email Address
            </label>
          </div>
          <br />
          <h3>Education Details</h3>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox4"
              name="contactNo"
              className={styles.box}
              checked={jobSeekerData.instituteName !== ''}
            />
            <label htmlFor="checkBox4" className="ml-2">
              Name of Institution
            </label>
          </div>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox5"
              name="dateOfGraduation"
              className={styles.box}
              checked={jobSeekerData.dateOfGraduation !== null}
            />
            <label htmlFor="checkBox5" className="ml-2">
              Date of Graduation
            </label>
          </div>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox6"
              name="highestEducationStatus"
              className={styles.box}
              checked={jobSeekerData.highestEducationStatus !== ''}
            />
            <label htmlFor="checkBox6" className="ml-2">
              Highest Education Status
            </label>
          </div>
          <br />
          <h3>Skills and Professional Certificates</h3>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox7"
              name="proficientLanguages"
              className={styles.box}
              checked={jobSeekerData.proficientLanguages !== ''}
            />
            <label htmlFor="checkBox7" className="ml-2">
              Proficient Languages
            </label>
          </div>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox8"
              name="experience"
              className={styles.box}
              checked={jobSeekerData.experience !== ''}
            />
            <label htmlFor="checkBox8" className="ml-2">
              Teaching Experience
            </label>
          </div>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox9"
              name="certifications"
              className={styles.box}
              checked={jobSeekerData.certifications !== ''}
            />
            <label htmlFor="checkBox9" className="ml-2">
              Certifications
            </label>
          </div>
          <br />
          <h3>Work Experiences</h3>
          <div className={styles.flex}>
            <Checkbox
              inputId="checkBox7"
              name="proficientLanguages"
              className={styles.box}
              checked={
                jobSeekerData.jobExperiences &&
                jobSeekerData.jobExperiences.length > 0
              }
            />
            <label htmlFor="checkBox7" className="ml-2">
              1 or more work experience
            </label>
          </div>
        </div>
        <br />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            label="Generate!"
            className={styles.generateButton}
            severity="success"
            raised
            onClick={handleCreateResumeClick}
          />
        </div>
      </Card>
      <Dialog
        visible={showConfirmDialog}
        onHide={toggleConfirmDialog}
        header="Confirm Resume Creation"
        modal
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={toggleConfirmDialog}
              className="p-button-text"
            />
            <Button
              label="Confirm"
              icon="pi pi-check"
              onClick={confirmCreateResume}
              autoFocus
            />
          </div>
        }
      >
        <p>
          Please confirm if you wish to proceed with generating a new resume.
        </p>
        <p>Your action will overwrite your existing resume.</p>
        <p>Do you want to continue?</p>
      </Dialog>
    </div>
  );
};

export default CreateResumeModal;
