import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/lara-light-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const CreateJobListingForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    jobLocation: '',
    description: '',
    averageSalary: null,
    jobStartDate: null,
    jobListingStatus: 'Unverified', // default status
    // corporateId will be set during API call
  });

  const jobListingStatuses = ['Active', 'Unverified', 'Inactive'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onCreate) onCreate(formData);
  };

  return (
    <div>
      <h3>Create Job Listing</h3>
      <div>
        <label>Title:</label>
        <InputText
          name="title"
          value={formData.title}
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
        <label htmlFor="description">Description:</label>
        <InputText
          id="description"
          name="description"
          value={formData.description}
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
          currency="USD"
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
        <Button label="Create" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateJobListingForm;
