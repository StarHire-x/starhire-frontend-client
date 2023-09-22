"use client";
import React from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";

const Dashboard = () => {
  const session = useSession();

  const router = useRouter();

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
        </div>
      </>
    );
  }
};

export default Dashboard;
