import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import HumanIcon from "../../../public/icon.png";
import styles from "./jobApplicationModal.module.css";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import Enums from "@/common/enums/enums";
import { Tag } from "primereact/tag";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchData } from "next-auth/client/_utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/navigation";
import { TabMenu } from "primereact/tabmenu";
import { getCorporateJobApplicationStatistics } from "@/app/api/auth/user/route";

const JobApplicationModal = ({ accessToken, userId }) => {

  const [overallStats, setOverallStats] = useState({});

  const [jobApplications, setJobApplications] = useState([]);
  const router = useRouter();

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filterOptions, setFilterOptions] = useState([
    {
      label: "Select a job Listing",
      value: "All",
    },
  ]);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const tabs = [
    { label: "All", icon: "pi pi-fw pi-user" },
    { label: "Processing", icon: "pi pi-fw pi-thumbs-up" },
    {
      label: "Waiting for Interview",
      icon: "pi pi-fw pi-stop-circle",
    },
  ];

  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const information = await getCorporateJobApplicationStatistics(
          userId,
          accessToken
        );

        let corporateOptions = information.formatResponse.map((label) => ({
          label: label.jobListingTitle,
          value: label.jobListingId,
        }));

        setFilterOptions([
          {
            label: "Select a job Listing",
            value: "All",
          },
          ...corporateOptions,
        ]);

        if (selectedFilter) {
          await filterData(information);
        }
      } catch (error) {
        console.error("An error occurred while fetching the data", error);
      }
    };

    const computeOverallStats = (applicationsArray) => {
      let stats = {
        Total: applicationsArray.length,
        Submitted: 0,
        Processing: 0,
        To_Be_Submitted: 0,
        Waiting_For_Interview: 0,
        Offer_Rejected: 0,
        Offer_Accepted: 0,
        Rejected: 0,
        Offered: 0,
      };

      for (let application of applicationsArray) {
        if (stats[application.jobApplicationStatus] !== undefined) {
          stats[application.jobApplicationStatus]++;
        }
      }

      return stats;
    };

    const filterData = async (information) => {
      const filteredData = information.formatResponse.filter(
        (item) => item.jobListingId === selectedFilter
      );

      // Check if filteredData has elements and access jobApplications from the first element
      const jobApplicationsArray =
        filteredData.length > 0 ? filteredData[0].jobApplications : [];

      // Compute statistics for this set of job applications
      const computedStats = computeOverallStats(jobApplicationsArray);

      // Update overallStats state
      setOverallStats(computedStats);

      const filteredInformation = jobApplicationsArray.filter((item) =>
        ["Processing", "Waiting_For_Interview"].includes(
          item.jobApplicationStatus
        )
      );

      console.log(filteredInformation);

      if (currentTab === 0) {
        setJobApplications(filteredInformation);
      } else if (currentTab === 1) {
        setJobApplications(
          filteredInformation.filter(
            (application) => application.jobApplicationStatus === "Processing"
          )
        );
      } else if (currentTab === 2) {
        setJobApplications(
          filteredInformation.filter(
            (application) =>
              application.jobApplicationStatus === "Waiting_For_Interview"
          )
        );
      }
    };

    fetchData();
  }, [accessToken, userId, currentTab, selectedFilter]);

  const header = () => {
    return renderRecruiterHeader();
  };

  const cardHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: "10px 10px 10px 10px" }}>
          Job Application Analytics for Job Listing Id {selectedFilter}
        </h2>
        <Dropdown
          style={{ margin: "10px 10px 10px 10px" }}
          value={selectedFilter}
          options={filterOptions}
          onChange={(e) => setSelectedFilter(e.value)}
          placeholder="Select timespan"
        />
      </div>
    );
  };

  const renderRecruiterHeader = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="m-0">
            Job Application - Action Required
          </h2>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </span>
        </div>
        <TabMenu
          className={styles.tabMenu}
          model={tabs}
          onTabChange={(e) => setCurrentTab(e.index)}
          activeIndex={currentTab}
        />
      </div>
    );
  };

  const jobSeekerBodyTemplate = (rowData) => {
    const userName = rowData.jobSeekerName;
    const avatar = rowData.jobSeekerProfilePic;

    return (
      <div className={styles.imageContainer}>
        {avatar !== "" ? (
          <img
            alt={avatar}
            src={avatar}
            className={styles.avatarImageContainer}
          />
        ) : (
          <Image
            src={HumanIcon}
            alt="Icon"
            className={styles.avatarImageContainer}
          />
        )}
        <span>{userName}</span>
      </div>
    );
  };

  const recruiterBodyTemplate = (rowData) => {
    const userName = rowData.recruiterName;
    const avatar = rowData.recruiterProfilePic;

    return (
      <div className={styles.imageContainer}>
        {avatar !== "" ? (
          <img
            alt={avatar}
            src={avatar}
            className={styles.avatarImageContainer}
          />
        ) : (
          <Image
            src={HumanIcon}
            alt="Icon"
            className={styles.avatarImageContainer}
          />
        )}
        <span>{userName}</span>
      </div>
    );
  };

  const viewDetailsBodyTemplate = (rowData) => {
    const jobApplicationId = rowData.jobApplicationId;
    return (
      <Button
        rounded
        outlined
        severity="help"
        icon="pi pi-align-justify"
        onClick={() => {
          router.push(
            `/jobListingManagement/viewAllMyJobListings/viewJobApplicationDetails?id=${jobApplicationId}`
          );
        }}
      />
    );
  };

  const getStatus = (status) => {
    switch (status) {
      case Enums.PROCESSING:
        return "success";
      case Enums.WAITINGFORINTERVIEW:
        return "info";
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.jobApplicationStatus}
        severity={getStatus(rowData.jobApplicationStatus)}
      />
    );
  };

  return (
    <div className={styles.mainContainer}>
      <Card className={styles.customCardGraph} header={cardHeader}>
        <div className={styles.layout}>
          <div className={styles.cardColumnLeft}>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h1>{overallStats.Total}</h1>
                <h4>Total Application</h4>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h1>{overallStats.Submitted}</h1>
                <h4>Submitted</h4>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h1>{overallStats.To_Be_Submitted}</h1>
                <h4>To be Submitted</h4>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h1>{overallStats.Processing}</h1>
                <h4>Processing</h4>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h1>{overallStats.Waiting_For_Interview}</h1>
                <h4>Waiting for Interview</h4>
              </div>
            </Card>
          </div>
          <div className={styles.cardColumnRight}>
            <DataTable
              header={header}
              value={jobApplications}
              showGridlines
              filters={filters}
              globalFilterFields={[
                "jobApplicationId",
                "jobSeekerName",
                "recrutierName",
              ]}
              tableStyle={{ minWidth: "65rem" }}
              rows={4}
              paginator
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              emptyMessage="No job assignments found."
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
              <Column
                field="jobApplicationId"
                header="Id"
                style={{ textAlign: "center", verticalAlign: "middle" }}
                sortable
              ></Column>
              <Column
                field="jobSeekerName"
                header="Job Seeker"
                sortable
                body={jobSeekerBodyTemplate}
              ></Column>
              <Column
                field="recrutierName"
                header="Recruiter"
                sortable
                body={recruiterBodyTemplate}
              ></Column>
              <Column
                field="jobApplicationStatus"
                header="Status"
                style={{ textAlign: "center", verticalAlign: "middle" }}
                sortable
                body={statusBodyTemplate}
              ></Column>
              <Column
                exportable={false}
                style={{ minWidth: "1rem" }}
                header="Actions"
                body={viewDetailsBodyTemplate}
              ></Column>
            </DataTable>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobApplicationModal;
