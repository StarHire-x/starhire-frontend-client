import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./jobStatisticsModal.module.css";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import {
  getACorporateJobListingBreakdown,
  getCorporateJobListingStats,
} from "@/app/api/auth/user/route";

const JobStatisticsModal = ({ accessToken, userId }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const [chartData1, setChartData1] = useState({});
  const [chartOptions1, setChartOptions1] = useState({});

  const [selectedFilter, setSelectedFilter] = useState("week");
  const filterOptions = [
    { label: "Month", value: "month" },
    { label: "Week", value: "week" },
    { label: "Day", value: "day" },
  ];
  const [corporatePercentage, setCorporatePercentage] = useState({});
  const [corporateNumber, setCorporateNumber] = useState({}) 

  useEffect(() => {
    const fetchData = async () => {
      const documentStyle = getComputedStyle(document.documentElement);

      const fetchBreakdown = async () => {
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
          "--text-color-secondary"
        );
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border");

        const information = await getCorporateJobListingStats(
          userId,
          accessToken
        );

        const data = {
          labels: information[selectedFilter].labels,
          datasets: [
            {
              label: "Job Listings",
              borderColor: documentStyle.getPropertyValue("--blue-500"),
              tension: 0.4,
              fill: false,
              data: information[selectedFilter].data,
            },
          ],
        };

        const options = {
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
              },
            },
            y: {
              ticks: {
                stepSize: 1,
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
              },
              beginAtZero: true, // ensures the scale starts at 0
              min: 0,
            },
          },
        };

        setChartData(data);
        setChartOptions(options);
      };
      fetchBreakdown();
    };

    fetchData();
  }, [accessToken, userId, selectedFilter]);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);

    const fetchBreakdown = async () => {
      const breakdownInfo = await getACorporateJobListingBreakdown(
        userId,
        accessToken
      );

      const approvedData = breakdownInfo.approved;
      const rejectedData = breakdownInfo.rejected;
      const unverifiedData = breakdownInfo.unverified;
      const archivedData = breakdownInfo.archived;

      const sum = approvedData + rejectedData + unverifiedData + archivedData;

      const approvedDataPercentage =
        sum > 0 ? Number(((approvedData / sum) * 100).toFixed(2)) : 0;
      const rejectedDataPercentage =
        sum > 0 ? Number(((rejectedData / sum) * 100).toFixed(2)) : 0;
      const unverifiedDataPercentage =
        sum > 0 ? Number(((unverifiedData / sum) * 100).toFixed(2)) : 0;
      const archivedDataPercentage =
        sum > 0 ? Number(((archivedData / sum) * 100).toFixed(2)) : 0;

      setCorporatePercentage({
        total: sum,
        approved: approvedDataPercentage,
        rejected: rejectedDataPercentage,
        unverified: unverifiedDataPercentage,
        archived: archivedDataPercentage,
      });
      setCorporateNumber({
        total: sum,
        approved: approvedData,
        rejected: rejectedData,
        unverified: unverifiedData,
        archived: archivedData,
      })
      const data = {
        labels: ["Approved", "Rejected", "Unverified", "Archived"],
        datasets: [
          {
            data: [approvedData, rejectedData, unverifiedData, archivedData],
            backgroundColor: [
              documentStyle.getPropertyValue("--blue-500"),
              documentStyle.getPropertyValue("--red-500"),
              documentStyle.getPropertyValue("--orange-500"),
              documentStyle.getPropertyValue("--gray-500"),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue("--blue-400"),
              documentStyle.getPropertyValue("--red-400"),
              documentStyle.getPropertyValue("--orange-400"),
              documentStyle.getPropertyValue("--gray-400"),
            ],
          },
        ],
      };
      const options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      };

      setChartData1(data);
      setChartOptions1(options);
    };

    fetchBreakdown();
  }, [accessToken, userId]);

  const cardHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div></div>
        <div></div>
        <h2 className={styles.cardHeader}>Number of Job Listings</h2>
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

  const cardHeader1 = () => {
    return (
      <div>
        <h2 className={styles.card1Title}>Job Listing Overview</h2>
      </div>
    );
  };

  return (
    <div className={styles.graphContainer}>
      <Card className={styles.customCardGraph} header={cardHeader}>
        <Chart type="line" data={chartData} options={chartOptions} />
      </Card>
      <Card className={styles.customCardGraph1} header={cardHeader1}>
        <div className={styles.filterContainer1}>
          <Chart
            type="pie"
            data={chartData1}
            options={chartOptions1}
            className={styles.doughnutChart}
          />
          <br />
          <div className={styles.filterColumn}>
            <h3 className={styles.card2Text}>
              Total: {corporatePercentage.total} listings
            </h3>
            <br />
            <p className={styles.card2Text}>
              Approved: {corporateNumber.approved}
            </p>
            <br />
            <p className={styles.card2Text}>
              Rejected: {corporateNumber.rejected}
            </p>
            <br />
            <p className={styles.card2Text}>
              Unverified: {corporateNumber.unverified}
            </p>
            <br />
            <p className={styles.card2Text}>
              Archived: {corporateNumber.archived}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobStatisticsModal;
