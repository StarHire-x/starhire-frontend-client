"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Hero from "public/hero.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const session = useSession();

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>The Next StarHire</h1>
        <Image src={Hero} alt="Picture" className={styles.img} />
      </div>
      <div>
        <p className={styles.subTitle}>
          Education&apos;s best talent marketplace
        </p>
      </div>
      <div>
        {!accessToken && (
          <div className={styles.buttonContainer}>
            <button
              className={styles.jobSearchButton}
              onClick={() => (window.location.href = "/login")}
            >
              Job Search
            </button>

            <button
              className={styles.findTalentButton}
              onClick={() => (window.location.href = "/login")}
            >
              Find Talent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
