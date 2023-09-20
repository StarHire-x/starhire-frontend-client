"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Hero from "public/hero.png";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>Early Childhood Industry.</h1>
        <p className={styles.subTitle}>Candidate Sourcing</p>
        <p className={styles.subTitle}>Job Matching</p>
        <p className={styles.subTitle}>An All-in-one Platform</p>
        <div className={styles.buttonContainer}>
          <button
            className={styles.register}
            onClick={() => (window.location.href = "/register")}
          >
            Register
          </button>
          
          <button
            className={styles.login}
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
        </div>
      </div>
      <div className={styles.item}></div>
      <Image src={Hero} alt="Picture" className={styles.img} />
    </div>
  );
}
