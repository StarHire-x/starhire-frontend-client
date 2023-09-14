import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/lara-light-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const EditJobListingForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    jobLocation: initialData?.jobLocation || '',
    averageSalary: initialData?.averageSalary || null,
    jobStartDate: initialData?.jobStartDate || null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onSave) onSave(formData);
  };

  return (
    <div>
      <h3>Edit Job Listing</h3>
      <div className="p-field">
        <label htmlFor="title">Title:</label>
        <InputText
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>

      <div className="p-field">
        <label htmlFor="description">Description:</label>
        <InputText
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="p-field">
        <label htmlFor="jobLocation">Job Location:</label>
        <InputText
          id="jobLocation"
          name="jobLocation"
          value={formData.jobLocation}
          onChange={handleInputChange}
        />
      </div>

      <div className="p-field">
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

      <div className="p-field">
        <label htmlFor="jobStartDate">Job Start Date:</label>
        <Calendar
          id="jobStartDate"
          name="jobStartDate"
          value={formData.jobStartDate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, jobStartDate: e.value }))
          }
        />
      </div>
      <div>
        <Button label="Save Changes" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default EditJobListingForm;
