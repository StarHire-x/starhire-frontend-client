import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import styles from './page.module.css';
import { InputTextarea } from 'primereact/inputtextarea';

const EditJobListingForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    jobLocation: initialData?.jobLocation || '',
    averageSalary: initialData?.averageSalary || null,
    jobStartDate: initialData?.jobStartDate || null,
  });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleInputChange = (e, nameOverride) => {
    let name, value;

    if (nameOverride) {
      // Handling special cases where only the value is passed along with a name
      name = nameOverride;
      value = e;
    } else if (e && e.target) {
      // Handling standard HTML input elements
      name = e.target.name;
      value = e.target.value;
    } else if (e && e.value !== undefined && e.originalEvent) {
      // Handling calendar events
      name = e.originalEvent.target.name;
      value = e.value;
    }

    if (name && value !== undefined) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      console.warn('Name or value is missing', e);
    }
  };

  const handleSubmit = () => {
    if (onSave) onSave(formData);
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
        <label htmlFor="description">Description:</label>
        <InputTextarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={10} /* Adjust as needed */
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
          onChange={(e) => handleInputChange(e.value, 'averageSalary')}
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
          minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div className={styles.cardFooter}>
        <Button label="Save Changes" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default EditJobListingForm;
