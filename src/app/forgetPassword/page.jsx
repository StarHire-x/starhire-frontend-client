"use client"
import React from 'react'
import styles from './page.module.css'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { forgetPassword, sendEmail } from '../api/auth/forgetPassword/route';

const ForgetPassword = () => {

    const session = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
      email: "",
      role: "",
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    if (session.status === "authenticated") {
      router?.push("/dashboard");
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      const email = formData.email;
      const role = formData.role;
      alert(`Email: ${email}, Role: ${role}`);

      const result = await forgetPassword({
        email: email,
        role: role,
      })

      if (!result.error) {
        const sendEmail = await sendEmail(result)
        alert("Success");
        router.push("/dashboard");
      } else {
        // Handle the error result.error
        alert(result.error);
      }
    };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Forget Password</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.input}
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <div className={styles.radio}>
          <label>
            <input
              type="radio"
              name="role"
              value="Job Seeker"
              checked={formData.role === "Job Seeker"}
              onChange={handleInputChange}
            />
            Job Seeker
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Corporate"
              checked={formData.role === "Corporate"}
              onChange={handleInputChange}
            />
            Corporate
          </label>
        </div>
        <button className={styles.button}>Reset Password</button>
      </form>
      <Link href="/register">I don't have an account </Link>
      <Link href="/login">Login with an existing account</Link>
    </div>
  );
}

export default ForgetPassword