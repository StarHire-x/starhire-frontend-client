import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import styles from './page.module.css';
import { InputTextarea } from 'primereact/inputtextarea';

const CreateJobListingForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    responsibilities: '',
    requirements: '',
    jobLocation: '',
    averageSalary: null,
    jobStartDate: null,
    jobListingStatus: 'Unverified', // default status
    // corporateId will be set during API call
  });

  // const jobListingStatuses = ['Active', 'Unverified', 'Inactive'];

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
        <label>Title:</label>
        <InputText
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="overview">Job Overview:</label>
        <InputTextarea
          id="overview"
          name="overview"
          value={formData.overview}
          onChange={handleInputChange}
          rows={5} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="responsibilities">Job Responsibilities:</label>
        <InputTextarea
          id="responsibilities"
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleInputChange}
          rows={7} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Job Requirements:</label>
        <InputTextarea
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleInputChange}
          rows={7} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="jobLocation">Job Location:</label>
        <InputText
          id="jobLocation"
          name="jobLocation"
          value={formData.jobLocation}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="averageSalary">Average Salary:</label>
        <InputNumber
          id="averageSalary"
          name="averageSalary"
          value={formData.averageSalary}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, averageSalary: e.value }))
          }
          mode="currency"
          currency="SGD"
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="jobStartDate">Job Start Date:</label>
        <Calendar
          id="jobStartDate"
          name="jobStartDate"
          value={formData.jobStartDate}
          minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // set minimum date to tomorrow
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, jobStartDate: e.value }))
          }
        />
      </div>

      <div className={styles.cardFooter}>
        <Button label="Create" rounded onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateJobListingForm;
