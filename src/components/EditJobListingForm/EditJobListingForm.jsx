import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import styles from './page.module.css';

const EditJobListingForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    overview: initialData?.overview || '',
    responsibilities: initialData?.responsibilities || '',
    requirements: initialData?.requirements || '',
    requiredDocuments: Array.isArray(initialData?.requiredDocuments)
      ? initialData?.requiredDocuments
      : typeof initialData?.requiredDocuments === 'string'
      ? initialData?.requiredDocuments.split(',')
      : [],
    // otherCertifications: initialData?.otherCertifications || '',
    jobLocation: initialData?.jobLocation || '',
    averageSalary: initialData?.averageSalary || null,
    jobStartDate: initialData?.jobStartDate || null,
  });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const documentOptions = [
    { label: 'Resume', value: 'Resume' },
    {
      label: 'Early Childhood Graduation Cert',
      value: 'Early Childhood Graduation Cert',
    },
    {
      label: 'English Language Proficiency Cert',
      value: 'English Language Proficiency Cert',
    },
    {
      label: 'Chinese Language Proficiency Cert',
      value: 'Chinese Language Proficiency Cert',
    },
    {
      label: 'Malay Language Proficiency Cert',
      value: 'Malay Language Proficiency Cert',
    },
    {
      label: 'Tamil Language Proficiency Cert',
      value: 'Tamil Language Proficiency Cert',
    },
    {
      label: 'L1 Level Cert',
      value: 'L1 Level Cert',
    },
    {
      label: 'L2 Level Cert',
      value: 'L2 Level Cert',
    },
    {
      label: 'EY1 Level Cert',
      value: 'EY1 Level Cert',
    },
    {
      label: 'EY1 Level Cert',
      value: 'EY1 Level Cert',
    },
  ];

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
        <label htmlFor="requiredDocuments">Required Documents:</label>
        <MultiSelect
          id="requiredDocuments"
          name="requiredDocuments"
          value={formData.requiredDocuments}
          options={documentOptions}
          onChange={handleInputChange}
          placeholder="Select"
          filter
        />
      </div>

      {/* {formData.requiredDocuments.includes('Other Certifications') && (
        <div className={styles.cardRow}>
          <label htmlFor="otherCertifications">Please Specify:</label>
          <InputText
            id="otherCertifications"
            name="otherCertifications"
            value={formData.otherCertifications}
            onChange={handleInputChange}
          />
        </div>
      )} */}

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
        <Button label="Save Changes" rounded onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default EditJobListingForm;
