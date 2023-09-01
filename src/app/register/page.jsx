"use client";

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { hashing } from "@/app/api/auth/register/route";
import { registerUser } from "@/app/api/auth/register/route";

const Register = () => {
  const [err, setErr] = useState(false);

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    const hashedPassword = await hashing(password);
    const data = {
      name: name,
      email: email,
      password: hashedPassword,
    }
    try {
      const res = await registerUser(data);
      if (res.ok) {
        router.push("/login?success=Account has been created");
      } else {
        console.error("Failed to create account");
        alert(`Error: Failed to create account`);
        setErr(true);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setErr(true); 
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="email"
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="password"
          className={styles.input}
          required
        />
        <button className={styles.button}>Register</button>
        {err && "Something went wrong!"}
      </form>
      <Link href="/login">Login with an existing account</Link>
    </div>
  );
};

export default Register;
