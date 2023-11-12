"use client";
import React from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import Link from "next/link";
import Enums from "@/common/enums/enums";
import JobStatisticsModal from "@/components/JobStatisticsModal/JobStatisticsModal";
import JobApplicationModal from "@/components/JobApplicationModal/JobApplicationModal";
import InvoiceStatisticsModal from "@/components/InvoiceStatisticsModal/InvoiceStatisticsModal";

const Dashboard = () => {
  const session = useSession();

  const router = useRouter();

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const userId =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

  const role =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.role;

  if (session.status === "loading") {
    return <ProgressSpinner />;
  }

  if (session.status === "unauthenticated") {
    router?.push("/login");
  }

  if (session.status === "authenticated") {
    return (
      <>
        <div>
          <h2 className={styles.header}>
            Welcome Back {session.data.user.name}!
          </h2>
          {session.data.user.role === "Corporate" && (
            <div className={styles.mainContainer}>
              <JobStatisticsModal accessToken={accessToken} userId={userId} />
              <JobApplicationModal accessToken={accessToken} userId={userId} />
              <InvoiceStatisticsModal accessToken={accessToken} userId={userId} />
            </div>
          )}
          <div className={styles.textContainer}>
            <p className={styles.text}>
              Please head to the{" "}
              <Link className={styles.link} href="/accountManagement">
                profile page
              </Link>{" "}
              to get your account set up!
            </p>
            {session.data.user.role === Enums.JOBSEEKER && (
              <p>
                You can head to{" "}
                <Link className={styles.link} href="/jobListing">
                  job listings
                </Link>{" "}
                to view the jobs that have been matched with!
              </p>
            )}
            {session.data.user.role === Enums.CORPORATE && (
              <p>
                You can head to{" "}
                <Link className={styles.link} href="/jobListingManagement">
                  create job listing
                </Link>{" "}
                to start finding your next StarHire!
              </p>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default Dashboard;
