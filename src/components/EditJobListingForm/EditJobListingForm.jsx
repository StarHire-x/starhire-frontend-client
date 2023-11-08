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
    description: initialData?.description || '',
    experienceRequired: initialData?.experienceRequired || '',
    address: initialData?.address || '',
    postalCode: initialData?.postalCode || '',
    jobStartDate: initialData?.jobStartDate || null,
    payRange: initialData?.payRange || '',
    jobType: initialData?.jobType || '',
    schedule: initialData?.schedule || '',
    supplementalPay: initialData.supplementalPay || '',
    otherBenefits: initialData.otherBenefits || '',
    certificationsRequired: initialData.certificationsRequired || '',
    typeOfWorkers: initialData.typeOfWorkers || '',
    requiredLanguages: initialData.requiredLanguages || '',
    otherConsiderations: initialData.otherConsiderations || ''
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
      label: 'EY2 Level Cert',
      value: 'EY2 Level Cert',
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
        <label htmlFor="overview">Job Description:</label>
        <InputTextarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="responsibilities">Experience Required:</label>
        <InputTextarea
          id="experienceRequired"
          name="experienceRequired"
          value={formData.experienceRequired}
          onChange={handleInputChange}
          rows={3} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Address:</label>
        <InputTextarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Postal Code:</label>
        <InputTextarea
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
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

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Pay Range:</label>
        <InputTextarea
          id="payRange"
          name="payRange"
          value={formData.payRange}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Job Type:</label>
        <InputTextarea
          id="jobType"
          name="jobType"
          value={formData.jobType}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Schedule:</label>
        <InputTextarea
          id="schedule"
          name="schedule"
          value={formData.schedule}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Supplemental Pay:</label>
        <InputTextarea
          id="supplementalPay"
          name="supplementalPay"
          value={formData.supplementalPay}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Other Benefits:</label>
        <InputTextarea
          id="otherBenefits"
          name="otherBenefits"
          value={formData.otherBenefits}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Certifications Required:</label>
        <InputTextarea
          id="certificationsRequired"
          name="certificationsRequired"
          value={formData.certificationsRequired}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Type Of Workers:</label>
        <InputTextarea
          id="typeOfWorkers"
          name="typeOfWorkers"
          value={formData.typeOfWorkers}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Required Languages:</label>
        <InputTextarea
          id="requiredLanguages"
          name="requiredLanguages"
          value={formData.requiredLanguages}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
          autoResize={true} /* If you want it to resize automatically */
        />
      </div>

      <div className={styles.cardRow}>
        <label htmlFor="requirements">Other Considerations:</label>
        <InputTextarea
          id="otherConsiderations"
          name="otherConsiderations"
          value={formData.otherConsiderations}
          onChange={handleInputChange}
          rows={1} /* Adjust as needed */
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



      <div className={styles.cardFooter}>
        <Button label="Save Changes" rounded onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default EditJobListingForm;
