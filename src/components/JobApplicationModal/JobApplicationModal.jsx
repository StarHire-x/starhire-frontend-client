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

  const [selectedFilter, setSelectedFilter] = useState("All Job Listings");
  const [filterOptions, setFilterOptions] = useState([
    {
      label: "All Job Listings",
      value: "All Job Listings",
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
    { label: "Processing", icon: "pi pi-fw pi-eye" },
    {
      label: "Waiting for Interview",
      icon: "pi pi-fw pi-stop-circle",
    },
    {
      label: "Offered",
      icon: "pi pi-fw pi-exclamation-circle",
    },
    {
      label: "Rejected",
      icon: "pi pi-fw pi-trash",
    },
    {
      label: "Offer Accepted",
      icon: "pi pi-fw pi-thumbs-up",
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
            label: "All Job Listings",
            value: "All Job Listings",
          },
          ...corporateOptions,
        ]);

        console.log(filterOptions);

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
      let computedStats;
      let filteredData;
      let jobApplicationsArray;

      if(selectedFilter === "All Job Listings") {
        filteredData = information.formatResponse.flatMap(
          (item) => item.jobApplications
        );
  
        jobApplicationsArray =
          filteredData.length > 0 ? filteredData : [];

        computedStats = computeOverallStats(jobApplicationsArray);
      } else {
        filteredData = information.formatResponse.filter(
          (item) => item.jobListingId === selectedFilter
        );

        jobApplicationsArray =
          filteredData.length > 0 ? filteredData[0].jobApplications : [];

        computedStats = computeOverallStats(
          jobApplicationsArray
        );
      }

      // Update overallStats state
      setOverallStats(computedStats);

      const filteredInformation = jobApplicationsArray.filter((item) =>
        ["Processing", "Waiting_For_Interview", "Offered", "Rejected", "Offer_Accepted"].includes(
          item.jobApplicationStatus
        )
      );

      // console.log(filteredInformation);

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
      } else if (currentTab === 3) {
        setJobApplications(
          filteredInformation.filter(
            (application) => application.jobApplicationStatus === "Offered"
          )
        );
      } else if (currentTab === 4) {
        setJobApplications(
          filteredInformation.filter(
            (application) => application.jobApplicationStatus === "Rejected"
          )
        );
      } else if (currentTab === 5) {
        setJobApplications(
          filteredInformation.filter(
            (application) =>
              application.jobApplicationStatus === "Offer_Accepted"
          )
        );
      }
    };

    fetchData();
  }, [accessToken, userId, currentTab, selectedFilter]);

  const header = () => {
    return (
      <div >
        <div className={styles.cardColumnRightHeader}
        >
          <div></div>
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

  const cardHeader = () => {
    return (
      <div className={styles.cardHeader}
      ><div></div>
      <div></div>
        <h2>
          Job Applications for Id:({selectedFilter})
        </h2>
        <Dropdown
          style={{ margin: "10px 10px 10px 10px" }}
          value={selectedFilter}
          options={filterOptions}
          onChange={(e) => setSelectedFilter(e.value)}
          placeholder="Select Job Listing"
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
                <h3>{overallStats.Total}</h3>
                <p>Total Application</p>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h3>{overallStats.Offer_Accepted}</h3>
                <p>Accepted Offer</p>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h3>{overallStats.Offered}</h3>
                <p>Offered</p>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h3>{overallStats.Waiting_For_Interview}</h3>
                <p>Waiting for Interview</p>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h3>{overallStats.Processing}</h3>
                <p>Processing</p>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h3>{overallStats.Submitted}</h3>
                <p>Submitted</p>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h3>{overallStats.To_Be_Submitted}</h3>
                <p>To be Submitted</p>
              </div>
            </Card>
            <Card className={styles.customCard}>
              <div className={styles.cardLayout}>
                <h3>{overallStats.Offer_Rejected + overallStats.Rejected}</h3>
                <p>Rejected</p>
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
              tableStyle={{ maxWidth: "65rem" }}
              rows={4}
              paginator
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              emptyMessage="No job application found."
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
              <Column
                field="jobApplicationId"
                header="Id"
                style={{
                  textAlign: "center",
                  verticalAlign: "middle",
                  width: "20px",
                }}
                sortable
              ></Column>
              <Column
                field="jobSeekerName"
                header="Job Seeker"
                sortable
                body={jobSeekerBodyTemplate}
                style={{ width: "50px" }}
              ></Column>
              <Column
                field="recruiterName"
                header="Recruiter"
                sortable
                body={recruiterBodyTemplate}
                style={{ width: "50px" }}
              ></Column>
              <Column
                field="jobApplicationStatus"
                header="Status"
                style={{
                  textAlign: "center",
                  verticalAlign: "middle",
                  width: "50px",
                }}
                sortable
                body={statusBodyTemplate}
              ></Column>
              <Column
                exportable={false}
                style={{ width: "10px", verticalAlign: "middle" }}
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
