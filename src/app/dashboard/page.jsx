"use client"
import React from 'react'
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const session = useSession();

    const router = useRouter();

    console.log("TEST" + JSON.stringify(session));
    const sessionStatus = JSON.stringify(session);

    if (sessionStatus === "loading") {
        return <p>Loading...</p>;
      }
    
    if (sessionStatus === "unauthenticated") {
        router?.push("/login");
    }

    if (sessionStatus === "authenticated") {
        return <h1>Welcome back {session.data.user.name}, {session.data.user.email}</h1>
    }
}

export default Dashboard;