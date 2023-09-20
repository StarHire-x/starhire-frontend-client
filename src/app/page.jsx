import Image from "next/image";
import styles from "./page.module.css";
import Hero from "public/hero.png";
import Button from "@/components/Button/Button";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>Early Childhood Industry.</h1>
        <p className={styles.subTitle}>Candidate Sourcing</p>
        <p className={styles.subTitle}>Job Matching</p>
        <p className={styles.subTitle}>An All-in-one Platform</p>
        <div className={styles.buttonContainer}>
          <Button url="/login" text="Login" />
        </div>
      </div>
      <div className={styles.item}></div>
      <Image src={Hero} alt="Picture" className={styles.img} />
    </div>
  );
}
